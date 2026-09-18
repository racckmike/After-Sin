/**
 * @neondatabase/auth normalizes every backend error (Better Auth, OAuth,
 * etc.) into its own stable, lowercase snake_case `error.code` taxonomy
 * before handing it back to the caller — see AuthErrorCode /
 * BETTER_AUTH_ERROR_MAP in node_modules/@neondatabase/auth's
 * better-auth-helpers chunk. Map those codes to copy that reads like the
 * rest of the site, instead of showing the SDK's default message or a
 * generic "something went wrong" for everything.
 */
const MESSAGES: Record<string, string> = {
  invalid_credentials: "That email or password isn't right.",
  user_not_found: "We couldn't find an account with that email.",
  email_not_confirmed: "Verify your email before signing in — check your inbox.",
  user_already_exists: "An account already exists with that email.",
  email_exists: "An account already exists with that email.",
  email_address_invalid: "Enter a valid email address.",
  weak_password: "Password must be at least 8 characters.",
  bad_jwt: "This link has expired or already been used.",
  session_expired: "Your session expired — sign in again.",
  session_not_found: "Your session expired — sign in again.",
  validation_failed: "Check the fields and try again.",
  bad_json: "Check the fields and try again.",
  over_request_rate_limit: "Too many attempts — wait a moment and try again.",
  over_email_send_rate_limit: "Too many attempts — wait a moment and try again.",
  feature_not_supported: "That isn't available right now.",
};

export function friendlyAuthError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  if (code && MESSAGES[code]) return MESSAGES[code];
  const message = (error as { message?: string } | null)?.message;
  if (message && message.length < 120) return message;
  return "Something went wrong. Please try again.";
}
