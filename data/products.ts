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
    colors: [
      { name: "Ash", swatch: "#9a9a96" },
      { name: "Oxblood", swatch: "#5c2430" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    soldOutSizes: [],
    status: "coming-soon",
    isNew: true,
    images: [
      {
        id: "ash-front",
        alt: "AFTER SIN Drop 001 full-zip hoodie, Ash colorway, front",
        placeholderLabel: "CAMPAIGN IMAGE — FRONT — PLACEHOLDER",
        src: "/products/drop-001-full-zip-hoodie/ash-front.jpg",
        color: "Ash",
      },
      {
        id: "ash-back",
        alt: "AFTER SIN Drop 001 full-zip hoodie, Ash colorway, back",
        placeholderLabel: "CAMPAIGN IMAGE — BACK — PLACEHOLDER",
        src: "/products/drop-001-full-zip-hoodie/ash-back.jpg",
        color: "Ash",
      },
      {
        id: "ash-detail",
        alt: "AFTER SIN Drop 001 full-zip hoodie, Ash colorway, zipper and hardware detail",
        placeholderLabel: "DETAIL — HARDWARE — PLACEHOLDER",
        src: "/products/drop-001-full-zip-hoodie/ash-detail.jpg",
        color: "Ash",
      },
      {
        id: "oxblood-front",
        alt: "AFTER SIN Drop 001 full-zip hoodie, Oxblood colorway, front",
        placeholderLabel: "CAMPAIGN IMAGE — FRONT — PLACEHOLDER",
        src: "/products/drop-001-full-zip-hoodie/oxblood-front.jpg",
        color: "Oxblood",
      },
      {
        id: "oxblood-detail",
        alt: "AFTER SIN Drop 001 full-zip hoodie, Oxblood colorway, thorn print detail",
        placeholderLabel: "DETAIL — GRAPHIC — PLACEHOLDER",
        src: "/products/drop-001-full-zip-hoodie/oxblood-detail.jpg",
        color: "Oxblood",
      },
      {
        id: "oxblood-portrait",
        alt: "AFTER SIN Drop 001 full-zip hoodie, Oxblood colorway, hood portrait",
        placeholderLabel: "CAMPAIGN IMAGE — WORN — PLACEHOLDER",
        src: "/products/drop-001-full-zip-hoodie/oxblood-portrait.jpg",
        color: "Oxblood",
      },
    ],
    summary:
      "AFTER SIN's first hero piece — DROP 001: CONSEQUENCE. Premium heavyweight full-zip hoodie in two colorways. Pricing, materials, and care below are directional until physical samples are approved.",
    details: [
      "Style AS-ZH001 — Drop 001: Consequence",
      "Oversized, boxy fit with dropped shoulders",
      "Structured double-layer hood, self fabric, no drawcord",
      "Premium two-way metal zipper with custom AFTER SIN cross pull",
      "Metal AFTER SIN hardware plaque",
      "Thorn-lettered gothic graphic system, front chest and back — Ash or Oxblood print on washed black",
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
    slug: "drop-001-discipline-sweatpants",
    name: "Discipline Sweatpants",
    world: "dark",
    collectionSlug: "dark",
    price: 149,
    currency: "CAD",
    colors: [
      { name: "Black", swatch: "#171717" },
      { name: "Bone", swatch: "#e4ddd0" },
      { name: "Ash", swatch: "#9a9a96" },
      { name: "Slate", swatch: "#4d5766" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    soldOutSizes: [],
    status: "coming-soon",
    isNew: true,
    images: [
      {
        id: "black-front",
        alt: "AFTER SIN Drop 001 Discipline Sweatpants, Black colorway, front",
        placeholderLabel: "CAMPAIGN IMAGE — FRONT — PLACEHOLDER",
        src: "/products/drop-001-discipline-sweatpants/black-front.jpg",
        color: "Black",
      },
      {
        id: "bone-front",
        alt: "AFTER SIN Drop 001 Discipline Sweatpants, Bone colorway, front",
        placeholderLabel: "CAMPAIGN IMAGE — FRONT — PLACEHOLDER",
        src: "/products/drop-001-discipline-sweatpants/bone-front.jpg",
        color: "Bone",
      },
      {
        id: "bone-detail",
        alt: "AFTER SIN Drop 001 Discipline Sweatpants, Bone colorway, drawstring and embroidered cross detail",
        placeholderLabel: "DETAIL — WAISTBAND — PLACEHOLDER",
        src: "/products/drop-001-discipline-sweatpants/bone-detail.jpg",
        color: "Bone",
      },
      {
        id: "ash-front",
        alt: "AFTER SIN Drop 001 Discipline Sweatpants, Ash colorway, front",
        placeholderLabel: "CAMPAIGN IMAGE — FRONT — PLACEHOLDER",
        src: "/products/drop-001-discipline-sweatpants/ash-front.jpg",
        color: "Ash",
      },
      {
        id: "slate-campaign",
        alt: "AFTER SIN Drop 001 Discipline Sweatpants, Slate colorway, campaign",
        placeholderLabel: "CAMPAIGN IMAGE — PLACEHOLDER",
        src: "/products/drop-001-discipline-sweatpants/slate-campaign.jpg",
        color: "Slate",
      },
    ],
    summary:
      "Drop 001: Consequence. Heavyweight relaxed sweatpants with an embroidered signature cross at the thigh, in four colorways. Pricing, materials, and care below are directional until physical samples are approved.",
    details: [
      "Style AS-SP001 — Drop 001: Consequence",
      "Relaxed, oversized fit through the leg",
      "Elastic waistband with flat drawstring, metal aglets",
      "Embroidered AFTER SIN signature cross at left thigh",
      "Side seam pockets",
    ],
    fit: [
      "Fits relaxed — model is 6'0\" / 183cm wearing size M",
      "DIRECTIONAL — full size guide pending physical sample fitting",
    ],
    materials: [
      "PLACEHOLDER — targeting ~420GSM heavyweight cotton fleece",
      "Final composition confirmed after fabric testing, not yet locked",
    ],
    care: ["NOT LOCKED — care instructions confirmed after wash testing"],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(collectionSlug: string) {
  return products.filter((p) => p.collectionSlug === collectionSlug);
}
