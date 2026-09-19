"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Matches Shihiko's real footer (measured live): light background
 * (not a dark closing moment — that was an earlier, unmeasured
 * choice), a newsletter block on the left ("STAY CONNECTED" at 32px
 * bold uppercase, AFTER SIN's own copy underneath), and label+inline-
 * links rows on the right (NAVIGATION / INFO / SOCIAL), ending in a
 * plain copyright line. No payment-icon row or agency credit — those
 * have no honest AFTER SIN equivalent.
 */
const NAV_ROWS: { label: string; links: { label: string; href: string }[] }[] = [
  {
    label: "Navigation",
    links: [
      { label: "Shop", href: "/shop" },
      { label: "Editorial", href: "/editorial" },
      { label: "About", href: "/about" },
    ],
  },
  {
    label: "Info",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
    ],
  },
  {
    label: "Social",
    links: [{ label: "Instagram", href: "https://instagram.com/aftersin.world" }],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <footer className="bg-bone text-off-black">
      <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-12 md:px-8 md:pb-14 md:pt-16">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-16">
          <div className="max-w-[380px]">
            <h2 className="font-display text-2xl uppercase tracking-tight">Enter After Sin</h2>
            <p className="mt-2 text-sm text-charcoal">Drop access and studio notes. No noise.</p>

            {submitted ? (
              <p className="eyebrow mt-6">You&rsquo;re on the list.</p>
            ) : (
              <>
                <form
                  className="mt-6 flex items-stretch border-b border-off-black"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!email || submitting) return;
                    setSubmitting(true);
                    setError(null);
                    try {
                      const res = await fetch("/api/waitlist", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                      });
                      if (!res.ok) {
                        const data = await res.json().catch(() => null);
                        throw new Error(data?.error ?? "Something went wrong");
                      }
                      setSubmitted(true);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Something went wrong");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    required
                    placeholder="ENTER YOUR EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    className="eyebrow flex-1 bg-transparent py-3 placeholder:text-charcoal/50 focus:outline-none disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="eyebrow bg-off-black px-5 text-bone transition-opacity hover:opacity-85 disabled:opacity-40"
                  >
                    {submitting ? "…" : "Subscribe"}
                  </button>
                </form>
                {error && <p className="eyebrow mt-2 text-red-800">{error}</p>}
              </>
            )}

            <p className="mt-6 text-xs text-charcoal">
              Contact us:{" "}
              <a href="mailto:hello@aftersin.shop" className="underline underline-offset-4">
                hello@aftersin.shop
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            {NAV_ROWS.map((row) => (
              <div key={row.label} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 md:justify-end">
                <span className="eyebrow text-charcoal">{row.label}:</span>
                {row.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="eyebrow transition-opacity hover:opacity-60"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t hairline pt-6">
          <p className="eyebrow text-charcoal">
            Copyright © {new Date().getFullYear()} AFTER SIN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
