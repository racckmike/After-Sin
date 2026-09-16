import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: string; productSlug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const productSlug = body.productSlug?.trim() || "newsletter";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
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
