import { NextResponse } from "next/server";
import { getSessionSafe } from "@/lib/auth/session";
import { priceCartItem, shippingCentavos, CHECKOUT_CURRENCY } from "@/lib/checkout/pricing";
import { createOrder, attachPreference, getAvailableStock, seedInventoryIfMissing } from "@/lib/orders/db";
import { preferenceClient } from "@/lib/mercadopago/client";

interface CheckoutRequestItem {
  slug?: string;
  color?: string;
  size?: string;
  quantity?: number;
}

interface CheckoutRequestBody {
  items?: CheckoutRequestItem[];
  email?: string;
  shippingAddress?: {
    fullName?: string;
    line1?: string;
    line2?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Only checked here as a soft pre-flight (so a customer doesn't get sent
 * to Mercado Pago for something that's already out of stock) — the
 * authoritative check-and-decrement happens in the webhook handler after
 * confirmed payment, where it has to be race-safe against a second buyer
 * hitting the same variant at the same moment.
 */
async function ensureSoftStock(slug: string, color: string, size: string, quantity: number): Promise<string | null> {
  // AFTER SIN doesn't run its own inventory system yet for most SKUs — seed
  // a starting count the first time a variant is actually purchasable, so
  // checkout has real numbers to check/decrement against instead of
  // silently treating everything as unlimited. See FINAL REPORT: this
  // placeholder quantity is not a real launch stock count.
  await seedInventoryIfMissing(slug, color, size, 10);
  const available = await getAvailableStock(slug, color, size);
  if (available < quantity) return `Not enough stock for ${slug} (${color}, ${size}).`;
  return null;
}

export async function POST(request: Request) {
  let body: CheckoutRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }
  if (body.items.length > 20) {
    return NextResponse.json({ error: "Too many items." }, { status: 400 });
  }

  const addr = body.shippingAddress;
  if (
    !addr?.fullName?.trim() ||
    !addr.line1?.trim() ||
    !addr.city?.trim() ||
    !addr.region?.trim() ||
    !addr.postalCode?.trim()
  ) {
    return NextResponse.json({ error: "Fill in all required shipping fields." }, { status: 400 });
  }
  // Mercado Pago Mexico only supports MXN from a Mexican merchant account —
  // checkout is intentionally scoped to Mexico for now (see FINAL REPORT).
  if (addr.country && addr.country !== "Mexico") {
    return NextResponse.json({ error: "Checkout is only available for Mexico right now." }, { status: 400 });
  }

  const { data: session } = await getSessionSafe();
  const userId = session?.user?.id ?? null;
  const email = (session?.user?.email || body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const priced = [];
  for (const rawItem of body.items) {
    const slug = String(rawItem.slug ?? "");
    const color = String(rawItem.color ?? "");
    const size = String(rawItem.size ?? "");
    const quantity = Number(rawItem.quantity ?? 0);

    const result = priceCartItem({ slug, color, size, quantity });
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

    const stockError = await ensureSoftStock(slug, color, size, quantity);
    if (stockError) return NextResponse.json({ error: stockError }, { status: 409 });

    priced.push(result);
  }

  const subtotalCentavos = priced.reduce((sum, item) => sum + item.lineTotalCentavos, 0);
  const shipping = shippingCentavos("MX");
  const totalCentavos = subtotalCentavos + shipping;

  const order = await createOrder({
    userId,
    email,
    currency: CHECKOUT_CURRENCY,
    subtotalCentavos,
    shippingCentavos: shipping,
    totalCentavos,
    shippingAddress: {
      fullName: addr.fullName.trim(),
      line1: addr.line1.trim(),
      line2: addr.line2?.trim() ?? "",
      city: addr.city.trim(),
      region: addr.region.trim(),
      postalCode: addr.postalCode.trim(),
      country: "Mexico",
      phone: addr.phone?.trim() ?? "",
    },
    items: priced.map((item) => ({
      productSlug: item.product.slug,
      productName: item.product.name,
      variantColor: item.color,
      variantSize: item.size,
      unitPriceCentavos: item.unitPriceCentavos,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
    })),
  });

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
  const isPublicHttps = siteUrl.startsWith("https://");

  try {
    const preference = await preferenceClient().create({
      body: {
        items: priced.map((item) => ({
          id: `${item.product.slug}__${item.color}__${item.size}`,
          title: `${item.product.name} — ${item.color} / ${item.size}`,
          quantity: item.quantity,
          unit_price: item.unitPriceCentavos / 100,
          currency_id: CHECKOUT_CURRENCY,
        })),
        shipments: {
          cost: shipping / 100,
          mode: "not_specified",
        },
        payer: { email },
        external_reference: order.orderNumber,
        back_urls: {
          success: `${siteUrl}/checkout/success?order=${order.orderNumber}`,
          pending: `${siteUrl}/checkout/pending?order=${order.orderNumber}`,
          failure: `${siteUrl}/checkout/failure?order=${order.orderNumber}`,
        },
        auto_return: "approved",
        // Omitted on non-HTTPS (local dev) origins so Mercado Pago falls
        // back to the dashboard-configured notification URL instead of a
        // localhost one it would reject anyway.
        ...(isPublicHttps ? { notification_url: `${siteUrl}/api/webhooks/mercadopago` } : {}),
        statement_descriptor: "AFTER SIN",
      },
    });

    if (!preference.id) throw new Error("Mercado Pago did not return a preference id");
    await attachPreference(order.id, preference.id);

    const checkoutUrl = preference.sandbox_init_point || preference.init_point;
    if (!checkoutUrl) throw new Error("Mercado Pago did not return a checkout URL");

    return NextResponse.json({ checkoutUrl, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("[checkout] Mercado Pago preference creation failed", error);
    return NextResponse.json({ error: "Couldn't start checkout. Please try again." }, { status: 502 });
  }
}
