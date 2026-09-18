import type { Metadata } from "next";
import { getSessionSafe } from "@/lib/auth/session";
import { getProfile, listAddresses } from "@/lib/customer/db";
import { AuthForms } from "@/components/account/AuthForms";
import { AccountDashboard } from "@/components/account/AccountDashboard";

export const metadata: Metadata = { title: "Account — AFTER SIN" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { data: session } = await getSessionSafe();

  if (!session?.user) {
    return <AuthForms />;
  }

  const { user } = session;
  const [profile, addresses] = await Promise.all([
    getProfile(user.id),
    listAddresses(user.id),
  ]);

  // Falls back to splitting Better Auth's single "name" field for a user
  // who signed up before this app-level profile table existed.
  const [fallbackFirst, ...fallbackRest] = (user.name || "").split(" ");
  const firstName = profile?.firstName || fallbackFirst || "there";
  const lastName = profile?.lastName || fallbackRest.join(" ");

  return (
    <AccountDashboard
      user={{ id: user.id, email: user.email, emailVerified: user.emailVerified }}
      firstName={firstName}
      lastName={lastName}
      addresses={addresses}
    />
  );
}
