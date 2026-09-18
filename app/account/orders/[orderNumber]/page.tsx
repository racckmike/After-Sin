import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionSafe } from "@/lib/auth/session";
import { getOrderForCustomer, getOrderItems } from "@/lib/orders/db";
import { formatCentavosMXN } from "@/lib/checkout/pricing";

export const metadata: Metadata = { title: "Order — AFTER SIN" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

/**
 * getOrderForCustomer scopes the query by user_id server-side — a
 * different customer's order number returns null here exactly the same
 * as a nonexistent one (notFound()), so this page can't be used to probe
 * which order numbers exist for someone else's account.
 */
export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const { data: session } = await getSessionSafe();
  if (!session?.user) notFound();

  const order = await getOrderForCustomer(orderNumber, session.user.id);
  if (!order) notFound();

  const items = await getOrderItems(order.id);
  const addr = order.shippingAddress;

  return (
    <div className="mx-auto max-w-[700px] px-4 py-12 md:py-16">
      <Link href="/account" className="eyebrow text-charcoal underline underline-offset-4">
        &larr; Back to Account
      </Link>

      <p className="eyebrow mt-6 text-charcoal">Order</p>
      <h1 className="mt-2 font-display text-3xl">#{order.orderNumber}</h1>
      <p className="mt-2 text-sm text-charcoal">
        {new Date(order.createdAt).toLocaleDateString()} · {STATUS_LABEL[order.status] ?? order.status}
      </p>

      <div className="mt-10 border-t hairline pt-8">
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
      </div>

      {order.trackingNumber && (
        <div className="mt-10 border-t hairline pt-8">
          <p className="eyebrow text-off-black">Tracking</p>
          <p className="mt-2 text-sm">
            {order.trackingCarrier} — {order.trackingNumber}
          </p>
        </div>
      )}

      <div className="mt-10 border-t hairline pt-8">
        <p className="eyebrow text-off-black">Shipping To</p>
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
    </div>
  );
}
