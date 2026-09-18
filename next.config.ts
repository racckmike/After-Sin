import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Neon Auth's client SDK calls its own hosted origin directly (session
// checks, sign-in/up, etc.) — CSP's connect-src has to allow that or every
// auth request gets silently blocked by the browser, not the server.
const neonAuthOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_NEON_AUTH_URL ?? "").origin;
  } catch {
    return "";
  }
})();

// No external script/style/font/image hosts (fonts are bundled via
// @fontsource, product imagery is served from /public), but script-src
// still needs 'unsafe-inline': the App Router streams RSC payload data
// through inline <script>self.__next_f.push(...)</script> tags on every
// page, static or dynamic, so blocking inline scripts breaks hydration
// site-wide. This is Next.js's own documented "without nonces" CSP —
// https://nextjs.org/docs/app/guides/content-security-policy — the
// nonce-based alternative forces every page to render dynamically
// (no static generation/CDN caching), which isn't a trade worth making
// for a mostly-static storefront. 'unsafe-eval' is dev-only, for
// Turbopack's HMR runtime.
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data:`,
  `font-src 'self' data:`,
  `connect-src 'self'${neonAuthOrigin ? ` ${neonAuthOrigin}` : ""}${isDev ? " ws:" : ""}`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
