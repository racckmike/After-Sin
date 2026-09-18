import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderByNumber, getOrderItems } from "@/lib/orders/db";
import { formatCentavosMXN } from "@/lib/checkout/pricing";
import { MarkShippedForm } from "@/components/admin/MarkShippedForm";

export const metadata: Metadata = { title: "Order — AFTER SIN Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Pending Payment",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  const items = await getOrderItems(order.id);
  const addr = order.shippingAddress;

  return (
    <div>
      <p className="eyebrow text-charcoal">Order</p>
      <h1 className="mt-2 font-display text-3xl">#{order.orderNumber}</h1>
      <p className="mt-2 text-sm text-charcoal">
        {new Date(order.createdAt).toLocaleString()} · {STATUS_LABEL[order.status] ?? order.status}
      </p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="eyebrow text-charcoal">Customer</dt>
          <dd className="mt-1 text-sm">{order.email}</dd>
        </div>
        <div>
          <dt className="eyebrow text-charcoal">Payment Reference</dt>
          <dd className="mt-1 text-sm">{order.mpPaymentId ?? "—"}</dd>
        </div>
      </dl>

      <div className="mt-10 border-t hairline pt-8">
        <p className="eyebrow text-off-black">Items</p>
        <ul className="mt-4 flex flex-col gap-4">
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
          {order.discountCentavos > 0 && (
            <div className="flex justify-between">
              <span className="text-charcoal">Discount</span>
              <span>&minus;{formatCentavosMXN(order.discountCentavos)}</span>
            </div>
          )}
          <div className="flex justify-between font-display text-base">
            <span>Total</span>
            <span>{formatCentavosMXN(order.totalCentavos)} MXN</span>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t hairline pt-8">
        <p className="eyebrow text-off-black">Shipping Address</p>
        <p className="mt-2 text-sm leading-relaxed">
          {addr.fullName}
          <br />
          {addr.line1}
          {addr.line2 ? `, ${addr.line2}` : ""}
          <br />
          {addr.city}, {addr.region} {addr.postalCode}
          <br />
          {addr.country}
          {addr.phone ? ` · ${addr.phone}` : ""}
        </p>
      </div>

      <div className="mt-10 border-t hairline pt-8">
        <p className="eyebrow text-off-black">Fulfillment</p>
        {order.trackingNumber ? (
          <p className="mt-2 text-sm">
            Shipped via {order.trackingCarrier} — {order.trackingNumber}
          </p>
        ) : order.status === "pending_payment" ? (
          <p className="mt-2 text-sm text-charcoal">This order hasn&rsquo;t been paid yet.</p>
        ) : (
          <MarkShippedForm orderNumber={order.orderNumber} />
        )}
      </div>
    </div>
  );
}
