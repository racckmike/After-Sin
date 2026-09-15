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
  /** path under /public — when present, real photography renders instead of the placeholder frame */
  src?: string;
  /** ties this image to one ProductColor's name, for galleries that filter by selected color */
  color?: string;
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
  /** campaign image for the Shop by World gateway tile — falls back to the placeholder frame when absent */
  image?: { src: string; alt: string };
}
