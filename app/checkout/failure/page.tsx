import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Payment Not Completed — AFTER SIN" };

export default function CheckoutFailurePage() {
  return (
    <div className="mx-auto flex max-w-[600px] flex-col items-center gap-4 px-4 py-32 text-center">
      <p className="eyebrow text-charcoal">AFTER SIN</p>
      <h1 className="font-display text-3xl">Payment Not Completed</h1>
      <p className="text-sm text-charcoal">
        Your payment wasn&rsquo;t completed and you haven&rsquo;t been charged. Your bag is still saved — you can try
        again whenever you&rsquo;re ready.
      </p>
      <Link
        href="/cart"
        className="flex h-12 w-full max-w-[280px] items-center justify-center bg-off-black text-sm tracking-[0.08em] text-bone transition-opacity hover:opacity-85"
      >
        BACK TO BAG
      </Link>
    </div>
  );
}
