import type { Product } from "@/lib/types";

/**
 * Mock commerce data layer. This is the seam where a real backend
 * (Shopify, Shopify Headless, or otherwise) plugs in later — nothing
 * above the /data boundary should need to change when that happens.
 *
 * Only AS-ZH001 reflects real (still-in-development) product intent.
 * The remaining DARK items are clearly-labeled placeholders so the
 * PLP grid and templates can be reviewed before more product is real.
 */
export const products: Product[] = [
  {
    slug: "drop-001-full-zip-hoodie",
    name: "Full-Zip Hoodie",
    world: "dark",
    collectionSlug: "dark",
    price: 189,
    currency: "CAD",
    colors: [{ name: "Washed Black", swatch: "#171717" }],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    soldOutSizes: [],
    status: "coming-soon",
    isNew: true,
    images: [
      { id: "front", alt: "AFTER SIN Drop 001 full-zip hoodie, front", placeholderLabel: "CAMPAIGN IMAGE — FRONT — PLACEHOLDER" },
      { id: "back", alt: "AFTER SIN Drop 001 full-zip hoodie, back", placeholderLabel: "CAMPAIGN IMAGE — BACK — PLACEHOLDER" },
      { id: "detail", alt: "AFTER SIN Drop 001 full-zip hoodie, hardware detail", placeholderLabel: "DETAIL — HARDWARE — PLACEHOLDER" },
      { id: "worn", alt: "AFTER SIN Drop 001 full-zip hoodie, worn", placeholderLabel: "CAMPAIGN IMAGE — WORN — PLACEHOLDER" },
    ],
    summary:
      "AFTER SIN's first hero piece. Premium heavyweight full-zip hoodie, currently in development — specifications below are directional until physical samples are approved.",
    details: [
      "Style AS-ZH001 — Drop 001",
      "Oversized, boxy fit with dropped shoulders",
      "Structured double-layer hood, self fabric, no drawcord",
      "Premium two-way metal zipper with custom pull",
      "Metal AFTER SIN hardware plaque",
      "PLACEHOLDER — final graphic system not yet locked",
    ],
    fit: [
      "Fits oversized — model is 6'0\" / 183cm wearing size M",
      "DIRECTIONAL — full size guide pending physical sample fitting",
    ],
    materials: [
      "PLACEHOLDER — targeting ~480GSM heavyweight cotton fleece",
      "Final composition confirmed after fabric testing, not yet locked",
    ],
    care: ["NOT LOCKED — care instructions confirmed after wash testing"],
  },
  {
    slug: "drop-001-graphic-tee",
    name: "Graphic Tee",
    world: "dark",
    collectionSlug: "dark",
    price: 79,
    currency: "CAD",
    colors: [{ name: "Washed Black", swatch: "#171717" }],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    status: "coming-soon",
    images: [
      { id: "front", alt: "AFTER SIN DARK graphic tee, front", placeholderLabel: "CAMPAIGN IMAGE — PLACEHOLDER" },
      { id: "back", alt: "AFTER SIN DARK graphic tee, back", placeholderLabel: "CAMPAIGN IMAGE — PLACEHOLDER" },
    ],
    summary: "PLACEHOLDER — product not yet in development. Shown to prove out the grid template.",
    details: ["NOT LOCKED"],
    fit: ["NOT LOCKED"],
    materials: ["NOT LOCKED"],
    care: ["NOT LOCKED"],
  },
  {
    slug: "drop-001-sweatpant",
    name: "Heavyweight Sweatpant",
    world: "dark",
    collectionSlug: "dark",
    price: 149,
    currency: "CAD",
    colors: [{ name: "Washed Black", swatch: "#171717" }],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    status: "coming-soon",
    images: [
      { id: "front", alt: "AFTER SIN DARK heavyweight sweatpant, front", placeholderLabel: "CAMPAIGN IMAGE — PLACEHOLDER" },
      { id: "detail", alt: "AFTER SIN DARK heavyweight sweatpant, hem detail", placeholderLabel: "DETAIL — PLACEHOLDER" },
    ],
    summary: "PLACEHOLDER — product not yet in development. Shown to prove out the grid template.",
    details: ["NOT LOCKED"],
    fit: ["NOT LOCKED"],
    materials: ["NOT LOCKED"],
    care: ["NOT LOCKED"],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(collectionSlug: string) {
  return products.filter((p) => p.collectionSlug === collectionSlug);
}
