import { auth } from "@/lib/auth/server";

/**
 * Neon Auth's managed schema already ships Better Auth's admin plugin
 * (neon_auth.user has role/banned columns, and auth.admin.* server
 * methods are live) — reused here instead of a parallel roles table.
 * Only "admin" is grantable today (via auth.admin.setRole, itself
 * gated server-side to existing admins); "owner" is accepted so a
 * higher tier can be introduced later without touching this check.
 */
const ADMIN_ROLES = new Set(["admin", "owner"]);

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export type AdminGate =
  | { status: "unauthenticated" }
  | { status: "forbidden" }
  | { status: "authorized"; user: AdminUser };

export async function checkAdmin(): Promise<AdminGate> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return { status: "unauthenticated" };

  const role = (session.user as { role?: string | null }).role ?? "user";
  if (!ADMIN_ROLES.has(role)) return { status: "forbidden" };

  return {
    status: "authorized",
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? "",
      role,
    },
  };
}

/** Throws if not an authorized admin — for server actions that mutate admin data. */
export async function requireAdmin(): Promise<AdminUser> {
  const gate = await checkAdmin();
  if (gate.status !== "authorized") throw new Error("UNAUTHORIZED");
  return gate.user;
}
