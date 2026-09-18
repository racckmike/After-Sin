import { getProduct } from "@/data/products";
import type { Product } from "@/lib/types";

/**
 * Everything here runs server-side only. The browser sends intent
 * (slug/color/size/quantity) — never a price — and this module is the
 * only place authoritative money numbers come from, matching data/
 * products.ts (via getProduct) as the single product catalog.
 *
 * Money is handled in integer MXN centavos throughout the checkout/order
 * system to avoid floating-point drift; data/products.ts's `priceMXN` is
 * a plain decimal (existing convention, shared with on-site display), so
 * it's converted to centavos right at this boundary and never touched
 * again as a float.
 */

export const CHECKOUT_CURRENCY = "MXN" as const;

/** Flat-rate placeholder — see PLACEHOLDER SHIPPING RATES in the report. Configurable, not invented as a "final" number. */
const MEXICO_FLAT_SHIPPING_CENTAVOS = 9900;

export interface CartItemInput {
  slug: string;
  color: string;
  size: string;
  quantity: number;
}

export interface PricedItem {
  product: Product;
  color: string;
  size: string;
  quantity: number;
  unitPriceCentavos: number;
  lineTotalCentavos: number;
  imageUrl: string | null;
}

export interface PricingError {
  error: string;
}

function toCentavos(mxn: number): number {
  return Math.round(mxn * 100);
}

/**
 * Resolves one cart line against the real catalog: product must exist,
 * be purchasable (in-stock or low-stock — not sold-out/coming-soon), have
 * a locked MXN price, and the requested color/size must be real
 * combinations on that product. Returns the error as data (not a thrown
 * exception) so the route can report exactly which line failed.
 */
export function priceCartItem(input: CartItemInput): PricedItem | PricingError {
  const quantity = Math.trunc(input.quantity);
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 10) {
    return { error: "Invalid quantity." };
  }

  const product = getProduct(input.slug);
  if (!product) return { error: "Product not found." };

  if (product.status !== "in-stock" && product.status !== "low-stock") {
    return { error: `${product.name} isn't available for purchase.` };
  }

  if (product.priceMXN == null) {
    return { error: `${product.name} doesn't have a price set yet.` };
  }

  const color = product.colors.find((c) => c.name === input.color);
  if (!color) return { error: `Invalid color for ${product.name}.` };

  if (!product.sizes.includes(input.size)) {
    return { error: `Invalid size for ${product.name}.` };
  }
  if (product.soldOutSizes?.includes(input.size)) {
    return { error: `${product.name} (${input.size}) is sold out.` };
  }

  const unitPriceCentavos = toCentavos(product.priceMXN);
  const image = product.images.find((img) => img.color === color.name) ?? product.images[0];

  return {
    product,
    color: color.name,
    size: input.size,
    quantity,
    unitPriceCentavos,
    lineTotalCentavos: unitPriceCentavos * quantity,
    imageUrl: image?.src ?? null,
  };
}

export function shippingCentavos(country: "MX"): number {
  return country === "MX" ? MEXICO_FLAT_SHIPPING_CENTAVOS : 0;
}

export function formatCentavosMXN(centavos: number): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(centavos / 100);
}
