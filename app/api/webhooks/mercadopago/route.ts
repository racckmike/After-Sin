import { NextResponse } from "next/server";
import { WebhookSignatureValidator, InvalidWebhookSignatureError } from "mercadopago";
import { paymentClient } from "@/lib/mercadopago/client";
import {
  getOrderByNumber,
  getOrderItems,
  claimOrderPaid,
  claimInventoryDecrement,
  decrementInventoryForOrder,
  claimConfirmationEmail,
  recordWebhookEvent,
} from "@/lib/orders/db";
import { sendOrderConfirmationEmail } from "@/lib/email/orderConfirmationEmail";

/**
 * Mercado Pago notifies this endpoint that SOMETHING changed for a
 * payment; the notification body itself is never trusted for the actual
 * status — after verifying the signature, this fetches the payment
 * straight from Mercado Pago's API (the only trusted source) before
 * doing anything. Reaching /checkout/success in the browser proves
 * nothing on its own; this webhook is what actually marks an order paid.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const url = new URL(request.url);

  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[mp-webhook] MERCADOPAGO_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    WebhookSignatureValidator.validate({
      xSignature: request.headers.get("x-signature"),
      xRequestId: request.headers.get("x-request-id"),
      dataId: url.searchParams.get("data.id"),
      secret,
      toleranceSeconds: 300,
    });
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) {
      console.error("[mp-webhook] signature rejected", error.reason);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    throw error;
  }

  let payload: { id?: number; type?: string; data?: { id?: string } };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const notificationId = String(payload.id ?? `${payload.type}:${payload.data?.id}:${Date.now()}`);
  await recordWebhookEvent(notificationId, payload.type ?? "unknown");

  if (payload.type !== "payment" || !payload.data?.id) {
    return NextResponse.json({ received: true });
  }

  const payment = await paymentClient().get({ id: payload.data.id });

  if (payment.status !== "approved") {
    // pending / rejected / in_process / cancelled — nothing to do yet;
    // Mercado Pago will send another notification if it changes.
    return NextResponse.json({ received: true, status: payment.status });
  }

  const orderNumber = payment.external_reference;
  if (!orderNumber) {
    console.error("[mp-webhook] approved payment with no external_reference", payment.id);
    return NextResponse.json({ received: true });
  }

  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    console.error(`[mp-webhook] approved payment for unknown order ${orderNumber}`);
    return NextResponse.json({ received: true });
  }

  // Defense in depth: the amount actually paid must match what we charged
  // for. A mismatch here means something is very wrong upstream — don't
  // silently mark it paid.
  const paidCentavos = Math.round((payment.transaction_amount ?? 0) * 100);
  if (paidCentavos !== order.totalCentavos || payment.currency_id !== order.currency) {
    console.error(
      `[mp-webhook] amount/currency mismatch for ${orderNumber}: expected ${order.totalCentavos} ${order.currency}, got ${paidCentavos} ${payment.currency_id}`
    );
    return NextResponse.json({ received: true, error: "amount_mismatch" });
  }

  const claimed = await claimOrderPaid(orderNumber, String(payment.id));
  if (!claimed) {
    // Already processed by a previous delivery of this (or an equivalent) event.
    return NextResponse.json({ received: true, alreadyProcessed: true });
  }

  const items = await getOrderItems(claimed.id);

  if (await claimInventoryDecrement(orderNumber)) {
    try {
      const results = await decrementInventoryForOrder(items);
      for (const r of results) {
        if (r.remaining === 0) {
          console.warn(`[mp-webhook] ${orderNumber}: ${r.productSlug} ${r.color}/${r.size} hit 0 stock — check for oversell`);
        }
      }
    } catch (error) {
      console.error(`[mp-webhook] inventory decrement failed for ${orderNumber} — order is PAID, needs manual stock review`, error);
    }
  }

  if (await claimConfirmationEmail(orderNumber)) {
    try {
      await sendOrderConfirmationEmail(claimed, items);
    } catch (error) {
      console.error(`[mp-webhook] confirmation email failed for ${orderNumber}`, error);
    }
  }

  return NextResponse.json({ received: true, orderNumber });
}
