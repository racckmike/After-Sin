"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { promoteToAdminAction, type ActionResult } from "@/lib/admin/actions";

const initialState: ActionResult = {};

export function PromoteAdminForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [state, formAction, pending] = useActionState(async (prev: ActionResult, formData: FormData) => {
    const result = await promoteToAdminAction(prev, formData);
    if (result.success) {
      setEmail("");
      router.refresh();
    }
    return result;
  }, initialState);

  return (
    <form action={formAction} className="mt-4 flex flex-wrap items-end gap-4">
      <div className="flex-1">
        <label htmlFor="promote-email" className="eyebrow mb-2 block text-charcoal">
          Customer Email
        </label>
        <input
          id="promote-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teammate@example.com"
          className="h-11 w-full max-w-xs border border-off-black bg-transparent px-4 text-sm outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="eyebrow h-11 border border-off-black px-5 hover:opacity-70 disabled:opacity-40"
      >
        {pending ? "…" : "MAKE ADMIN"}
      </button>
      {state.error && <p className="eyebrow w-full text-red-800">{state.error}</p>}
      {state.success && <p className="eyebrow w-full text-charcoal">Done — that account now has admin access.</p>}
    </form>
  );
}
