"use server";

import { auth } from "@/lib/auth/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  listWaitlistAll,
  listCustomers as listCustomersDb,
  getUserIdByEmail,
  logAdminAction,
} from "@/lib/admin/db";
import { toCsv } from "@/lib/admin/csv";
import { getProductInterestLabel } from "@/lib/admin/productInterestLabels";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

/**
 * Every admin action re-verifies the session server-side via requireAdmin()
 * even though the /admin route tree is already gated by its layout — an
 * API-level check is the only thing that protects against someone calling
 * the server action directly (a form's action prop is a real network
 * endpoint), not just the UI.
 */
export async function exportWaitlistCsvAction(search?: string, productSlug?: string): Promise<string> {
  const admin = await requireAdmin();
  const rows = await listWaitlistAll(search, productSlug);
  await logAdminAction(admin.id, admin.email, "waitlist_csv_exported", "waitlist", {
    rowCount: rows.length,
    search: search || null,
    productSlug: productSlug || null,
  });
  return toCsv(
    ["Email", "Product Interest", "Product Interest Label", "Signup Date"],
    rows.map((r) => [r.email, r.productSlug, getProductInterestLabel(r.productSlug), r.createdAt])
  );
}

export async function exportCustomersCsvAction(search?: string): Promise<string> {
  const admin = await requireAdmin();
  const { rows } = await listCustomersDb({ search, page: 1, pageSize: 100000 });
  await logAdminAction(admin.id, admin.email, "customers_csv_exported", "customers", {
    rowCount: rows.length,
    search: search || null,
  });
  return toCsv(
    ["First Name", "Last Name", "Email", "Email Verified", "Created At"],
    rows.map((r) => [r.firstName, r.lastName, r.email, r.emailVerified ? "Yes" : "No", r.createdAt])
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The only way an account becomes an admin: an existing admin promotes a
 * registered customer by email, server-side, through Better Auth's own
 * admin.setRole (which itself re-checks the caller's session role before
 * allowing the change). No public sign-up path can reach this.
 */
export async function promoteToAdminAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };

  const userId = await getUserIdByEmail(email);
  if (!userId) return { error: "No account found with that email." };

  const { error } = await auth.admin.setRole({ userId, role: "admin" });
  if (error) return { error: error.message ?? "Couldn't update that account's role." };

  await logAdminAction(admin.id, admin.email, "role_set_admin", `user:${userId}`, { targetEmail: email });
  return { success: true };
}
