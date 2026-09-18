"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { updateProfileAction } from "@/lib/customer/actions";
import { resendVerificationAction, type ActionResult } from "@/lib/auth/actions";
import type { AccountUser } from "@/components/account/AccountDashboard";

const initialState: ActionResult = {};

function inputClass() {
  return "h-12 w-full border border-off-black bg-transparent px-4 text-sm outline-none disabled:opacity-60";
}

export function ProfileSection({
  user,
  firstName,
  lastName,
}: {
  user: AccountUser;
  firstName: string;
  lastName: string;
}) {
  return (
    <div className="flex flex-col gap-12">
      <NameForm firstName={firstName} lastName={lastName} />
      <EmailSection email={user.email} emailVerified={user.emailVerified} />
      <PasswordForm />
    </div>
  );
}

function NameForm({ firstName, lastName }: { firstName: string; lastName: string }) {
  const router = useRouter();
  const [first, setFirst] = useState(firstName);
  const [last, setLast] = useState(lastName);
  const [state, formAction, pending] = useActionState(async (prev: ActionResult, formData: FormData) => {
    const result = await updateProfileAction(prev, formData);
    if (result.success) router.refresh();
    return result;
  }, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <p className="eyebrow text-off-black">Name</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="profile-first-name" className="eyebrow mb-2 block text-charcoal">
            First Name
          </label>
          <input
            id="profile-first-name"
            name="firstName"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            required
            className={inputClass()}
          />
        </div>
        <div>
          <label htmlFor="profile-last-name" className="eyebrow mb-2 block text-charcoal">
            Last Name
          </label>
          <input
            id="profile-last-name"
            name="lastName"
            value={last}
            onChange={(e) => setLast(e.target.value)}
            required
            className={inputClass()}
          />
        </div>
      </div>
      {state.error && <p className="eyebrow text-red-800">{state.error}</p>}
      {state.success && <p className="eyebrow text-charcoal">Saved.</p>}
      <button
        type="submit"
        disabled={pending}
        className="eyebrow h-11 self-start border border-off-black px-6 transition-opacity hover:opacity-70 disabled:opacity-40"
      >
        {pending ? "…" : "SAVE"}
      </button>
    </form>
  );
}

function EmailSection({ email, emailVerified }: { email: string; emailVerified: boolean }) {
  const [newEmail, setNewEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const [resendState, resendAction, resendPending] = useActionState(
    resendVerificationAction,
    initialState
  );

  return (
    <div className="flex flex-col gap-4 border-t hairline pt-8">
      <p className="eyebrow text-off-black">Email</p>
      <p className="text-sm text-charcoal">
        {email}{" "}
        {emailVerified ? (
          <span className="text-charcoal">— verified</span>
        ) : (
          <span className="text-red-800">— not verified</span>
        )}
      </p>

      {!emailVerified && (
        <form action={resendAction}>
          <button
            type="submit"
            disabled={resendPending}
            className="eyebrow text-charcoal underline underline-offset-4 disabled:opacity-40"
          >
            {resendPending ? "Sending…" : "Resend verification email"}
          </button>
          {resendState.success && <p className="eyebrow mt-2 text-charcoal">Sent.</p>}
          {resendState.error && <p className="eyebrow mt-2 text-red-800">{resendState.error}</p>}
        </form>
      )}

      {sent ? (
        <p className="text-sm text-charcoal">
          Check {newEmail} for a link to confirm this change.
        </p>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!newEmail || pending) return;
            setPending(true);
            setError(null);
            const { error: err } = await authClient.changeEmail({
              newEmail,
              callbackURL: "/account",
            });
            setPending(false);
            if (err) {
              setError(err.message ?? "Something went wrong. Please try again.");
              return;
            }
            setSent(true);
          }}
          className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4"
        >
          <div className="flex-1">
            <label htmlFor="new-email" className="eyebrow mb-2 block text-charcoal">
              New Email
            </label>
            <input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={pending}
              className={inputClass()}
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="eyebrow h-11 border border-off-black px-6 transition-opacity hover:opacity-70 disabled:opacity-40"
          >
            {pending ? "…" : "CHANGE"}
          </button>
        </form>
      )}
      {error && <p className="eyebrow text-red-800">{error}</p>}
    </div>
  );
}

function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (pending) return;
        setError(null);
        setSuccess(false);
        if (next.length < 8) return setError("New password must be at least 8 characters.");
        if (next !== confirm) return setError("Passwords don't match.");
        setPending(true);
        const { error: err } = await authClient.changePassword({
          currentPassword: current,
          newPassword: next,
        });
        setPending(false);
        if (err) {
          setError(err.message ?? "Something went wrong. Please try again.");
          return;
        }
        setCurrent("");
        setNext("");
        setConfirm("");
        setSuccess(true);
      }}
      className="flex flex-col gap-4 border-t hairline pt-8"
    >
      <p className="eyebrow text-off-black">Password</p>
      <div>
        <label htmlFor="current-password" className="eyebrow mb-2 block text-charcoal">
          Current Password
        </label>
        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          disabled={pending}
          className={inputClass()}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="next-password" className="eyebrow mb-2 block text-charcoal">
            New Password
          </label>
          <input
            id="next-password"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            disabled={pending}
            className={inputClass()}
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="eyebrow mb-2 block text-charcoal">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={pending}
            className={inputClass()}
          />
        </div>
      </div>
      {error && <p className="eyebrow text-red-800">{error}</p>}
      {success && <p className="eyebrow text-charcoal">Password updated.</p>}
      <button
        type="submit"
        disabled={pending}
        className="eyebrow h-11 self-start border border-off-black px-6 transition-opacity hover:opacity-70 disabled:opacity-40"
      >
        {pending ? "…" : "UPDATE PASSWORD"}
      </button>
    </form>
  );
}
