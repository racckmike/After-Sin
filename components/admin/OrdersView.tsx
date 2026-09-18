"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import type { Order } from "@/lib/orders/db";
import { formatCentavosMXN } from "@/lib/checkout/pricing";

const STATUS_LABEL: Record<string, string> = {
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function OrdersView({
  rows,
  total,
  page,
  pageSize,
  search,
  status,
}: {
  rows: Order[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  status: string;
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
      <p className="eyebrow text-charcoal">Orders</p>
      <h1 className="mt-2 font-display text-3xl">{total} Orders</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParams({ search: searchInput });
        }}
        className="mt-8 flex flex-wrap gap-4"
      >
        <input
          type="search"
          placeholder="Search order # or email…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-11 w-full max-w-xs border border-off-black bg-transparent px-4 text-sm outline-none"
        />
        <select
          value={status}
          onChange={(e) => updateParams({ status: e.target.value })}
          className="h-11 border border-off-black bg-transparent px-3 text-sm outline-none"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button type="submit" className="eyebrow h-11 border border-off-black px-5 hover:opacity-70">
          SEARCH
        </button>
      </form>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b hairline text-charcoal">
              <th className="eyebrow py-3 pr-4 font-normal">Order</th>
              <th className="eyebrow py-3 pr-4 font-normal">Email</th>
              <th className="eyebrow py-3 pr-4 font-normal">Date</th>
              <th className="eyebrow py-3 pr-4 font-normal">Status</th>
              <th className="eyebrow py-3 font-normal">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order.id} className="border-b hairline">
                <td className="py-3 pr-4">
                  <Link href={`/admin/orders/${order.orderNumber}`} className="underline underline-offset-4">
                    #{order.orderNumber}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-charcoal">{order.email}</td>
                <td className="py-3 pr-4 text-charcoal">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="py-3 pr-4 text-charcoal">{STATUS_LABEL[order.status] ?? order.status}</td>
                <td className="py-3 text-charcoal">{formatCentavosMXN(order.totalCentavos)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-charcoal">
                  No orders match this filter.
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
