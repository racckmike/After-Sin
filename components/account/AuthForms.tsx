"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import {
  signInAction,
  signUpAction,
  requestPasswordResetAction,
  type ActionResult,
} from "@/lib/auth/actions";

type Mode = "sign-in" | "create-account" | "forgot-password";

const initialState: ActionResult = {};

export function AuthForms() {
  const [mode, setMode] = useState<Mode>("sign-in");

  return (
    <div className="mx-auto max-w-[420px] px-4 py-16 md:py-24">
      <p className="eyebrow text-charcoal">Account</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl">
        {mode === "sign-in" ? "Sign In" : mode === "create-account" ? "Create Account" : "Reset Password"}
      </h1>

      {mode === "sign-in" && <SignInForm onForgotPassword={() => setMode("forgot-password")} />}
      {mode === "create-account" && <CreateAccountForm />}
      {mode === "forgot-password" && <ForgotPasswordForm onBack={() => setMode("sign-in")} />}

      <div className="mt-10 border-t hairline pt-6 text-center">
        {mode === "sign-in" ? (
          <p className="text-sm text-charcoal">
            New to AFTER SIN?{" "}
            <button
              type="button"
              onClick={() => setMode("create-account")}
              className="text-off-black underline underline-offset-4"
            >
              Create Account
            </button>
          </p>
        ) : mode === "create-account" ? (
          <p className="text-sm text-charcoal">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("sign-in")}
              className="text-off-black underline underline-offset-4"
            >
              Sign In
            </button>
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Forms bound via <form action={formAction}> reset ALL uncontrolled
 * fields after every submit — success or failure. That's fine for
 * password fields (clearing them on a failed attempt is normal), but it
 * was wiping the email too, forcing a full retype after one typo. Text
 * fields here are controlled so they survive a failed submission;
 * password fields are left uncontrolled on purpose.
 */
function TextField({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2 block text-charcoal">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full border border-off-black bg-transparent px-4 text-sm outline-none"
      />
    </div>
  );
}

function PasswordField({
  id,
  name,
  label,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2 block text-charcoal">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="password"
        required
        autoComplete={autoComplete}
        className="h-12 w-full border border-off-black bg-transparent px-4 text-sm outline-none"
      />
    </div>
  );
}

function ErrorMessage({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="eyebrow text-red-800">{error}</p>;
}

function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-12 w-full items-center justify-center bg-off-black text-sm tracking-[0.08em] text-bone transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {pending ? "…" : label}
    </button>
  );
}

function SignInForm({ onForgotPassword }: { onForgotPassword: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [state, formAction, pending] = useActionState(async (prev: ActionResult, formData: FormData) => {
    const result = await signInAction(prev, formData);
    if (result.success) {
      // The sign-in itself ran server-side, so the client's session store
      // (used by useSession() in the header) doesn't know about it yet —
      // this fetch is what broadcasts the update to it.
      await authClient.getSession();
      router.refresh();
    }
    return result;
  }, initialState);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <TextField
        id="sign-in-email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
      />
      <PasswordField id="sign-in-password" name="password" label="Password" autoComplete="current-password" />
      <ErrorMessage error={state.error} />
      <SubmitButton pending={pending} label="SIGN IN" />
      <button
        type="button"
        onClick={onForgotPassword}
        className="eyebrow text-charcoal underline underline-offset-4"
      >
        Forgot Password
      </button>
    </form>
  );
}

function CreateAccountForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [state, formAction, pending] = useActionState(async (prev: ActionResult, formData: FormData) => {
    const result = await signUpAction(prev, formData);
    if (result.success) {
      await authClient.getSession();
      router.refresh();
    }
    return result;
  }, initialState);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <TextField
          id="first-name"
          name="firstName"
          label="First Name"
          autoComplete="given-name"
          value={firstName}
          onChange={setFirstName}
        />
        <TextField
          id="last-name"
          name="lastName"
          label="Last Name"
          autoComplete="family-name"
          value={lastName}
          onChange={setLastName}
        />
      </div>
      <TextField
        id="create-email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
      />
      <PasswordField id="create-password" name="password" label="Password" autoComplete="new-password" />
      <PasswordField
        id="confirm-password"
        name="confirmPassword"
        label="Confirm Password"
        autoComplete="new-password"
      />
      <ErrorMessage error={state.error} />
      <SubmitButton pending={pending} label="CREATE ACCOUNT" />
    </form>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialState);

  if (state.success) {
    return (
      <div className="mt-8 flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-charcoal">
          If an account exists for that email, we&rsquo;ve sent a link to reset your password.
        </p>
        <button type="button" onClick={onBack} className="eyebrow text-charcoal underline underline-offset-4">
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-charcoal">
        Enter your email and we&rsquo;ll send you a link to reset your password.
      </p>
      <TextField
        id="forgot-email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
      />
      <ErrorMessage error={state.error} />
      <SubmitButton pending={pending} label="SEND RESET LINK" />
      <button type="button" onClick={onBack} className="eyebrow text-charcoal underline underline-offset-4">
        Back to Sign In
      </button>
    </form>
  );
}
