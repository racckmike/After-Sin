import type { StockStatus } from "@/lib/types";

/**
 * Directional, static rate — not a live feed. Used two ways: (1) to
 * convert the CAD placeholder price for products with no real price
 * locked yet, and (2) to derive a CAD figure from a product's real,
 * locked priceMXN once that exists (MXN is the anchor in that case,
 * converted back to CAD — see getProductPrice).
 */
const CAD_EXCHANGE_RATES: Record<"CAD" | "MXN", number> = {
  CAD: 1,
  MXN: 13.5,
};

function formatAmount(amount: number, currency: "CAD" | "MXN") {
  return new Intl.NumberFormat(currency === "MXN" ? "es-MX" : "en-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/** `amountCAD` is always the CAD source amount; it's converted to `currency` before formatting. */
export function formatPrice(amountCAD: number, currency: "CAD" | "MXN" = "CAD") {
  return formatAmount(amountCAD * CAD_EXCHANGE_RATES[currency], currency);
}

/**
 * The price to display for a product in the given currency:
 * - once a real priceMXN is locked, it's the anchor for both
 *   currencies — shown as-is in MXN, and converted to CAD via the
 *   directional rate — even if the product's overall status is still
 *   "coming soon" (price and availability are separate facts).
 * - otherwise, no price is locked yet, so "coming soon" shows the
 *   status word instead of the CAD placeholder formatted as if it
 *   were a real number.
 */
export function getProductPrice(
  product: { price: number; priceMXN?: number; status: StockStatus },
  currency: "CAD" | "MXN"
) {
  if (product.priceMXN != null) {
    if (currency === "MXN") return formatAmount(product.priceMXN, "MXN");
    return formatAmount(product.priceMXN / CAD_EXCHANGE_RATES.MXN, "CAD");
  }
  if (product.status === "coming-soon") return "Coming Soon";
  return formatPrice(product.price, currency);
}
