"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { setInventoryQuantity } from "@/lib/orders/db";
import { logAdminAction } from "@/lib/admin/db";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

export async function updateInventoryAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();

  const id = Number(formData.get("id"));
  const quantity = Number(formData.get("quantity"));
  if (!Number.isFinite(id) || !Number.isFinite(quantity) || quantity < 0) {
    return { error: "Enter a valid quantity." };
  }

  await setInventoryQuantity(id, Math.trunc(quantity));
  await logAdminAction(admin.id, admin.email, "inventory_adjusted", `inventory:${id}`, { quantity });

  return { success: true };
}
