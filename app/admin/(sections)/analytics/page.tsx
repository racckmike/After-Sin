import type { Metadata } from "next";
import { salesAnalytics, salesByProduct } from "@/lib/orders/db";
import { formatCentavosMXN } from "@/lib/checkout/pricing";

export const metadata: Metadata = { title: "Analytics — AFTER SIN Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border hairline p-6">
      <p className="eyebrow text-charcoal">{label}</p>
      <p className="mt-3 font-display text-2xl">{value}</p>
    </div>
  );
}

/**
 * Every number here comes straight from orders/order_items (status !=
 * pending_payment, i.e. an order Mercado Pago's webhook actually
 * confirmed) — nothing is estimated or fabricated. Net sales, refunds,
 * and discount-usage reporting aren't shown because there's no refund
 * execution or discount system built yet to generate that data honestly.
 */
export default async function AdminAnalyticsPage() {
  const [stats, byProduct] = await Promise.all([salesAnalytics(), salesByProduct()]);

  if (stats.orderCount === 0) {
    return (
      <div>
        <p className="eyebrow text-charcoal">Analytics</p>
        <h1 className="mt-2 font-display text-3xl">No Sales Data Yet</h1>
        <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-charcoal">
          Nothing here is fabricated — these numbers populate automatically once a real, Mercado-Pago-confirmed
          order exists.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="eyebrow text-charcoal">Analytics</p>
      <h1 className="mt-2 font-display text-3xl">Sales</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric label="Gross Sales" value={formatCentavosMXN(stats.grossSalesCentavos)} />
        <Metric label="Orders" value={String(stats.orderCount)} />
        <Metric label="Units Sold" value={String(stats.unitsSold)} />
        <Metric label="Average Order Value" value={formatCentavosMXN(stats.averageOrderValueCentavos)} />
      </div>

      <div className="mt-10 border-t hairline pt-8">
        <p className="eyebrow text-off-black">Sales By Product</p>
        <table className="mt-4 w-full min-w-[420px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b hairline text-charcoal">
              <th className="eyebrow py-3 pr-4 font-normal">Product</th>
              <th className="eyebrow py-3 pr-4 font-normal">Units Sold</th>
              <th className="eyebrow py-3 font-normal">Gross</th>
            </tr>
          </thead>
          <tbody>
            {byProduct.map((row) => (
              <tr key={row.productSlug} className="border-b hairline">
                <td className="py-3 pr-4">{row.productName}</td>
                <td className="py-3 pr-4 text-charcoal">{row.unitsSold}</td>
                <td className="py-3 text-charcoal">{formatCentavosMXN(row.grossCentavos)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-10 max-w-[60ch] text-sm leading-relaxed text-charcoal">
        Net sales, discount usage, and refund reporting aren&rsquo;t shown yet — there&rsquo;s no discount system or
        refund execution built to generate that data honestly. Date-range filtering is deferred until there&rsquo;s
        enough order history to make it useful.
      </p>
    </div>
  );
}
