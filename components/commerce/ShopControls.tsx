"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/commerce/ProductGrid";

type SortKey = "newest" | "price-asc" | "price-desc";

export function ShopControls({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("newest");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (availableOnly) {
      list = list.filter((p) => p.status === "in-stock" || p.status === "low-stock");
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "newest") list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return list;
  }, [products, sort, availableOnly]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b hairline pb-4">
        <p className="eyebrow text-charcoal">
          {filtered.length} product{filtered.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-6">
          <label className="eyebrow flex items-center gap-2">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="h-3.5 w-3.5 accent-off-black"
            />
            Available now
          </label>
          <label className="eyebrow flex items-center gap-2">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="eyebrow cursor-pointer bg-transparent outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </label>
        </div>
      </div>
      <ProductGrid products={filtered} />
    </div>
  );
}
