"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { products } from "@/data/products";
import { collections } from "@/data/collections";
import { priceOrStatus } from "@/lib/format";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { useRegion } from "@/context/RegionContext";

const RECENT_KEY = "after-sin:recent-searches";

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
      <div
        className={`absolute inset-0 bg-off-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute inset-x-0 top-0 bg-bone transition-transform duration-300 ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="mx-auto max-w-[900px] px-4 py-8 md:py-14">
          <form
            className="flex items-center gap-4 border-b border-off-black pb-3"
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
              placeholder="SEARCH PRODUCTS, COLLECTIONS…"
              className="font-display flex-1 bg-transparent text-2xl outline-none placeholder:text-charcoal/40 md:text-3xl"
            />
            <button type="button" onClick={onClose} aria-label="Close search" className="text-2xl leading-none">
              &times;
            </button>
          </form>

          <div className="mt-8 min-h-[240px]">
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
              <div className="grid gap-8 md:grid-cols-2">
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
                            <span className="h-14 w-11 shrink-0">
                              <PlaceholderFrame label="" ratio="4 / 5" />
                            </span>
                            <span>
                              <span className="block text-sm">{p.name}</span>
                              <span className="block text-xs text-charcoal">
                                {priceOrStatus(p.price, region.currency, p.status)}
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
    </div>
  );
}
