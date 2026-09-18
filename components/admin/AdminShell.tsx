import { AdminNav } from "@/components/admin/AdminNav";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import type { AdminUser } from "@/lib/admin/auth";

export function AdminShell({ user, children }: { user: AdminUser; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bone">
      <div className="flex items-center justify-between border-b hairline px-4 py-4 sm:px-8">
        <div>
          <p className="eyebrow text-charcoal">After Sin</p>
          <p className="font-display text-lg">Admin</p>
        </div>
        <div className="flex items-center gap-5">
          <p className="hidden text-sm text-charcoal sm:block">{user.email}</p>
          <AdminLogoutButton />
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8 sm:py-10 lg:grid lg:grid-cols-[180px_1fr] lg:gap-12">
        <div className="mb-8 border-b hairline pb-2 lg:mb-0 lg:border-b-0 lg:pb-0">
          <AdminNav />
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
