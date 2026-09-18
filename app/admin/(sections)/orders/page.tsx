import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders — AFTER SIN Admin", robots: { index: false, follow: false } };

/**
 * There is no payment/checkout integration yet (app/cart's CHECKOUT
 * button has no handler, and data/products.ts is explicitly a mock
 * commerce layer awaiting a real backend). This page intentionally
 * shows an honest empty state instead of a fabricated orders table —
 * see the FINAL REPORT for what's needed to make this real.
 */
export default function AdminOrdersPage() {
  return (
    <div>
      <p className="eyebrow text-charcoal">Orders</p>
      <h1 className="mt-2 font-display text-3xl">No Orders Yet</h1>
      <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-charcoal">
        AFTER SIN doesn&rsquo;t have a payment/checkout integration connected yet, so
        there&rsquo;s no real order data to show. Once a payment provider (Stripe,
        Shopify, or otherwise) is wired up and writing verified orders to the
        database, this page will list them — number, customer, products,
        totals, payment status, fulfillment status, and tracking.
      </p>
    </div>
  );
}
