import type { Metadata } from "next";
import Link from "next/link";
import { getOrderByNumber } from "@/lib/orders/db";

export const metadata: Metadata = { title: "Payment Pending — AFTER SIN" };
export const dynamic = "force-dynamic";

export default async function CheckoutPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber ? await getOrderByNumber(orderNumber) : null;

  return (
    <div className="mx-auto flex max-w-[600px] flex-col items-center gap-4 px-4 py-32 text-center">
      <p className="eyebrow text-charcoal">AFTER SIN</p>
      <h1 className="font-display text-3xl">Payment Pending</h1>
      <p className="text-sm text-charcoal">
        {order ? `Order #${order.orderNumber} — ` : ""}Mercado Pago is still processing this payment method (common
        for bank transfers or cash payments). We&rsquo;ll email you as soon as it&rsquo;s confirmed.
      </p>
      <Link href="/" className="eyebrow underline underline-offset-4">
        Back to AFTER SIN
      </Link>
    </div>
  );
}
