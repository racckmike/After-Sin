import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics — AFTER SIN Admin", robots: { index: false, follow: false } };

export default function AdminAnalyticsPage() {
  return (
    <div>
      <p className="eyebrow text-charcoal">Analytics</p>
      <h1 className="mt-2 font-display text-3xl">No Sales Data Yet</h1>
      <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-charcoal">
        Sales analytics (gross/net sales, units sold, sales by product/variant/size,
        average order value, discount usage) depend on real order data, which
        depends on a connected payment provider — see{" "}
        <a href="/admin/orders" className="underline underline-offset-4">
          Orders
        </a>
        . Nothing here is fabricated in the meantime.
      </p>
    </div>
  );
}
