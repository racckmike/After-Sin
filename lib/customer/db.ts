import { neon } from "@neondatabase/serverless";

/**
 * App-level customer data (profile, addresses) lives in this same Postgres
 * database, alongside — but separate from — the tables Neon Auth manages
 * for itself. Auth owns identity (email, password, session); these tables
 * own the AFTER SIN-specific data, keyed by the auth user's id. No FK
 * constraint against Neon Auth's internal schema — that's intentionally
 * decoupled since it's managed infrastructure, not something we migrate.
 */
function db() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
  return neon(databaseUrl);
}

let tablesReady: Promise<void> | null = null;

/**
 * Zero-migration setup, same pattern as the waitlist table. Deliberately
 * calls db() itself rather than taking `sql` as a parameter — passing a
 * neon() client across a typed function boundary hits a NeonQueryFunction
 * generic-arity mismatch (learned this the first time, on the waitlist
 * route).
 */
function ensureTables() {
  if (!tablesReady) {
    tablesReady = (async () => {
      const sql = db();
      await sql`
        CREATE TABLE IF NOT EXISTS customer_profiles (
          user_id TEXT PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS customer_addresses (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          full_name TEXT NOT NULL,
          phone TEXT,
          line1 TEXT NOT NULL,
          line2 TEXT,
          city TEXT NOT NULL,
          region TEXT NOT NULL,
          postal_code TEXT NOT NULL,
          country TEXT NOT NULL,
          is_default BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS customer_addresses_user_id_idx ON customer_addresses (user_id)`;
    })();
  }
  return tablesReady;
}

export interface CustomerProfile {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface CustomerAddress {
  id: number;
  userId: string;
  fullName: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export async function getProfile(userId: string): Promise<CustomerProfile | null> {
  const sql = db();
  await ensureTables();
  const rows = await sql`
    SELECT user_id, first_name, last_name FROM customer_profiles WHERE user_id = ${userId}
  `;
  const row = rows[0] as { user_id: string; first_name: string; last_name: string } | undefined;
  if (!row) return null;
  return { userId: row.user_id, firstName: row.first_name, lastName: row.last_name };
}

export async function upsertProfile(userId: string, firstName: string, lastName: string) {
  const sql = db();
  await ensureTables();
  await sql`
    INSERT INTO customer_profiles (user_id, first_name, last_name)
    VALUES (${userId}, ${firstName}, ${lastName})
    ON CONFLICT (user_id) DO UPDATE SET
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      updated_at = now()
  `;
}

export async function listAddresses(userId: string): Promise<CustomerAddress[]> {
  const sql = db();
  await ensureTables();
  const rows = await sql`
    SELECT id, user_id, full_name, phone, line1, line2, city, region, postal_code, country, is_default
    FROM customer_addresses
    WHERE user_id = ${userId}
    ORDER BY is_default DESC, created_at DESC
  `;
  return (
    rows as {
      id: number;
      user_id: string;
      full_name: string;
      phone: string | null;
      line1: string;
      line2: string | null;
      city: string;
      region: string;
      postal_code: string;
      country: string;
      is_default: boolean;
    }[]
  ).map((r) => ({
    id: r.id,
    userId: r.user_id,
    fullName: r.full_name,
    phone: r.phone,
    line1: r.line1,
    line2: r.line2,
    city: r.city,
    region: r.region,
    postalCode: r.postal_code,
    country: r.country,
    isDefault: r.is_default,
  }));
}

export interface AddressInput {
  fullName: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export async function createAddress(userId: string, input: AddressInput) {
  const sql = db();
  await ensureTables();
  if (input.isDefault) {
    await sql`UPDATE customer_addresses SET is_default = false WHERE user_id = ${userId}`;
  }
  await sql`
    INSERT INTO customer_addresses
      (user_id, full_name, phone, line1, line2, city, region, postal_code, country, is_default)
    VALUES (
      ${userId}, ${input.fullName}, ${input.phone ?? null}, ${input.line1}, ${input.line2 ?? null},
      ${input.city}, ${input.region}, ${input.postalCode}, ${input.country}, ${input.isDefault ?? false}
    )
  `;
}

export async function updateAddress(userId: string, id: number, input: AddressInput) {
  const sql = db();
  await ensureTables();
  if (input.isDefault) {
    await sql`UPDATE customer_addresses SET is_default = false WHERE user_id = ${userId}`;
  }
  await sql`
    UPDATE customer_addresses SET
      full_name = ${input.fullName},
      phone = ${input.phone ?? null},
      line1 = ${input.line1},
      line2 = ${input.line2 ?? null},
      city = ${input.city},
      region = ${input.region},
      postal_code = ${input.postalCode},
      country = ${input.country},
      is_default = ${input.isDefault ?? false},
      updated_at = now()
    WHERE id = ${id} AND user_id = ${userId}
  `;
}

export async function deleteAddress(userId: string, id: number) {
  const sql = db();
  await ensureTables();
  await sql`DELETE FROM customer_addresses WHERE id = ${id} AND user_id = ${userId}`;
}

export async function setDefaultAddress(userId: string, id: number) {
  const sql = db();
  await ensureTables();
  await sql`UPDATE customer_addresses SET is_default = false WHERE user_id = ${userId}`;
  await sql`UPDATE customer_addresses SET is_default = true WHERE id = ${id} AND user_id = ${userId}`;
}
