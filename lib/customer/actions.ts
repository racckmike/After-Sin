"use server";

import { auth } from "@/lib/auth/server";
import { friendlyAuthError } from "@/lib/auth/errors";
import {
  upsertProfile,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type AddressInput,
} from "@/lib/customer/db";
import type { ActionResult } from "@/lib/auth/actions";

/** Every action here re-derives the user from the session — never trust a client-supplied id. */
async function requireUserId(): Promise<string> {
  const { data: session } = await auth.getSession();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user.id;
}

export async function updateProfileAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return { error: "Sign in first." };
  }

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  if (!firstName || !lastName) return { error: "Enter your first and last name." };

  await upsertProfile(userId, firstName, lastName);
  // Keep Better Auth's own "name" field in sync for anything that reads it directly.
  await auth.updateUser({ name: `${firstName} ${lastName}` });

  return { success: true };
}

export async function changePasswordAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword) return { error: "Enter your current password." };
  if (newPassword.length < 8) return { error: "New password must be at least 8 characters." };
  if (newPassword !== confirmPassword) return { error: "Passwords don't match." };

  const { error } = await auth.changePassword({ currentPassword, newPassword });
  if (error) return { error: friendlyAuthError(error) };
  return { success: true };
}

function addressFromForm(formData: FormData): AddressInput | { error: string } {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const line1 = String(formData.get("line1") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();

  if (!fullName || !line1 || !city || !region || !postalCode || !country) {
    return { error: "Fill in all required address fields." };
  }

  return {
    fullName,
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    line1,
    line2: String(formData.get("line2") ?? "").trim() || undefined,
    city,
    region,
    postalCode,
    country,
    isDefault: formData.get("isDefault") === "on",
  };
}

export async function createAddressAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return { error: "Sign in first." };
  }

  const input = addressFromForm(formData);
  if ("error" in input) return input;

  await createAddress(userId, input);
  return { success: true };
}

export async function updateAddressAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return { error: "Sign in first." };
  }

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return { error: "Something went wrong. Please try again." };

  const input = addressFromForm(formData);
  if ("error" in input) return input;

  await updateAddress(userId, id, input);
  return { success: true };
}

export async function deleteAddressAction(id: number): Promise<ActionResult> {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return { error: "Sign in first." };
  }
  await deleteAddress(userId, id);
  return { success: true };
}

export async function setDefaultAddressAction(id: number): Promise<ActionResult> {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return { error: "Sign in first." };
  }
  await setDefaultAddress(userId, id);
  return { success: true };
}
