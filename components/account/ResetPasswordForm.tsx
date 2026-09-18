"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction, type ActionResult } from "@/lib/auth/actions";

const initialState: ActionResult = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);

  if (state.success) {
    return (
      <div className="mt-8 flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-charcoal">
          Your password has been reset.
        </p>
        <Link
          href="/account"
          className="flex h-12 w-full items-center justify-center bg-off-black text-sm tracking-[0.08em] text-bone transition-opacity hover:opacity-85"
        >
          SIGN IN
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="new-password" className="eyebrow mb-2 block text-charcoal">
          New Password
        </label>
        <input
          id="new-password"
          name="newPassword"
          type="password"
          required
          autoComplete="new-password"
          className="h-12 w-full border border-off-black bg-transparent px-4 text-sm outline-none"
        />
      </div>
      <div>
        <label htmlFor="confirm-new-password" className="eyebrow mb-2 block text-charcoal">
          Confirm Password
        </label>
        <input
          id="confirm-new-password"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          className="h-12 w-full border border-off-black bg-transparent px-4 text-sm outline-none"
        />
      </div>
      {state.error && <p className="eyebrow text-red-800">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center bg-off-black text-sm tracking-[0.08em] text-bone transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "…" : "RESET PASSWORD"}
      </button>
    </form>
  );
}
