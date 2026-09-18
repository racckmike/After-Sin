"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { ExportCsvButton } from "@/components/admin/ExportCsvButton";
import { exportCustomersCsvAction } from "@/lib/admin/actions";
import type { CustomerRow } from "@/lib/admin/db";

export function CustomersView({
  rows,
  total,
  page,
  pageSize,
  search,
}: {
  rows: CustomerRow[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
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
          <p className="eyebrow text-charcoal">Customers</p>
          <h1 className="mt-2 font-display text-3xl">{total} Accounts</h1>
        </div>
        <ExportCsvButton filename="after-sin-customers.csv" exportAction={() => exportCustomersCsvAction(search)} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParams({ search: searchInput });
        }}
        className="mt-8 flex flex-wrap gap-4"
      >
        <input
          type="search"
          placeholder="Search name or email…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-11 w-full max-w-xs border border-off-black bg-transparent px-4 text-sm outline-none"
        />
        <button type="submit" className="eyebrow h-11 border border-off-black px-5 hover:opacity-70">
          SEARCH
        </button>
      </form>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b hairline text-charcoal">
              <th className="eyebrow py-3 pr-4 font-normal">Name</th>
              <th className="eyebrow py-3 pr-4 font-normal">Email</th>
              <th className="eyebrow py-3 pr-4 font-normal">Joined</th>
              <th className="eyebrow py-3 pr-4 font-normal">Orders</th>
              <th className="eyebrow py-3 font-normal">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b hairline">
                <td className="py-3 pr-4">
                  <Link href={`/admin/customers/${row.id}`} className="underline underline-offset-4">
                    {row.firstName || row.lastName ? `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim() : "—"}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-charcoal">{row.email}</td>
                <td className="py-3 pr-4 text-charcoal">{new Date(row.createdAt).toLocaleDateString()}</td>
                <td className="py-3 pr-4 text-charcoal">{row.orderCount}</td>
                <td className="py-3 text-charcoal">${row.totalSpent}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-charcoal">
                  No customers match this search.
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
