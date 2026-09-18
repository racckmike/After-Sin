"use server";

import { auth } from "@/lib/auth/server";
import { friendlyAuthError } from "@/lib/auth/errors";
import { upsertProfile } from "@/lib/customer/db";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signUpAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!firstName || !lastName) return { error: "Enter your first and last name." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirmPassword) return { error: "Passwords don't match." };

  const { data, error } = await auth.signUp.email({
    email,
    password,
    name: `${firstName} ${lastName}`,
  });
  if (error) return { error: friendlyAuthError(error) };
  if (!data?.user?.id) return { error: "Something went wrong. Please try again." };

  // Auth owns identity; this app owns first/last name as separate fields
  // (Better Auth's default schema only has a single "name" string).
  await upsertProfile(data.user.id, firstName, lastName);

  return { success: true };
}

export async function signInAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };
  if (!password) return { error: "Enter your password." };

  const { error } = await auth.signIn.email({ email, password, rememberMe: true });
  if (error) return { error: friendlyAuthError(error) };
  return { success: true };
}


export async function requestPasswordResetAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };

  const { error } = await auth.requestPasswordReset({
    email,
    redirectTo: "/account/reset-password",
  });
  // Never reveal whether the email exists — same success message either way.
  if (error) return { error: friendlyAuthError(error) };
  return { success: true };
}

export async function resetPasswordAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = String(formData.get("token") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) return { error: "This link is invalid — request a new one." };
  if (newPassword.length < 8) return { error: "Password must be at least 8 characters." };
  if (newPassword !== confirmPassword) return { error: "Passwords don't match." };

  const { error } = await auth.resetPassword({ newPassword, token });
  if (error) return { error: friendlyAuthError(error) };
  return { success: true };
}

export async function resendVerificationAction(): Promise<ActionResult> {
  const { data: session } = await auth.getSession();
  if (!session?.user?.email) return { error: "Sign in first." };
  const { error } = await auth.sendVerificationEmail({ email: session.user.email });
  if (error) return { error: friendlyAuthError(error) };
  return { success: true };
}
