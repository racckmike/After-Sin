"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { updateInventoryAction, type ActionResult } from "@/lib/admin/inventoryActions";
import type { InventoryRow as InventoryRowType } from "@/lib/orders/db";

const initialState: ActionResult = {};

export function InventoryRow({ row }: { row: InventoryRowType }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(String(row.quantity));
  const [state, formAction, pending] = useActionState(async (prev: ActionResult, formData: FormData) => {
    const result = await updateInventoryAction(prev, formData);
    if (result.success) router.refresh();
    return result;
  }, initialState);

  return (
    <tr className="border-b hairline">
      <td className="py-3 pr-4">{row.productSlug}</td>
      <td className="py-3 pr-4 text-charcoal">{row.color}</td>
      <td className="py-3 pr-4 text-charcoal">{row.size}</td>
      <td className="py-3">
        <form action={formAction} className="flex items-center gap-3">
          <input type="hidden" name="id" value={row.id} />
          <input
            type="number"
            name="quantity"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="h-9 w-20 border border-off-black bg-transparent px-2 text-sm outline-none"
          />
          <button type="submit" disabled={pending} className="eyebrow text-charcoal underline underline-offset-4 disabled:opacity-40">
            {pending ? "…" : "Save"}
          </button>
          {state.error && <span className="text-xs text-red-800">{state.error}</span>}
        </form>
      </td>
    </tr>
  );
}
