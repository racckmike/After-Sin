"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function AdminLogoutButton() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signOut();
        router.push("/admin");
        router.refresh();
      }}
      className="eyebrow shrink-0 whitespace-nowrap text-charcoal underline underline-offset-4 hover:text-off-black disabled:opacity-40"
    >
      {pending ? "…" : "Log Out"}
    </button>
  );
}
