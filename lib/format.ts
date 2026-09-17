import type { StockStatus } from "@/lib/types";

/**
 * All product prices are stored in CAD (see Product.price). This is a
 * static, directional rate — not a live feed — consistent with pricing
 * elsewhere in the app being marked PLACEHOLDER/NOT LOCKED. Swap for a
 * real FX source when MXN pricing is locked (or once every product has
 * a real priceMXN and this fallback is no longer needed).
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
 * - a real, locked priceMXN always wins when viewing in MXN, even if the
 *   product's overall status is still "coming soon" — the price and the
 *   availability are separate facts.
 * - otherwise, no price is locked until the product is actually
 *   available, so "coming soon" shows the status word instead of a
 *   CAD-converted number that reads as a real price.
 */
export function getProductPrice(
  product: { price: number; priceMXN?: number; status: StockStatus },
  currency: "CAD" | "MXN"
) {
  if (currency === "MXN" && product.priceMXN != null) {
    return formatAmount(product.priceMXN, "MXN");
  }
  if (product.status === "coming-soon") return "Coming Soon";
  return formatPrice(product.price, currency);
}
