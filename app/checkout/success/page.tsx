import type { Metadata } from "next";
import Link from "next/link";
import { getOrderByNumber, getOrderItems } from "@/lib/orders/db";
import { formatCentavosMXN } from "@/lib/checkout/pricing";
import { ClearCartOnMount } from "@/components/commerce/ClearCartOnMount";

export const metadata: Metadata = { title: "Order Confirmed — AFTER SIN" };
export const dynamic = "force-dynamic";

/**
 * The query string only ever supplies which order to look up — every
 * other fact shown here (items, totals, address, and whether it's
 * actually paid) comes from the database, which only the Mercado Pago
 * webhook is allowed to update. Reaching this page proves nothing by
 * itself; if the webhook hasn't landed yet, this shows a processing
 * state instead of a false "confirmed."
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber ? await getOrderByNumber(orderNumber) : null;

  if (!order) {
    return (
      <div className="mx-auto flex max-w-[600px] flex-col items-center gap-4 px-4 py-32 text-center">
        <h1 className="font-display text-3xl">Order Not Found</h1>
        <p className="text-sm text-charcoal">
          We couldn&rsquo;t find that order. If you completed a payment, check your email for confirmation.
        </p>
        <Link href="/" className="eyebrow underline underline-offset-4">
          Back to AFTER SIN
        </Link>
      </div>
    );
  }

  if (order.status === "pending_payment") {
    return (
      <div className="mx-auto flex max-w-[600px] flex-col items-center gap-4 px-4 py-32 text-center">
        <p className="eyebrow text-charcoal">AFTER SIN</p>
        <h1 className="font-display text-3xl">Confirming Your Payment</h1>
        <p className="text-sm text-charcoal">
          Order #{order.orderNumber} — this usually takes a few seconds. Refresh in a moment, or check your email —
          we&rsquo;ll send confirmation as soon as it&rsquo;s verified.
        </p>
        <Link href="/" className="eyebrow underline underline-offset-4">
          Back to AFTER SIN
        </Link>
      </div>
    );
  }

  const items = await getOrderItems(order.id);
  const addr = order.shippingAddress;

  return (
    <div className="mx-auto max-w-[700px] px-4 py-16 md:py-24">
      <ClearCartOnMount />
      <div className="text-center">
        <p className="eyebrow text-charcoal">AFTER SIN</p>
        <h1 className="mt-2 font-display text-4xl">Order Confirmed</h1>
        <p className="eyebrow mt-3 text-charcoal">Your consequence has been set in motion.</p>
        <p className="mt-4 text-sm text-charcoal">Order #{order.orderNumber}</p>
      </div>

      <div className="mt-12 border-t hairline pt-8">
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 text-sm">
              <span>
                {item.productName}
                <span className="block text-xs text-charcoal">
                  {item.variantColor} · {item.variantSize} · Qty {item.quantity}
                </span>
              </span>
              <span className="shrink-0">{formatCentavosMXN(item.unitPriceCentavos * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-2 border-t hairline pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-charcoal">Subtotal</span>
            <span>{formatCentavosMXN(order.subtotalCentavos)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal">Shipping</span>
            <span>{formatCentavosMXN(order.shippingCentavos)}</span>
          </div>
          <div className="flex justify-between font-display text-base">
            <span>Total</span>
            <span>{formatCentavosMXN(order.totalCentavos)}</span>
          </div>
        </div>

        <div className="mt-8 border-t hairline pt-6">
          <p className="eyebrow text-charcoal">Shipping To</p>
          <p className="mt-2 text-sm leading-relaxed">
            {addr.fullName}
            <br />
            {addr.line1}
            {addr.line2 ? `, ${addr.line2}` : ""}
            <br />
            {addr.city}, {addr.region} {addr.postalCode}
            <br />
            {addr.country}
          </p>
        </div>

        <p className="mt-8 text-sm text-charcoal">A confirmation has been sent to {order.email}.</p>
      </div>

      <div className="mt-12 text-center">
        <p className="eyebrow text-charcoal">Every action leaves a consequence.</p>
        <Link href="/shop" className="mt-6 inline-block eyebrow underline underline-offset-4">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
