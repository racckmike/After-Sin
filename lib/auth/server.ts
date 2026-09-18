import { createNeonAuth } from "@neondatabase/auth/next/server";

/**
 * Singleton Neon Auth instance for server use — Server Components, Server
 * Actions, and the API route handler all share this. It wraps Better Auth
 * (proven session/password handling) against the Neon Auth instance that's
 * already provisioned for this project's database.
 */
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
