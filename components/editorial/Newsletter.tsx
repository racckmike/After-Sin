"use client";

import { useState } from "react";
import { SignatureMark } from "@/components/ui/SignatureMark";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="on-dark bg-off-black px-4 py-20 text-bone md:px-8 md:py-28">
      <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
        <SignatureMark tone="dark" size={26} />
        <h2 className="mt-6 font-display text-3xl tracking-[0.02em] md:text-4xl">
          ENTER AFTER SIN
        </h2>
        <p className="mt-3 text-sm text-soft-grey">
          Drop access and studio notes. No noise.
        </p>

        {submitted ? (
          <p className="eyebrow mt-8">You&rsquo;re on the list.</p>
        ) : (
          <form
            className="mt-8 flex w-full max-w-[380px] items-stretch border-b border-bone/40"
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSubmitted(true);
            }}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="eyebrow flex-1 bg-transparent py-3 placeholder:text-soft-grey/70 focus:outline-none"
            />
            <button type="submit" className="eyebrow px-2 transition-opacity hover:opacity-60">
              JOIN
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
