import Link from "next/link";
import { formatCentavosMXN } from "@/lib/checkout/pricing";

function Metric({ label, value, note }: { label: string; value: string; note?: React.ReactNode }) {
  return (
    <div className="border hairline p-6">
      <p className="eyebrow text-charcoal">{label}</p>
      <p className="mt-3 font-display text-3xl">{value}</p>
      {note && <p className="mt-1 text-xs text-charcoal">{note}</p>}
    </div>
  );
}

export function AdminOverview({
  waitlistCount,
  customerCount,
  orderStats,
  toFulfill,
}: {
  waitlistCount: number;
  customerCount: number;
  orderStats: { orders: number; totalCentavos: number };
  toFulfill: number;
}) {
  const averageOrderValue = orderStats.orders > 0 ? Math.round(orderStats.totalCentavos / orderStats.orders) : 0;

  return (
    <div>
      <p className="eyebrow text-charcoal">Overview</p>
      <h1 className="mt-2 font-display text-3xl">Business Snapshot</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Metric label="Total Sales" value={formatCentavosMXN(orderStats.totalCentavos)} />
        <Metric
          label="Total Orders"
          value={String(orderStats.orders)}
          note={
            <Link href="/admin/orders" className="underline underline-offset-4">
              View orders
            </Link>
          }
        />
        <Metric label="Average Order Value" value={formatCentavosMXN(averageOrderValue)} />
        <Metric label="Customers" value={String(customerCount)} />
        <Metric
          label="Waitlist Members"
          value={String(waitlistCount)}
          note={
            <Link href="/admin/waitlist" className="underline underline-offset-4">
              View list
            </Link>
          }
        />
        <Metric label="Orders To Fulfill" value={String(toFulfill)} />
      </div>

      {orderStats.orders === 0 && (
        <p className="mt-10 max-w-[60ch] text-sm leading-relaxed text-charcoal">
          No paid orders yet — these numbers will update automatically once a real checkout completes. See{" "}
          <Link href="/admin/orders" className="underline underline-offset-4">
            Orders
          </Link>{" "}
          for the current test-mode status.
        </p>
      )}
    </div>
  );
}
