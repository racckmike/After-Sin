"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { SizeSelector } from "@/components/commerce/SizeSelector";
import { Accordion } from "@/components/ui/Accordion";
import { MagneticSubmitButton } from "@/components/ui/MagneticButton";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";
import { getProductPrice } from "@/lib/format";

interface Props {
  product: Product;
  color: string;
  onColorChange: (color: string) => void;
}

export function ProductInfo({ product, color, onColorChange }: Props) {
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [notifyError, setNotifyError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { addItem, openCart } = useCart();
  const { region } = useRegion();

  const soldOut = product.status === "sold-out";
  const comingSoon = product.status === "coming-soon";
  const canAdd = !soldOut && !comingSoon && size !== null;
  // a locked MXN price shows a real number in both currencies instead of
  // the word "coming soon", so that status needs to surface separately
  const priceIsLocked = product.priceMXN != null;

  return (
    <div className="flex flex-col" data-collection={product.collectionSlug}>
      <p className="eyebrow text-[var(--accent)]">AFTER SIN {product.world.toUpperCase()}</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">{product.name}</h1>
      <p className="mt-3 text-lg">{getProductPrice(product, region.currency)}</p>

      {(soldOut || product.status === "low-stock" || (comingSoon && priceIsLocked)) && (
        <p className="eyebrow mt-3 text-charcoal">
          {soldOut ? "Sold Out" : comingSoon ? "Coming Soon" : "Low Stock"}
        </p>
      )}

      <div className="mt-8">
        <p className="eyebrow mb-2">Color — {color}</p>
        <div className="flex gap-2">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => onColorChange(c.name)}
              aria-label={c.name}
              aria-pressed={color === c.name}
              className={`h-8 w-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                color === c.name ? "border-off-black" : "border-transparent"
              }`}
              style={{ backgroundColor: c.swatch }}
            />
          ))}
        </div>
      </div>

      <div className="mt-7">
        <SizeSelector
          sizes={product.sizes}
          soldOutSizes={product.soldOutSizes}
          selected={size}
          onSelect={setSize}
          fitNotes={product.fit}
        />
      </div>

      {!soldOut && !comingSoon && (
        <div className="mt-7">
          <p className="eyebrow mb-2">Quantity</p>
          <div className="flex h-11 w-32 items-center justify-between border border-off-black/70">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="flex h-full w-11 items-center justify-center text-lg transition-opacity hover:opacity-60"
            >
              −
            </button>
            <span aria-live="polite" className="text-sm">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              aria-label="Increase quantity"
              className="flex h-full w-11 items-center justify-center text-lg transition-opacity hover:opacity-60"
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="mt-7">
        {comingSoon ? (
          notified ? (
            <p className="eyebrow flex h-12 items-center justify-center border border-off-black">
              You&rsquo;re on the waitlist
            </p>
          ) : (
            <>
              <form
                className="flex h-12 items-stretch border border-off-black"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!notifyEmail || submitting) return;
                  setSubmitting(true);
                  setNotifyError(null);
                  try {
                    const res = await fetch("/api/waitlist", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: notifyEmail, productSlug: product.slug }),
                    });
                    if (!res.ok) {
                      const data = await res.json().catch(() => null);
                      throw new Error(data?.error ?? "Something went wrong");
                    }
                    setNotified(true);
                  } catch (err) {
                    setNotifyError(err instanceof Error ? err.message : "Something went wrong");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <label htmlFor="notify-email" className="sr-only">
                  Email for waitlist
                </label>
                <input
                  id="notify-email"
                  type="email"
                  required
                  placeholder="EMAIL"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  disabled={submitting}
                  className="eyebrow flex-1 bg-transparent px-4 placeholder:text-charcoal/50 focus:outline-none disabled:opacity-60"
                />
                <MagneticSubmitButton
                  type="submit"
                  disabled={submitting}
                  className="eyebrow px-5 transition-opacity hover:opacity-60 disabled:opacity-40"
                >
                  {submitting ? "…" : "JOIN WAITLIST"}
                </MagneticSubmitButton>
              </form>
              {notifyError && <p className="eyebrow mt-2 text-red-800">{notifyError}</p>}
            </>
          )
        ) : (
          <MagneticSubmitButton
            type="button"
            disabled={!canAdd}
            onClick={() => {
              if (!canAdd || !size) return;
              addItem(product, color, size, quantity);
              openCart();
            }}
            className="flex h-12 w-full items-center justify-center bg-off-black text-sm tracking-[0.08em] text-bone transition-all duration-200 hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
          >
            {soldOut ? "SOLD OUT" : size ? "ADD TO BAG" : "SELECT A SIZE"}
          </MagneticSubmitButton>
        )}
      </div>

      <div className="mt-10">
        <Accordion
          items={[
            {
              title: "Product Details",
              content: (
                <ul className="flex flex-col gap-1.5">
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              ),
            },
            {
              title: "Fit",
              content: (
                <ul className="flex flex-col gap-1.5">
                  {product.fit.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              ),
            },
            {
              title: "Materials",
              content: (
                <ul className="flex flex-col gap-1.5">
                  {product.materials.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              ),
            },
            {
              title: "Care",
              content: (
                <ul className="flex flex-col gap-1.5">
                  {product.care.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              ),
            },
            {
              title: "Shipping / Returns",
              content: (
                <p>
                  Ships from Toronto. Rates and delivery estimates shown at checkout.
                  Full policy on the{" "}
                  <a href="/shipping" className="underline underline-offset-4">
                    Shipping
                  </a>{" "}
                  and{" "}
                  <a href="/returns" className="underline underline-offset-4">
                    Returns
                  </a>{" "}
                  pages.
                </p>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
