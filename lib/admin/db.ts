import { neon } from "@neondatabase/serverless";

function db() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
  return neon(databaseUrl);
}

let tablesReady: Promise<void> | null = null;

function ensureAdminTables() {
  if (!tablesReady) {
    tablesReady = (async () => {
      const sql = db();
      await sql`
        CREATE TABLE IF NOT EXISTS admin_audit_log (
          id SERIAL PRIMARY KEY,
          admin_user_id TEXT NOT NULL,
          admin_email TEXT NOT NULL,
          action TEXT NOT NULL,
          resource TEXT,
          metadata JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS admin_audit_log_created_at_idx ON admin_audit_log (created_at DESC)`;
    })();
  }
  return tablesReady;
}

export async function logAdminAction(
  adminUserId: string,
  adminEmail: string,
  action: string,
  resource?: string,
  metadata?: Record<string, unknown>
) {
  await ensureAdminTables();
  const sql = db();
  await sql`
    INSERT INTO admin_audit_log (admin_user_id, admin_email, action, resource, metadata)
    VALUES (${adminUserId}, ${adminEmail}, ${action}, ${resource ?? null}, ${metadata ? JSON.stringify(metadata) : null})
  `;
}

export interface AuditLogEntry {
  id: number;
  adminEmail: string;
  action: string;
  resource: string | null;
  createdAt: string;
}

export async function listAuditLog(limit = 20): Promise<AuditLogEntry[]> {
  await ensureAdminTables();
  const sql = db();
  const rows = await sql`
    SELECT id, admin_email, action, resource, created_at
    FROM admin_audit_log
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return (
    rows as { id: number; admin_email: string; action: string; resource: string | null; created_at: string }[]
  ).map((r) => ({
    id: r.id,
    adminEmail: r.admin_email,
    action: r.action,
    resource: r.resource,
    createdAt: r.created_at,
  }));
}

// ---------------------------------------------------------------------------
// Waitlist (real data — waitlist_signups is the same table the public
// waitlist forms write to via app/api/waitlist/route.ts).
// ---------------------------------------------------------------------------

export interface WaitlistRow {
  id: number;
  email: string;
  productSlug: string;
  createdAt: string;
}

export interface WaitlistQuery {
  search?: string;
  productSlug?: string;
  sort?: "newest" | "oldest" | "email";
  page: number;
  pageSize: number;
}

export async function listWaitlist(
  query: WaitlistQuery
): Promise<{ rows: WaitlistRow[]; total: number }> {
  const sql = db();
  const search = query.search?.trim() || null;
  const productSlug = query.productSlug?.trim() || null;
  const offset = (query.page - 1) * query.pageSize;
  const orderBy =
    query.sort === "oldest" ? sql`created_at ASC` : query.sort === "email" ? sql`email ASC` : sql`created_at DESC`;

  const rows = await sql`
    SELECT id, email, product_slug, created_at
    FROM waitlist_signups
    WHERE (${search}::text IS NULL OR email ILIKE '%' || ${search} || '%')
      AND (${productSlug}::text IS NULL OR product_slug = ${productSlug})
    ORDER BY ${orderBy}
    LIMIT ${query.pageSize} OFFSET ${offset}
  `;
  const countRows = await sql`
    SELECT count(*)::int AS count
    FROM waitlist_signups
    WHERE (${search}::text IS NULL OR email ILIKE '%' || ${search} || '%')
      AND (${productSlug}::text IS NULL OR product_slug = ${productSlug})
  `;

  return {
    rows: (rows as { id: number; email: string; product_slug: string; created_at: string }[]).map((r) => ({
      id: r.id,
      email: r.email,
      productSlug: r.product_slug,
      createdAt: r.created_at,
    })),
    total: (countRows[0] as { count: number }).count,
  };
}

/** Unpaginated — for CSV export, respecting the same filters as the table view. */
export async function listWaitlistAll(search?: string, productSlug?: string): Promise<WaitlistRow[]> {
  const sql = db();
  const s = search?.trim() || null;
  const p = productSlug?.trim() || null;
  const rows = await sql`
    SELECT id, email, product_slug, created_at
    FROM waitlist_signups
    WHERE (${s}::text IS NULL OR email ILIKE '%' || ${s} || '%')
      AND (${p}::text IS NULL OR product_slug = ${p})
    ORDER BY created_at DESC
  `;
  return (rows as { id: number; email: string; product_slug: string; created_at: string }[]).map((r) => ({
    id: r.id,
    email: r.email,
    productSlug: r.product_slug,
    createdAt: r.created_at,
  }));
}

export async function listWaitlistProductSlugs(): Promise<string[]> {
  const sql = db();
  const rows = await sql`SELECT DISTINCT product_slug FROM waitlist_signups ORDER BY product_slug`;
  return (rows as { product_slug: string }[]).map((r) => r.product_slug);
}

export async function countWaitlist(): Promise<number> {
  const sql = db();
  const rows = await sql`SELECT count(*)::int AS count FROM waitlist_signups`;
  return (rows[0] as { count: number }).count;
}

// ---------------------------------------------------------------------------
// Customers (real data — neon_auth.user is Neon Auth's own managed table;
// customer_profiles/customer_addresses are the app-owned tables from the
// customer account system). Order/spend fields are hardcoded to 0/null
// until a real order system exists — see /admin/orders.
// ---------------------------------------------------------------------------

export interface CustomerRow {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  emailVerified: boolean;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
}

export interface CustomerQuery {
  search?: string;
  page: number;
  pageSize: number;
}

export async function listCustomers(
  query: CustomerQuery
): Promise<{ rows: CustomerRow[]; total: number }> {
  const sql = db();
  const search = query.search?.trim() || null;
  const offset = (query.page - 1) * query.pageSize;

  const rows = await sql`
    SELECT u.id, u.email, u."emailVerified" AS email_verified, u."createdAt" AS created_at,
           p.first_name, p.last_name
    FROM neon_auth."user" u
    LEFT JOIN public.customer_profiles p ON p.user_id = u.id::text
    WHERE (
      ${search}::text IS NULL
      OR u.email ILIKE '%' || ${search} || '%'
      OR p.first_name ILIKE '%' || ${search} || '%'
      OR p.last_name ILIKE '%' || ${search} || '%'
    )
    ORDER BY u."createdAt" DESC
    LIMIT ${query.pageSize} OFFSET ${offset}
  `;
  const countRows = await sql`
    SELECT count(*)::int AS count
    FROM neon_auth."user" u
    LEFT JOIN public.customer_profiles p ON p.user_id = u.id::text
    WHERE (
      ${search}::text IS NULL
      OR u.email ILIKE '%' || ${search} || '%'
      OR p.first_name ILIKE '%' || ${search} || '%'
      OR p.last_name ILIKE '%' || ${search} || '%'
    )
  `;

  type Row = {
    id: string;
    email: string;
    email_verified: boolean;
    created_at: string;
    first_name: string | null;
    last_name: string | null;
  };
  return {
    rows: (rows as Row[]).map((r) => ({
      id: r.id,
      email: r.email,
      firstName: r.first_name,
      lastName: r.last_name,
      emailVerified: r.email_verified,
      createdAt: r.created_at,
      orderCount: 0,
      totalSpent: 0,
      lastOrderAt: null,
    })),
    total: (countRows[0] as { count: number }).count,
  };
}

export async function getCustomer(id: string): Promise<CustomerRow | null> {
  const sql = db();
  const rows = await sql`
    SELECT u.id, u.email, u."emailVerified" AS email_verified, u."createdAt" AS created_at,
           p.first_name, p.last_name
    FROM neon_auth."user" u
    LEFT JOIN public.customer_profiles p ON p.user_id = u.id::text
    WHERE u.id = ${id}
  `;
  const row = rows[0] as
    | { id: string; email: string; email_verified: boolean; created_at: string; first_name: string | null; last_name: string | null }
    | undefined;
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    emailVerified: row.email_verified,
    createdAt: row.created_at,
    orderCount: 0,
    totalSpent: 0,
    lastOrderAt: null,
  };
}

export async function countCustomers(): Promise<number> {
  const sql = db();
  const rows = await sql`SELECT count(*)::int AS count FROM neon_auth."user"`;
  return (rows[0] as { count: number }).count;
}

export async function getUserIdByEmail(email: string): Promise<string | null> {
  const sql = db();
  const rows = await sql`SELECT id FROM neon_auth."user" WHERE email = ${email.trim().toLowerCase()}`;
  return (rows[0] as { id: string } | undefined)?.id ?? null;
}

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function listAdmins(): Promise<AdminAccount[]> {
  const sql = db();
  const rows = await sql`
    SELECT id, email, name, role FROM neon_auth."user" WHERE role IN ('admin', 'owner') ORDER BY email
  `;
  return rows as AdminAccount[];
}
