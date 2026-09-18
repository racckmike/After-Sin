import type { Metadata } from "next";
import { listAdmins, listAuditLog } from "@/lib/admin/db";
import { PromoteAdminForm } from "@/components/admin/PromoteAdminForm";

export const metadata: Metadata = { title: "Settings — AFTER SIN Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [admins, auditLog] = await Promise.all([listAdmins(), listAuditLog(20)]);

  return (
    <div>
      <p className="eyebrow text-charcoal">Settings</p>
      <h1 className="mt-2 font-display text-3xl">Admin Access</h1>

      <div className="mt-8">
        <p className="eyebrow text-off-black">Grant Admin Access</p>
        <p className="mt-2 max-w-[52ch] text-sm text-charcoal">
          The person must already have an AFTER SIN account (they sign up like any
          customer at /account first). This only changes their role — it never
          creates an account.
        </p>
        <PromoteAdminForm />
      </div>

      <div className="mt-10 border-t hairline pt-8">
        <p className="eyebrow text-off-black">Current Admins</p>
        <ul className="mt-4 flex flex-col gap-2 text-sm">
          {admins.map((a) => (
            <li key={a.id} className="flex items-center justify-between border-b hairline py-2">
              <span>{a.name || a.email}</span>
              <span className="text-charcoal">{a.email}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 border-t hairline pt-8">
        <p className="eyebrow text-off-black">Recent Admin Activity</p>
        {auditLog.length === 0 ? (
          <p className="mt-3 text-sm text-charcoal">No admin actions logged yet.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {auditLog.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-center justify-between gap-2 border-b hairline py-2">
                <span>
                  {entry.adminEmail} — {entry.action.replaceAll("_", " ")}
                  {entry.resource ? ` (${entry.resource})` : ""}
                </span>
                <span className="text-charcoal">{new Date(entry.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
