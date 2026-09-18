import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/account/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset Password — AFTER SIN" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="mx-auto max-w-[420px] px-4 py-16 md:py-24">
      <p className="eyebrow text-charcoal">Account</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl">Reset Password</h1>
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="mt-8 text-sm leading-relaxed text-charcoal">
          This link is missing its token — request a new password reset from the{" "}
          <a href="/account" className="text-off-black underline underline-offset-4">
            sign in page
          </a>
          .
        </p>
      )}
    </div>
  );
}
