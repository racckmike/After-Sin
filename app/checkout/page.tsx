"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCentavosMXN } from "@/lib/checkout/pricing";

function inputClass() {
  return "h-12 w-full border border-off-black bg-transparent px-4 text-sm outline-none disabled:opacity-60";
}

export default function CheckoutPage() {
  const { lines } = useCart();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cart holds real Product objects with a placeholder CAD price; the
  // actual MXN total charged is authoritative-server-computed (see
  // lib/checkout/pricing.ts) and shown on Mercado Pago's own page before
  // payment — this is only a customer-facing estimate of what to expect.
  const estimatedMXN = lines.reduce((sum, l) => sum + (l.product.priceMXN ?? 0) * l.quantity, 0);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setError(null);

    if (!fullName.trim() || !line1.trim() || !city.trim() || !region.trim() || !postalCode.trim()) {
      setError("Fill in all required shipping fields.");
      return;
    }
    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ slug: l.product.slug, color: l.color, size: l.size, quantity: l.quantity })),
          email,
          shippingAddress: { fullName, line1, line2, city, region, postalCode, country: "Mexico", phone },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setPending(false);
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8 md:py-16">
      <h1 className="font-display text-4xl">Checkout</h1>

      <div className="mt-10 grid gap-12 md:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div>
            <p className="eyebrow mb-4 text-off-black">Contact</p>
            <div>
              <label htmlFor="checkout-email" className="eyebrow mb-2 block text-charcoal">
                Email
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={pending}
                className={inputClass()}
              />
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4 text-off-black">Shipping Address</p>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="checkout-name" className="eyebrow mb-2 block text-charcoal">
                  Full Name
                </label>
                <input
                  id="checkout-name"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={pending}
                  className={inputClass()}
                />
              </div>
              <div>
                <label htmlFor="checkout-line1" className="eyebrow mb-2 block text-charcoal">
                  Address Line 1
                </label>
                <input
                  id="checkout-line1"
                  required
                  autoComplete="address-line1"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  disabled={pending}
                  className={inputClass()}
                />
              </div>
              <div>
                <label htmlFor="checkout-line2" className="eyebrow mb-2 block text-charcoal">
                  Apartment / Unit (optional)
                </label>
                <input
                  id="checkout-line2"
                  autoComplete="address-line2"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  disabled={pending}
                  className={inputClass()}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="checkout-city" className="eyebrow mb-2 block text-charcoal">
                    City
                  </label>
                  <input
                    id="checkout-city"
                    required
                    autoComplete="address-level2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={pending}
                    className={inputClass()}
                  />
                </div>
                <div>
                  <label htmlFor="checkout-region" className="eyebrow mb-2 block text-charcoal">
                    State
                  </label>
                  <input
                    id="checkout-region"
                    required
                    autoComplete="address-level1"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    disabled={pending}
                    className={inputClass()}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="checkout-postal" className="eyebrow mb-2 block text-charcoal">
                    Postal Code
                  </label>
                  <input
                    id="checkout-postal"
                    required
                    autoComplete="postal-code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    disabled={pending}
                    className={inputClass()}
                  />
                </div>
                <div>
                  <label htmlFor="checkout-country" className="eyebrow mb-2 block text-charcoal">
                    Country
                  </label>
                  <input id="checkout-country" disabled value="Mexico" className={inputClass()} />
                </div>
              </div>
              <div>
                <label htmlFor="checkout-phone" className="eyebrow mb-2 block text-charcoal">
                  Phone (for delivery, optional)
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={pending}
                  className={inputClass()}
                />
              </div>
            </div>
          </div>

          {error && <p className="eyebrow text-red-800">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="flex h-12 w-full items-center justify-center bg-off-black text-sm tracking-[0.08em] text-bone transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? "…" : "CONTINUE TO PAYMENT"}
          </button>
          <p className="text-xs text-charcoal">
            You&rsquo;ll enter your card details securely on Mercado Pago&rsquo;s payment page.
          </p>
        </form>

        <div className="h-fit border hairline p-6">
          <h2 className="eyebrow mb-5">Order Summary</h2>
          <ul className="flex flex-col gap-4">
            {lines.map((line) => (
              <li key={line.key} className="flex justify-between gap-4 text-sm">
                <span>
                  {line.product.name}
                  <span className="block text-xs text-charcoal">
                    {line.color} · {line.size} · Qty {line.quantity}
                  </span>
                </span>
                <span className="shrink-0">{formatCentavosMXN((line.product.priceMXN ?? 0) * 100 * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t hairline pt-4 text-sm">
            <span>Subtotal</span>
            <span>{formatCentavosMXN(estimatedMXN * 100)}</span>
          </div>
          <p className="mt-2 text-xs text-charcoal">Shipping calculated at checkout. Taxes included where applicable.</p>
        </div>
      </div>
    </div>
  );
}
