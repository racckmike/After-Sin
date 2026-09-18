import type { Metadata } from "next";
import { listInventory } from "@/lib/orders/db";
import { InventoryRow } from "@/components/admin/InventoryRow";

export const metadata: Metadata = { title: "Inventory — AFTER SIN Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const rows = await listInventory();

  return (
    <div>
      <p className="eyebrow text-charcoal">Inventory</p>
      <h1 className="mt-2 font-display text-3xl">Stock Levels</h1>
      <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-charcoal">
        A variant appears here automatically the first time it&rsquo;s purchased through checkout, seeded with a
        placeholder quantity (10) — set the real count before relying on this for a live launch.
      </p>

      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-charcoal">No inventory tracked yet — nothing has been purchased.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b hairline text-charcoal">
                <th className="eyebrow py-3 pr-4 font-normal">Product</th>
                <th className="eyebrow py-3 pr-4 font-normal">Color</th>
                <th className="eyebrow py-3 pr-4 font-normal">Size</th>
                <th className="eyebrow py-3 font-normal">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <InventoryRow key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
