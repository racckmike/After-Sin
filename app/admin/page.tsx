import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { checkAdmin } from "@/lib/admin/auth";
import { countWaitlist, countCustomers } from "@/lib/admin/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminOverview } from "@/components/admin/AdminOverview";

export const metadata: Metadata = { title: "Admin — AFTER SIN", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const gate = await checkAdmin();

  if (gate.status === "unauthenticated") return <AdminLoginForm />;
  if (gate.status === "forbidden") redirect("/");

  const [waitlistCount, customerCount] = await Promise.all([countWaitlist(), countCustomers()]);

  return (
    <AdminShell user={gate.user}>
      <AdminOverview waitlistCount={waitlistCount} customerCount={customerCount} />
    </AdminShell>
  );
}
