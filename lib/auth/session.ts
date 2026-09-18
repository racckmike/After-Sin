import { auth } from "@/lib/auth/server";

/**
 * proxy.ts refreshes the session cookie before most requests reach a
 * Server Component, but a session that's invalid beyond a routine refresh
 * (revoked, or its user deleted — e.g. an admin removing an account while
 * it's still logged in elsewhere) makes the SDK attempt its own cookie
 * write here anyway, which Next.js forbids outside a Server Action/Route
 * Handler/middleware and throws for. A broken session is functionally the
 * same as no session, so treat that specific failure as logged-out instead
 * of letting the page crash.
 */
export async function getSessionSafe(): Promise<Awaited<ReturnType<typeof auth.getSession>>> {
  try {
    return await auth.getSession();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("Cookies can only be modified")) {
      return { data: null, error: null };
    }
    throw error;
  }
}
