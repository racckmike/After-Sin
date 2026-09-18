"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";
import { formatAmount, getProductPriceValue } from "@/lib/format";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { EditorialSubmitButton } from "@/components/ui/EditorialButton";

export default function CartPage() {
  const { lines, removeItem, updateQuantity } = useCart();
  const { region } = useRegion();
  const router = useRouter();

  // The real, locked MXN price (once set) takes precedence over the CAD
  // placeholder everywhere — this must match checkout exactly, since the
  // server computes the authoritative total from the same source
  // (lib/checkout/pricing.ts), not from anything sent by this page.
  const lineTotal = (line: (typeof lines)[number]) =>
    (getProductPriceValue(line.product, region.currency) ?? 0) * line.quantity;
  const subtotal = lines.reduce((sum, l) => sum + lineTotal(l), 0);

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-4 px-4 py-32 text-center">
        <h1 className="font-display text-3xl">Your Bag Is Empty</h1>
        <Link href="/shop" className="eyebrow underline underline-offset-4">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8 md:py-16">
      <h1 className="font-display text-4xl">Bag</h1>

      <div className="mt-10 grid gap-12 md:grid-cols-[1fr_360px]">
        <ul className="flex flex-col gap-8">
          {lines.map((line) => (
            <li key={line.key} className="flex gap-5 border-b hairline pb-8">
              <div className="w-32 shrink-0 md:w-40">
                <PlaceholderFrame label="" ratio="4 / 5" tone="dark" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/product/${line.product.slug}`} className="font-display text-lg">
                      {line.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-charcoal">
                      {line.color} · Size {line.size}
                    </p>
                  </div>
                  <p className="text-sm">{formatAmount(lineTotal(line), region.currency)}</p>
                </div>
                <div className="mt-auto flex items-center gap-4 pt-4">
                  <div className="flex items-center border hairline">
                    <button
                      type="button"
                      className="h-9 w-9"
                      onClick={() => updateQuantity(line.key, line.quantity - 1)}
                      aria-label={`Decrease quantity of ${line.product.name}`}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm" aria-live="polite">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      className="h-9 w-9"
                      onClick={() => updateQuantity(line.key, line.quantity + 1)}
                      aria-label={`Increase quantity of ${line.product.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(line.key)}
                    className="eyebrow text-charcoal underline underline-offset-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit border hairline p-6">
          <h2 className="eyebrow mb-5">Summary</h2>
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatAmount(subtotal, region.currency)}</span>
          </div>
          <p className="mt-2 text-xs text-charcoal">
            Shipping and taxes calculated at checkout.
          </p>
          {region.code !== "MX" && (
            <p className="mt-2 text-xs text-charcoal">
              Checkout is only available for Mexico right now.
            </p>
          )}
          <EditorialSubmitButton
            type="button"
            disabled={region.code !== "MX"}
            onClick={() => router.push("/checkout")}
            className="mt-6 h-12 w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            CHECKOUT
          </EditorialSubmitButton>
        </div>
      </div>
    </div>
  );
}
