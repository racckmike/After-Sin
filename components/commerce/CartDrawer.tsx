"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";
import { formatAmount, getProductPriceValue } from "@/lib/format";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";

export function CartDrawer() {
  const { lines, isOpen, closeCart, removeItem, updateQuantity, count } = useCart();
  const { region } = useRegion();

  // Same rule as /cart and /checkout: a locked MXN price always wins over
  // the CAD placeholder, so this matches what checkout will actually charge.
  const lineTotal = (line: (typeof lines)[number]) =>
    (getProductPriceValue(line.product, region.currency) ?? 0) * line.quantity;
  const subtotal = lines.reduce((sum, l) => sum + lineTotal(l), 0);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-off-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />
      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-bone transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping bag"
      >
        <div
          className="flex items-center justify-between border-b hairline px-6 py-5"
          style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top, 0px))" }}
        >
          <h2 className="eyebrow">Bag ({count})</h2>
          <button type="button" onClick={closeCart} aria-label="Close bag" className="text-xl leading-none">
            &times;
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-charcoal">Your bag is empty.</p>
            <Link href="/shop" onClick={closeCart} className="eyebrow underline underline-offset-4">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <ul className="flex flex-col gap-6">
              {lines.map((line) => (
                <li key={line.key} className="flex gap-4">
                  <div className="relative h-28 w-20 shrink-0">
                    <PlaceholderFrame label="" className="h-full w-full" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-base leading-tight">
                          {line.product.name}
                        </p>
                        <p className="text-xs text-charcoal">
                          {line.color} · {line.size}
                        </p>
                      </div>
                      <p className="text-sm">
                        {formatAmount(lineTotal(line), region.currency)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border hairline">
                        <button
                          type="button"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(line.key, line.quantity - 1)}
                          aria-label={`Decrease quantity of ${line.product.name}`}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm" aria-live="polite">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          className="h-7 w-7"
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
          </div>
        )}

        {lines.length > 0 && (
          <div
            className="border-t hairline px-6 py-5"
            style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))" }}
          >
            <div className="mb-4 flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatAmount(subtotal, region.currency)}</span>
            </div>
            <p className="mb-4 text-xs text-charcoal">
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              href="/cart"
              onClick={closeCart}
              className="flex h-12 w-full items-center justify-center bg-off-black text-sm tracking-[0.08em] text-bone transition-opacity hover:opacity-85"
            >
              VIEW BAG / CHECKOUT
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
