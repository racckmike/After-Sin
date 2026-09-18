import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_RE = /^[a-z0-9-]+$/;

/**
 * This route is only ever called same-origin (see components/editorial/
 * Newsletter.tsx and components/commerce/ProductInfo.tsx — both use a
 * relative fetch("/api/waitlist")), unlike Server Actions, a plain Route
 * Handler gets no automatic Origin check from Next.js, so without this a
 * script embedded on any other site could silently submit signups through
 * a visitor's browser. A missing Origin header (curl, some native apps)
 * is allowed through rather than rejected, since it isn't a browser
 * cross-site request in the first place.
 */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  let body: { email?: string; productSlug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase().slice(0, 320);
  const productSlug = body.productSlug?.trim().toLowerCase().slice(0, 80) || "newsletter";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }
  if (!SLUG_RE.test(productSlug)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json(
      { error: "Waitlist isn't connected yet — try again soon" },
      { status: 503 }
    );
  }

  const sql = neon(databaseUrl);

  // Zero-migration setup: creates the table on first use instead of
  // requiring a separate manual step. Fine at this scale (a pre-launch
  // waitlist).
  await sql`
    CREATE TABLE IF NOT EXISTS waitlist_signups (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      product_slug TEXT NOT NULL DEFAULT 'newsletter',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (email, product_slug)
    )
  `;

  await sql`
    INSERT INTO waitlist_signups (email, product_slug)
    VALUES (${email}, ${productSlug})
    ON CONFLICT (email, product_slug) DO NOTHING
  `;

  return NextResponse.json({ ok: true });
}
