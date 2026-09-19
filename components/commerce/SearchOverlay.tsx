"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import { collections } from "@/data/collections";
import { getProductPrice } from "@/lib/format";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { useRegion } from "@/context/RegionContext";

const RECENT_KEY = "after-sin:recent-searches";

/**
 * Matches Shihiko's real search panel (opened and measured live): a
 * right-side panel at the same footprint as the cart drawer (~412px),
 * not a full-width overlay dropping from the top — "SEARCH" + close on
 * one row, then the input, then suggestions/results below.
 */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const { region } = useRegion();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, an external system, on overlay open
      if (Array.isArray(stored)) setRecent(stored);
    } catch {
      /* ignore malformed storage */
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { products: [], collections: [] };
    return {
      products: products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.world.includes(q)
      ),
      collections: collections.filter(
        (c) => c.name.toLowerCase().includes(q) || c.slug.includes(q)
      ),
    };
  }, [query]);

  function commitSearch(term: string) {
    if (!term.trim()) return;
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 6);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — non-critical */
    }
  }

  const hasQuery = query.trim().length > 0;
  const hasResults = results.products.length > 0 || results.collections.length > 0;

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* An invisible click-catcher, not a dimmed backdrop — verified
          live on Shihiko's real search panel: its own overflow/
          backdrop element has opacity 0, unlike the cart's 50% dim. */}
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className={`absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col overflow-y-auto bg-bone transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top, 0px))" }}
      >
        <div className="flex items-center justify-between px-6">
          <h2 className="eyebrow">Search</h2>
          <button type="button" onClick={onClose} aria-label="Close search" className="eyebrow underline underline-offset-4">
            Close
          </button>
        </div>

        <form
          className="mx-6 mt-6 flex items-center gap-4 border-b border-[#d6dee7] pb-3 transition-colors focus-within:border-off-black"
          onSubmit={(e) => {
            e.preventDefault();
            commitSearch(query);
          }}
        >
          <input
            autoFocus={open}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="WHAT ARE YOU LOOKING FOR?"
            className="eyebrow flex-1 bg-transparent outline-none placeholder:text-charcoal/40"
          />
        </form>

        <div className="min-h-[240px] px-6 py-6">
          {!hasQuery && (
            <div>
              {recent.length > 0 && (
                <>
                  <p className="eyebrow mb-3 text-charcoal">Recent Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="eyebrow border border-off-black/30 px-3 py-1.5"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <p className="eyebrow mt-8 mb-4 font-semibold">Trending Now</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-6">
                {products.map((p) => (
                  <Link key={p.slug} href={`/product/${p.slug}`} onClick={onClose} className="group flex flex-col">
                    <span className="relative aspect-[3/4] w-full overflow-hidden bg-soft-grey/30">
                      {p.images[0]?.src ? (
                        <Image
                          src={p.images[0].src}
                          alt=""
                          fill
                          sizes="200px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <PlaceholderFrame label="" ratio="3 / 4" />
                      )}
                    </span>
                    <span className="mt-2 block text-sm">{p.name}</span>
                    <span className="block text-xs text-charcoal">{getProductPrice(p, region.currency)}</span>
                  </Link>
                ))}
              </div>
              <p className="eyebrow mt-8 mb-3 text-charcoal">Shop by World</p>
              <div className="flex flex-wrap gap-2">
                {collections.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/collections/${c.slug}`}
                    onClick={onClose}
                    className="eyebrow border border-off-black/30 px-3 py-1.5"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {hasQuery && !hasResults && (
            <p className="text-sm text-charcoal">
              No results for &ldquo;{query}&rdquo;. Try a world — CORE, DARK.
            </p>
          )}

          {hasQuery && hasResults && (
            <div className="flex flex-col gap-8">
              {results.products.length > 0 && (
                <div>
                  <p className="eyebrow mb-3 text-charcoal">Products</p>
                  <ul className="flex flex-col gap-4">
                    {results.products.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/product/${p.slug}`}
                          onClick={() => {
                            commitSearch(query);
                            onClose();
                          }}
                          className="flex items-center gap-3"
                        >
                          <span className="relative h-16 w-12 shrink-0 overflow-hidden bg-soft-grey/30">
                            {p.images[0]?.src ? (
                              <Image src={p.images[0].src} alt="" fill sizes="48px" className="object-cover" />
                            ) : (
                              <PlaceholderFrame label="" ratio="3 / 4" />
                            )}
                          </span>
                          <span>
                            <span className="block text-sm">{p.name}</span>
                            <span className="block text-xs text-charcoal">
                              {getProductPrice(p, region.currency)}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.collections.length > 0 && (
                <div>
                  <p className="eyebrow mb-3 text-charcoal">Collections</p>
                  <ul className="flex flex-col gap-3">
                    {results.collections.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/collections/${c.slug}`}
                          onClick={() => {
                            commitSearch(query);
                            onClose();
                          }}
                          className="text-sm"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
