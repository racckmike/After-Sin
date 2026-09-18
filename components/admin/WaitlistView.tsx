"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { ExportCsvButton } from "@/components/admin/ExportCsvButton";
import { exportWaitlistCsvAction } from "@/lib/admin/actions";
import type { WaitlistRow, WaitlistBreakdownRow } from "@/lib/admin/db";
import { getProductInterestLabel } from "@/lib/admin/productInterestLabels";

export function WaitlistView({
  rows,
  total,
  page,
  pageSize,
  productSlugs,
  breakdown,
  search,
  productSlug,
  sort,
}: {
  rows: WaitlistRow[];
  total: number;
  page: number;
  pageSize: number;
  productSlugs: string[];
  breakdown: WaitlistBreakdownRow[];
  search: string;
  productSlug: string;
  sort: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(search);
  const [, startTransition] = useTransition();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    if (!("page" in next)) params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-charcoal">Waitlist</p>
          <h1 className="mt-2 font-display text-3xl">{total} Signups</h1>
        </div>
        <ExportCsvButton
          filename="after-sin-waitlist.csv"
          exportAction={() => exportWaitlistCsvAction(search, productSlug)}
        />
      </div>

      {breakdown.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {breakdown.map((b) => (
            <div key={b.productSlug} className="border hairline p-4">
              <p className="eyebrow text-charcoal">{getProductInterestLabel(b.productSlug)}</p>
              <p className="mt-2 font-display text-2xl">{b.count}</p>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParams({ search: searchInput });
        }}
        className="mt-8 flex flex-wrap gap-4"
      >
        <input
          type="search"
          placeholder="Search email…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-11 w-full max-w-xs border border-off-black bg-transparent px-4 text-sm outline-none"
        />
        <select
          value={productSlug}
          onChange={(e) => updateParams({ product: e.target.value })}
          className="h-11 border border-off-black bg-transparent px-3 text-sm outline-none"
        >
          <option value="">All interests</option>
          {productSlugs.map((slug) => (
            <option key={slug} value={slug}>
              {getProductInterestLabel(slug)}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="h-11 border border-off-black bg-transparent px-3 text-sm outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="email">Email A–Z</option>
        </select>
        <button type="submit" className="eyebrow h-11 border border-off-black px-5 hover:opacity-70">
          SEARCH
        </button>
      </form>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b hairline text-charcoal">
              <th className="eyebrow py-3 pr-4 font-normal">Email</th>
              <th className="eyebrow py-3 pr-4 font-normal">Product Interest</th>
              <th className="eyebrow py-3 font-normal">Signup Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b hairline">
                <td className="py-3 pr-4">{row.email}</td>
                <td className="py-3 pr-4 text-charcoal">{getProductInterestLabel(row.productSlug)}</td>
                <td className="py-3 text-charcoal">{new Date(row.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="py-10 text-center text-charcoal">
                  No signups match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => updateParams({ page: String(page - 1) })}
            className="eyebrow disabled:opacity-30"
          >
            ← Prev
          </button>
          <span className="text-sm text-charcoal">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => updateParams({ page: String(page + 1) })}
            className="eyebrow disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
