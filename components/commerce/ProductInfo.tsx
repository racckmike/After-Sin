"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { SizeSelector } from "@/components/commerce/SizeSelector";
import { Accordion } from "@/components/ui/Accordion";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";
import { formatPrice } from "@/lib/format";

export function ProductInfo({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const { addItem, openCart } = useCart();
  const { region } = useRegion();

  const soldOut = product.status === "sold-out";
  const comingSoon = product.status === "coming-soon";
  const canAdd = !soldOut && !comingSoon && size !== null;

  return (
    <div className="flex flex-col">
      <p className="eyebrow text-charcoal">AFTER SIN {product.world.toUpperCase()}</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl">{product.name}</h1>
      <p className="mt-3 text-lg">{formatPrice(product.price, region.currency)}</p>

      {(soldOut || comingSoon || product.status === "low-stock") && (
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
              onClick={() => setColor(c.name)}
              aria-label={c.name}
              aria-pressed={color === c.name}
              className={`h-8 w-8 rounded-full border-2 transition-shadow ${
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
        />
      </div>

      <div className="mt-7">
        {comingSoon ? (
          notified ? (
            <p className="eyebrow flex h-12 items-center justify-center border border-off-black">
              We&rsquo;ll email you
            </p>
          ) : (
            <form
              className="flex h-12 items-stretch border border-off-black"
              onSubmit={(e) => {
                e.preventDefault();
                if (notifyEmail) setNotified(true);
              }}
            >
              <label htmlFor="notify-email" className="sr-only">
                Email for notification
              </label>
              <input
                id="notify-email"
                type="email"
                required
                placeholder="EMAIL"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="eyebrow flex-1 bg-transparent px-4 placeholder:text-charcoal/50 focus:outline-none"
              />
              <button type="submit" className="eyebrow px-5 transition-opacity hover:opacity-60">
                NOTIFY ME
              </button>
            </form>
          )
        ) : (
          <button
            type="button"
            disabled={!canAdd}
            onClick={() => {
              if (!canAdd || !size) return;
              addItem(product, color, size);
              openCart();
            }}
            className="flex h-12 w-full items-center justify-center bg-off-black text-sm tracking-[0.08em] text-bone transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {soldOut ? "SOLD OUT" : size ? "ADD TO BAG" : "SELECT A SIZE"}
          </button>
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
