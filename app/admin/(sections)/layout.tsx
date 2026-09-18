import { redirect } from "next/navigation";
import { checkAdmin } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

/**
 * Every /admin/* route except /admin itself is nested under this layout.
 * Next.js runs a layout before the page below it, so a redirect() here
 * stops the page (and its data fetching) from ever rendering — this is
 * the actual server-side enforcement, not just hiding nav links.
 * Unauthenticated and non-admin both land back on /admin: the login page
 * for one, a silent bounce for the other, so neither response reveals
 * which case it was.
 */
export default async function AdminSectionsLayout({ children }: { children: React.ReactNode }) {
  const gate = await checkAdmin();
  if (gate.status !== "authorized") redirect("/admin");

  return <AdminShell user={gate.user}>{children}</AdminShell>;
}
