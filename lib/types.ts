/**
 * Shared commerce types. Deliberately backend-agnostic — nothing here
 * assumes Shopify, Shopify Headless, or any specific platform. Swap
 * `data/*` for a real fetch layer later without touching components.
 */

export type StockStatus = "in-stock" | "low-stock" | "sold-out" | "coming-soon";

export type World = "core" | "dark" | "racing";

export interface ProductColor {
  name: string;
  /** swatch value — a hex is fine for a placeholder swatch, not a brand lock */
  swatch: string;
}

export interface ProductImage {
  id: string;
  alt: string;
  /** label shown on the placeholder frame until real photography exists */
  placeholderLabel: string;
}

export interface Product {
  slug: string;
  name: string;
  world: World;
  collectionSlug: string;
  /** PLACEHOLDER — directional price, not a locked retail figure */
  price: number;
  currency: "CAD";
  colors: ProductColor[];
  sizes: string[];
  soldOutSizes?: string[];
  status: StockStatus;
  images: ProductImage[];
  summary: string;
  details: string[];
  fit: string[];
  materials: string[];
  care: string[];
  isNew?: boolean;
}

export interface Collection {
  slug: string;
  world: World;
  name: string;
  tagline: string;
  description: string;
  status: "live" | "coming-soon";
}
