import { neon } from "@neondatabase/serverless";

function db() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
  return neon(databaseUrl);
}

let tablesReady: Promise<void> | null = null;

/**
 * paid_at / inventory_decremented_at / confirmation_email_sent_at are each
 * independently claimed (UPDATE ... WHERE x IS NULL RETURNING) rather than
 * inferred from `status` alone — a webhook retry after a crash between
 * steps needs to resume only the steps that didn't finish, not redo
 * everything or (worse) silently skip a step it never actually completed.
 * See app/api/webhooks/mercadopago/route.ts.
 */
function ensureTables() {
  if (!tablesReady) {
    tablesReady = (async () => {
      const sql = db();
      await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          order_number TEXT NOT NULL UNIQUE,
          user_id TEXT,
          email TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending_payment',
          currency TEXT NOT NULL DEFAULT 'MXN',
          subtotal_centavos INTEGER NOT NULL,
          shipping_centavos INTEGER NOT NULL DEFAULT 0,
          discount_centavos INTEGER NOT NULL DEFAULT 0,
          tax_centavos INTEGER NOT NULL DEFAULT 0,
          total_centavos INTEGER NOT NULL,
          shipping_address JSONB NOT NULL,
          mp_preference_id TEXT,
          mp_payment_id TEXT,
          discount_code TEXT,
          creator_code TEXT,
          tracking_carrier TEXT,
          tracking_number TEXT,
          paid_at TIMESTAMPTZ,
          inventory_decremented_at TIMESTAMPTZ,
          confirmation_email_sent_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders (user_id)`;
      await sql`CREATE INDEX IF NOT EXISTS orders_email_idx ON orders (email)`;
      await sql`CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC)`;

      await sql`
        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          product_slug TEXT NOT NULL,
          product_name TEXT NOT NULL,
          variant_color TEXT NOT NULL,
          variant_size TEXT NOT NULL,
          unit_price_centavos INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          image_url TEXT
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id)`;

      await sql`
        CREATE TABLE IF NOT EXISTS product_inventory (
          id SERIAL PRIMARY KEY,
          product_slug TEXT NOT NULL,
          color TEXT NOT NULL,
          size TEXT NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          UNIQUE (product_slug, color, size)
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS mp_webhook_events (
          notification_id TEXT PRIMARY KEY,
          event_type TEXT,
          received_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
    })();
  }
  return tablesReady;
}

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

export async function getAvailableStock(productSlug: string, color: string, size: string): Promise<number> {
  await ensureTables();
  const sql = db();
  const rows = await sql`
    SELECT quantity FROM product_inventory WHERE product_slug = ${productSlug} AND color = ${color} AND size = ${size}
  `;
  return (rows[0] as { quantity: number } | undefined)?.quantity ?? 0;
}

/** Idempotent — safe to call every time a product's inventory is first touched; never resets an existing row. */
export async function seedInventoryIfMissing(productSlug: string, color: string, size: string, quantity: number) {
  await ensureTables();
  const sql = db();
  await sql`
    INSERT INTO product_inventory (product_slug, color, size, quantity)
    VALUES (${productSlug}, ${color}, ${size}, ${quantity})
    ON CONFLICT (product_slug, color, size) DO NOTHING
  `;
}

export interface InventoryRow {
  id: number;
  productSlug: string;
  color: string;
  size: string;
  quantity: number;
  updatedAt: string;
}

export async function listInventory(): Promise<InventoryRow[]> {
  await ensureTables();
  const sql = db();
  const rows = await sql`
    SELECT id, product_slug, color, size, quantity, updated_at FROM product_inventory
    ORDER BY product_slug, color, size
  `;
  return (rows as { id: number; product_slug: string; color: string; size: string; quantity: number; updated_at: string }[]).map(
    (r) => ({ id: r.id, productSlug: r.product_slug, color: r.color, size: r.size, quantity: r.quantity, updatedAt: r.updated_at })
  );
}

export async function setInventoryQuantity(id: number, quantity: number) {
  await ensureTables();
  const sql = db();
  await sql`UPDATE product_inventory SET quantity = ${quantity}, updated_at = now() WHERE id = ${id}`;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export interface CreateOrderItemInput {
  productSlug: string;
  productName: string;
  variantColor: string;
  variantSize: string;
  unitPriceCentavos: number;
  quantity: number;
  imageUrl: string | null;
}

export interface CreateOrderInput {
  userId: string | null;
  email: string;
  currency: string;
  subtotalCentavos: number;
  shippingCentavos: number;
  totalCentavos: number;
  shippingAddress: Record<string, string>;
  items: CreateOrderItemInput[];
}

function generateOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `AS-${suffix}`;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: string | null;
  email: string;
  status: string;
  currency: string;
  subtotalCentavos: number;
  shippingCentavos: number;
  discountCentavos: number;
  taxCentavos: number;
  totalCentavos: number;
  shippingAddress: Record<string, string>;
  mpPreferenceId: string | null;
  mpPaymentId: string | null;
  trackingCarrier: string | null;
  trackingNumber: string | null;
  paidAt: string | null;
  createdAt: string;
}

type OrderRow = {
  id: number;
  order_number: string;
  user_id: string | null;
  email: string;
  status: string;
  currency: string;
  subtotal_centavos: number;
  shipping_centavos: number;
  discount_centavos: number;
  tax_centavos: number;
  total_centavos: number;
  shipping_address: Record<string, string>;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  tracking_carrier: string | null;
  tracking_number: string | null;
  paid_at: string | null;
  created_at: string;
};

function mapOrder(r: OrderRow): Order {
  return {
    id: r.id,
    orderNumber: r.order_number,
    userId: r.user_id,
    email: r.email,
    status: r.status,
    currency: r.currency,
    subtotalCentavos: r.subtotal_centavos,
    shippingCentavos: r.shipping_centavos,
    discountCentavos: r.discount_centavos,
    taxCentavos: r.tax_centavos,
    totalCentavos: r.total_centavos,
    shippingAddress: r.shipping_address,
    mpPreferenceId: r.mp_preference_id,
    mpPaymentId: r.mp_payment_id,
    trackingCarrier: r.tracking_carrier,
    trackingNumber: r.tracking_number,
    paidAt: r.paid_at,
    createdAt: r.created_at,
  };
}

/** Creates the order + line items. Status starts pending_payment; nothing here is a payment claim. */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  await ensureTables();
  const sql = db();

  for (let attempt = 0; attempt < 5; attempt++) {
    const orderNumber = generateOrderNumber();
    const rows = await sql`
      INSERT INTO orders (order_number, user_id, email, currency, subtotal_centavos, shipping_centavos, total_centavos, shipping_address)
      VALUES (${orderNumber}, ${input.userId}, ${input.email}, ${input.currency}, ${input.subtotalCentavos}, ${input.shippingCentavos}, ${input.totalCentavos}, ${JSON.stringify(input.shippingAddress)}::jsonb)
      ON CONFLICT (order_number) DO NOTHING
      RETURNING *
    `;
    if (rows.length === 0) continue; // order_number collision, retry

    const order = mapOrder(rows[0] as OrderRow);
    for (const item of input.items) {
      await sql`
        INSERT INTO order_items (order_id, product_slug, product_name, variant_color, variant_size, unit_price_centavos, quantity, image_url)
        VALUES (${order.id}, ${item.productSlug}, ${item.productName}, ${item.variantColor}, ${item.variantSize}, ${item.unitPriceCentavos}, ${item.quantity}, ${item.imageUrl})
      `;
    }
    return order;
  }
  throw new Error("Could not generate a unique order number");
}

export async function attachPreference(orderId: number, preferenceId: string) {
  const sql = db();
  await sql`UPDATE orders SET mp_preference_id = ${preferenceId}, updated_at = now() WHERE id = ${orderId}`;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  await ensureTables();
  const sql = db();
  const rows = await sql`SELECT * FROM orders WHERE order_number = ${orderNumber}`;
  const row = rows[0] as OrderRow | undefined;
  return row ? mapOrder(row) : null;
}

export interface OrderItemRow {
  id: number;
  productSlug: string;
  productName: string;
  variantColor: string;
  variantSize: string;
  unitPriceCentavos: number;
  quantity: number;
  imageUrl: string | null;
}

export async function getOrderItems(orderId: number): Promise<OrderItemRow[]> {
  const sql = db();
  const rows = await sql`SELECT * FROM order_items WHERE order_id = ${orderId} ORDER BY id`;
  return (
    rows as {
      id: number;
      product_slug: string;
      product_name: string;
      variant_color: string;
      variant_size: string;
      unit_price_centavos: number;
      quantity: number;
      image_url: string | null;
    }[]
  ).map((r) => ({
    id: r.id,
    productSlug: r.product_slug,
    productName: r.product_name,
    variantColor: r.variant_color,
    variantSize: r.variant_size,
    unitPriceCentavos: r.unit_price_centavos,
    quantity: r.quantity,
    imageUrl: r.image_url,
  }));
}

/**
 * Atomically claims the "mark paid" step. Returns the order if THIS call
 * won the claim (paid_at was NULL), or null if it was already claimed —
 * the caller uses that to skip inventory/email on a duplicate webhook.
 * A single UPDATE is inherently atomic in Postgres; no extra locking needed.
 */
export async function claimOrderPaid(orderNumber: string, mpPaymentId: string): Promise<Order | null> {
  await ensureTables();
  const sql = db();
  const rows = await sql`
    UPDATE orders
    SET status = 'paid', paid_at = now(), mp_payment_id = ${mpPaymentId}, updated_at = now()
    WHERE order_number = ${orderNumber} AND paid_at IS NULL
    RETURNING *
  `;
  return rows.length > 0 ? mapOrder(rows[0] as OrderRow) : null;
}

/** Same claim-then-act pattern as claimOrderPaid, for the inventory-decrement step specifically. */
export async function claimInventoryDecrement(orderNumber: string): Promise<boolean> {
  const sql = db();
  const rows = await sql`
    UPDATE orders SET inventory_decremented_at = now()
    WHERE order_number = ${orderNumber} AND inventory_decremented_at IS NULL
    RETURNING id
  `;
  return rows.length > 0;
}

/**
 * Decrements every line item's stock in one atomic batch. Uses
 * GREATEST(..., 0) rather than a hard floor check: payment has already
 * succeeded by this point, so the correct response to a stock race is to
 * clamp at zero and flag it for manual review (logged by the caller),
 * not to fail an already-paid order.
 */
export async function decrementInventoryForOrder(items: OrderItemRow[]): Promise<{ productSlug: string; color: string; size: string; remaining: number }[]> {
  const sql = db();
  const results: { productSlug: string; color: string; size: string; remaining: number }[] = [];
  const queries = items.map((item) =>
    sql`
      UPDATE product_inventory
      SET quantity = GREATEST(quantity - ${item.quantity}, 0), updated_at = now()
      WHERE product_slug = ${item.productSlug} AND color = ${item.variantColor} AND size = ${item.variantSize}
      RETURNING product_slug, color, size, quantity
    `
  );
  const batches = await sql.transaction(queries);
  for (const rows of batches as unknown as { product_slug: string; color: string; size: string; quantity: number }[][]) {
    const row = rows[0];
    if (row) results.push({ productSlug: row.product_slug, color: row.color, size: row.size, remaining: row.quantity });
  }
  return results;
}

export async function claimConfirmationEmail(orderNumber: string): Promise<boolean> {
  const sql = db();
  const rows = await sql`
    UPDATE orders SET confirmation_email_sent_at = now()
    WHERE order_number = ${orderNumber} AND confirmation_email_sent_at IS NULL
    RETURNING id
  `;
  return rows.length > 0;
}

export async function recordWebhookEvent(notificationId: string, eventType: string): Promise<boolean> {
  await ensureTables();
  const sql = db();
  const rows = await sql`
    INSERT INTO mp_webhook_events (notification_id, event_type) VALUES (${notificationId}, ${eventType})
    ON CONFLICT (notification_id) DO NOTHING
    RETURNING notification_id
  `;
  return rows.length > 0;
}

// ---------------------------------------------------------------------------
// Customer / admin order listings
// ---------------------------------------------------------------------------

export async function listOrdersForCustomer(userId: string): Promise<Order[]> {
  await ensureTables();
  const sql = db();
  const rows = await sql`SELECT * FROM orders WHERE user_id = ${userId} AND status != 'pending_payment' ORDER BY created_at DESC`;
  return (rows as OrderRow[]).map(mapOrder);
}

/** Ownership-checked: returns null (not the order) when it doesn't belong to userId — the caller can't distinguish "not found" from "not yours." */
export async function getOrderForCustomer(orderNumber: string, userId: string): Promise<Order | null> {
  await ensureTables();
  const sql = db();
  const rows = await sql`SELECT * FROM orders WHERE order_number = ${orderNumber} AND user_id = ${userId}`;
  const row = rows[0] as OrderRow | undefined;
  return row ? mapOrder(row) : null;
}

export interface AdminOrderQuery {
  search?: string;
  status?: string;
  page: number;
  pageSize: number;
}

export async function listOrdersForAdmin(query: AdminOrderQuery): Promise<{ rows: Order[]; total: number }> {
  await ensureTables();
  const sql = db();
  const search = query.search?.trim() || null;
  const status = query.status?.trim() || null;
  const offset = (query.page - 1) * query.pageSize;

  const rows = await sql`
    SELECT * FROM orders
    WHERE status != 'pending_payment'
      AND (${search}::text IS NULL OR email ILIKE '%' || ${search} || '%' OR order_number ILIKE '%' || ${search} || '%')
      AND (${status}::text IS NULL OR status = ${status})
    ORDER BY created_at DESC
    LIMIT ${query.pageSize} OFFSET ${offset}
  `;
  const countRows = await sql`
    SELECT count(*)::int AS count FROM orders
    WHERE status != 'pending_payment'
      AND (${search}::text IS NULL OR email ILIKE '%' || ${search} || '%' OR order_number ILIKE '%' || ${search} || '%')
      AND (${status}::text IS NULL OR status = ${status})
  `;
  return { rows: (rows as OrderRow[]).map(mapOrder), total: (countRows[0] as { count: number }).count };
}

export async function countPaidOrders(): Promise<{ orders: number; totalCentavos: number }> {
  await ensureTables();
  const sql = db();
  const rows = await sql`
    SELECT count(*)::int AS orders, COALESCE(SUM(total_centavos), 0)::int AS total_centavos
    FROM orders WHERE status != 'pending_payment'
  `;
  const row = rows[0] as { orders: number; total_centavos: number };
  return { orders: row.orders, totalCentavos: row.total_centavos };
}

/** Paid but not yet shipped — the admin's fulfillment queue. */
export async function countOrdersToFulfill(): Promise<number> {
  await ensureTables();
  const sql = db();
  const rows = await sql`SELECT count(*)::int AS count FROM orders WHERE status = 'paid'`;
  return (rows[0] as { count: number }).count;
}

export async function setFulfillment(orderId: number, status: string, trackingCarrier: string | null, trackingNumber: string | null) {
  const sql = db();
  await sql`
    UPDATE orders SET status = ${status}, tracking_carrier = ${trackingCarrier}, tracking_number = ${trackingNumber}, updated_at = now()
    WHERE id = ${orderId}
  `;
}

export interface SalesByProduct {
  productSlug: string;
  productName: string;
  unitsSold: number;
  grossCentavos: number;
}

/** Real, order_items-derived — nothing here is estimated or fabricated. */
export async function salesByProduct(): Promise<SalesByProduct[]> {
  await ensureTables();
  const sql = db();
  const rows = await sql`
    SELECT oi.product_slug, oi.product_name,
           SUM(oi.quantity)::int AS units_sold,
           SUM(oi.unit_price_centavos * oi.quantity)::int AS gross_centavos
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.status != 'pending_payment'
    GROUP BY oi.product_slug, oi.product_name
    ORDER BY gross_centavos DESC
  `;
  return (rows as { product_slug: string; product_name: string; units_sold: number; gross_centavos: number }[]).map((r) => ({
    productSlug: r.product_slug,
    productName: r.product_name,
    unitsSold: r.units_sold,
    grossCentavos: r.gross_centavos,
  }));
}

export interface SalesAnalytics {
  grossSalesCentavos: number;
  orderCount: number;
  unitsSold: number;
  averageOrderValueCentavos: number;
}

export async function salesAnalytics(): Promise<SalesAnalytics> {
  await ensureTables();
  const sql = db();
  const rows = await sql`
    SELECT
      COALESCE(SUM(o.total_centavos), 0)::int AS gross_sales_centavos,
      count(DISTINCT o.id)::int AS order_count,
      COALESCE(SUM(oi.quantity), 0)::int AS units_sold
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.status != 'pending_payment'
  `;
  const row = rows[0] as { gross_sales_centavos: number; order_count: number; units_sold: number };
  return {
    grossSalesCentavos: row.gross_sales_centavos,
    orderCount: row.order_count,
    unitsSold: row.units_sold,
    averageOrderValueCentavos: row.order_count > 0 ? Math.round(row.gross_sales_centavos / row.order_count) : 0,
  };
}
