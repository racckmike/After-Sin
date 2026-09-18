"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { signInAction, type ActionResult } from "@/lib/auth/actions";

const initialState: ActionResult = {};

/**
 * Deliberately no "Create Account" link — admin accounts are never
 * self-service (see lib/admin/actions.ts's promoteToAdminAction). This
 * reuses the same signInAction as the customer sign-in; the /admin page
 * itself decides what happens next based on the session's role.
 */
export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [state, formAction, pending] = useActionState(async (prev: ActionResult, formData: FormData) => {
    const result = await signInAction(prev, formData);
    if (result.success) {
      await authClient.getSession();
      router.refresh();
    }
    return result;
  }, initialState);

  return (
    <div className="mx-auto flex min-h-screen max-w-[420px] flex-col justify-center px-4 py-16">
      <p className="eyebrow text-charcoal">After Sin</p>
      <h1 className="mt-2 font-display text-3xl">Admin</h1>

      <form action={formAction} className="mt-8 flex flex-col gap-5">
        <div>
          <label htmlFor="admin-email" className="eyebrow mb-2 block text-charcoal">
            Email
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full border border-off-black bg-transparent px-4 text-sm outline-none"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="eyebrow mb-2 block text-charcoal">
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="h-12 w-full border border-off-black bg-transparent px-4 text-sm outline-none"
          />
        </div>
        {state.error && <p className="eyebrow text-red-800">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full items-center justify-center bg-off-black text-sm tracking-[0.08em] text-bone transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "…" : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}
