import { NextResponse, type NextRequest } from "next/server";
import { processAuthMiddleware, DEFAULT_AUTH_SKIP_ROUTES } from "@neondatabase/auth/server";

/**
 * Neon Auth's own docs (and the "Cookies can only be modified in a Server
 * Action or Route Handler" crash this hit in production) make this
 * required, not optional: session refresh/rotation has to happen in real
 * middleware — a Server Component can only READ cookies, so once
 * getSession() is called from one (app/account/page.tsx, lib/admin/auth.ts)
 * and the session is old enough to need a fresh cookie, it throws instead
 * of returning stale data.
 *
 * The bundled `auth.middleware()` helper (from @neondatabase/auth/next)
 * doesn't work here: its skipRoutes is hardcoded to DEFAULT_AUTH_SKIP_ROUTES
 * internally (not configurable through its public API), so it would treat
 * every route — the homepage, /shop, product pages, everything — as
 * requiring a session and redirect anonymous visitors away. AFTER SIN is a
 * public storefront with only two auth-aware areas (/account, /admin), so
 * this calls the lower-level, framework-agnostic processAuthMiddleware
 * directly instead, with a real skip list, exactly as documented at
 * https://www.npmjs.com/package/@neondatabase/auth (server toolkit).
 * Auth gating for /account and /admin is already handled correctly in
 * their own server components/layouts — this middleware's only job is
 * the session-cookie refresh, so effectively nothing here needs to be
 * "protected" by it. Adding a new top-level public route later means
 * adding it to SKIP_ROUTES too.
 *
 * BUG FIX: SKIP_ROUTES is an allowlist, so any path NOT on it (a typo,
 * a dead link, a genuinely nonexistent route) was treated as requiring a
 * session and hit the "redirect_login" branch below, 307-redirecting an
 * anonymous visitor to /account instead of letting Next.js render its
 * own 404 page — breaking 404 handling site-wide and returning a 3xx
 * instead of a 404 status to crawlers. Since nothing is actually meant
 * to be protected at this layer (per the paragraph above), redirect_login
 * is treated as a no-op "allow" below instead of performing the
 * redirect — this does not touch redirect_oauth, which is a real,
 * required mid-flow OAuth token-exchange redirect, unrelated to route
 * gating.
 */
const SKIP_ROUTES = [
  ...DEFAULT_AUTH_SKIP_ROUTES,
  "/",
  "/about",
  "/account",
  "/admin",
  "/api/checkout",
  "/api/waitlist",
  "/api/webhooks",
  "/cart",
  "/checkout",
  "/collections",
  "/contact",
  "/editorial",
  "/faq",
  "/privacy",
  "/product",
  "/returns",
  "/shipping",
  "/shop",
  "/terms",
];

export default async function middleware(request: NextRequest) {
  const result = await processAuthMiddleware({
    request,
    pathname: request.nextUrl.pathname,
    skipRoutes: SKIP_ROUTES,
    loginUrl: "/account",
    baseUrl: process.env.NEON_AUTH_BASE_URL!,
    cookieSecret: process.env.NEON_AUTH_COOKIE_SECRET!,
  });

  switch (result.action) {
    case "allow": {
      const response = NextResponse.next();
      if (result.headers) for (const [key, value] of Object.entries(result.headers)) response.headers.set(key, value);
      if (result.cookies) for (const cookie of result.cookies) response.headers.append("Set-Cookie", cookie);
      return response;
    }
    case "redirect_oauth": {
      const response = NextResponse.redirect(result.redirectUrl);
      if (result.cookies) for (const cookie of result.cookies) response.headers.append("Set-Cookie", cookie);
      return response;
    }
    case "redirect_login": {
      // See comment above SKIP_ROUTES — this is not an auth gate, so a
      // missing session on an unlisted route just falls through to
      // Next's normal routing (a real page, or its own 404) instead of
      // redirecting to /account.
      const response = NextResponse.next();
      if (result.cookies) for (const cookie of result.cookies) response.headers.append("Set-Cookie", cookie);
      return response;
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
