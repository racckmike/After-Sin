"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { getOrderByNumber, setFulfillment } from "@/lib/orders/db";
import { logAdminAction } from "@/lib/admin/db";
import { sendShippingEmail } from "@/lib/email/shippingEmail";

export interface ActionResult {
  error?: string;
  success?: boolean;
  /** The mutation itself committed even though the action is reporting an error (e.g. fulfillment saved, only the follow-up email failed) — the UI should still refresh to show the real state. */
  dataChanged?: boolean;
}

const CARRIER_TRACK_URLS: Record<string, (n: string) => string> = {
  "Estafeta": (n) => `https://www.estafeta.com/Herramientas/Rastreo?guias=${encodeURIComponent(n)}`,
  "DHL": (n) => `https://www.dhl.com/mx-es/home/tracking/tracking-express.html?submit=1&tracking-id=${encodeURIComponent(n)}`,
  "FedEx": (n) => `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(n)}`,
  "Correos de México": () => `https://www.correosdemexico.gob.mx/SSLServicios/ConsultaEnLinea/Consulta.aspx`,
};

/**
 * Admin-only, server-verified role check (requireAdmin) — never trusts
 * that the UI only rendered this for admins, since a form action is a
 * real network endpoint regardless of what the page shows.
 */
export async function markShippedAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();

  const orderNumber = String(formData.get("orderNumber") ?? "");
  const carrier = String(formData.get("carrier") ?? "").trim();
  const trackingNumber = String(formData.get("trackingNumber") ?? "").trim();

  if (!carrier || !trackingNumber) return { error: "Enter a carrier and tracking number." };

  const order = await getOrderByNumber(orderNumber);
  if (!order) return { error: "Order not found." };
  if (order.status === "pending_payment") return { error: "This order hasn't been paid yet." };

  await setFulfillment(order.id, "shipped", carrier, trackingNumber);
  await logAdminAction(admin.id, admin.email, "order_marked_shipped", `order:${orderNumber}`, { carrier, trackingNumber });

  try {
    const trackingUrl = CARRIER_TRACK_URLS[carrier]?.(trackingNumber) ?? null;
    await sendShippingEmail({ ...order, trackingCarrier: carrier, trackingNumber }, trackingUrl);
  } catch (error) {
    console.error(`[admin] shipping email failed for ${orderNumber}`, error);
    return { error: "Marked as shipped, but the email failed to send. Check server logs.", dataChanged: true };
  }

  return { success: true };
}
