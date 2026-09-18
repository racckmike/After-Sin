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
    case "redirect_oauth":
    case "redirect_login": {
      const response = NextResponse.redirect(result.redirectUrl);
      if (result.cookies) for (const cookie of result.cookies) response.headers.append("Set-Cookie", cookie);
      return response;
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
