/**
 * All product prices are stored in CAD (see Product.price). This is a
 * static, directional rate — not a live feed — consistent with pricing
 * elsewhere in the app being marked PLACEHOLDER/NOT LOCKED. Swap for a
 * real FX source when MXN pricing is locked.
 */
const CAD_EXCHANGE_RATES: Record<"CAD" | "MXN", number> = {
  CAD: 1,
  MXN: 13.5,
};

/** `amountCAD` is always the CAD source amount; it's converted to `currency` before formatting. */
export function formatPrice(amountCAD: number, currency: "CAD" | "MXN" = "CAD") {
  const converted = amountCAD * CAD_EXCHANGE_RATES[currency];
  return new Intl.NumberFormat(currency === "MXN" ? "es-MX" : "en-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: converted % 1 === 0 ? 0 : 2,
  }).format(converted);
}

/**
 * No price is locked until a product is actually available — showing a
 * number next to a "coming soon" item reads as a real price. Swap it for
 * the status word instead; everything else still formats normally.
 */
export function priceOrStatus(
  amountCAD: number,
  currency: "CAD" | "MXN",
  status: "in-stock" | "low-stock" | "sold-out" | "coming-soon"
) {
  if (status === "coming-soon") return "Coming Soon";
  return formatPrice(amountCAD, currency);
}
