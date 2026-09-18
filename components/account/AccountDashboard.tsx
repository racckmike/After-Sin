"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import type { CustomerAddress } from "@/lib/customer/db";
import { OrderHistorySection } from "@/components/account/OrderHistorySection";
import { ProfileSection } from "@/components/account/ProfileSection";
import { AddressesSection } from "@/components/account/AddressesSection";

export interface AccountUser {
  id: string;
  email: string;
  emailVerified: boolean;
}

type Section = "orders" | "profile" | "addresses";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "orders", label: "Order History" },
  { id: "profile", label: "Profile" },
  { id: "addresses", label: "Addresses" },
];

export function AccountDashboard({
  user,
  firstName,
  lastName,
  addresses,
}: {
  user: AccountUser;
  firstName: string;
  lastName: string;
  addresses: CustomerAddress[];
}) {
  const [section, setSection] = useState<Section>("orders");
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-[900px] px-4 py-12 md:py-16">
      <p className="eyebrow text-charcoal">Account</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl">Welcome, {firstName}</h1>

      <div className="mt-10 flex items-center justify-between gap-6 overflow-x-auto border-b hairline">
        <nav className="flex gap-7">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`eyebrow whitespace-nowrap border-b-2 py-4 transition-colors ${
                section === s.id
                  ? "border-off-black text-off-black"
                  : "border-transparent text-charcoal hover:text-off-black"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          disabled={signingOut}
          onClick={async () => {
            setSigningOut(true);
            // Client-side signOut (rather than the server action) so the
            // header's useSession() store updates itself immediately.
            await authClient.signOut();
            router.refresh();
          }}
          className="eyebrow shrink-0 whitespace-nowrap py-4 text-charcoal underline underline-offset-4 hover:text-off-black disabled:opacity-40"
        >
          {signingOut ? "…" : "Log Out"}
        </button>
      </div>

      <div className="mt-10">
        {section === "orders" && <OrderHistorySection />}
        {section === "profile" && (
          <ProfileSection user={user} firstName={firstName} lastName={lastName} />
        )}
        {section === "addresses" && <AddressesSection addresses={addresses} />}
      </div>
    </div>
  );
}
