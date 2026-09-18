import Link from "next/link";
import { SignatureMark } from "@/components/ui/SignatureMark";
import type { Order } from "@/lib/orders/db";
import { formatCentavosMXN } from "@/lib/checkout/pricing";

const STATUS_LABEL: Record<string, string> = {
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function OrderHistorySection({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 border-t hairline py-20 text-center">
        <SignatureMark size={20} className="opacity-40" />
        <p className="eyebrow text-charcoal">No Orders Yet</p>
        <p className="max-w-[36ch] text-sm text-charcoal">Your consequences will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/account/orders/${order.orderNumber}`}
            className="flex items-center justify-between gap-4 border hairline p-5 transition-colors hover:border-off-black"
          >
            <div>
              <p className="font-display text-base">#{order.orderNumber}</p>
              <p className="mt-1 text-xs text-charcoal">
                {new Date(order.createdAt).toLocaleDateString()} · {STATUS_LABEL[order.status] ?? order.status}
                {order.trackingNumber ? ` · Tracking: ${order.trackingNumber}` : ""}
              </p>
            </div>
            <p className="shrink-0 text-sm">{formatCentavosMXN(order.totalCentavos)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
