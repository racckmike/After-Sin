import type { Collection } from "@/lib/types";

/**
 * "Worlds" are the architecture placeholders described in the brief —
 * NOT necessarily final customer-facing category names. Only DARK has
 * a product in development; CORE exists so the navigation and template
 * system are proven out ahead of real product. RACING is pulled for
 * now — no real product or photography for it yet.
 */
export const collections: Collection[] = [
  {
    slug: "dark",
    world: "dark",
    name: "AFTER SIN DARK",
    tagline: "Drop 001 — Consequence",
    description:
      "Washed black, antique hardware, gothic-influenced graphic language. The first world to ship.",
    status: "live",
    image: {
      src: "/products/drop-001-full-zip-hoodie/oxblood-campaign-2.jpg",
      alt: "AFTER SIN Drop 001 full-zip hoodie, Oxblood colorway, campaign",
    },
  },
  {
    slug: "core",
    world: "core",
    name: "AFTER SIN CORE",
    tagline: "Essentials",
    description:
      "Clean, studio-focused basics built on the same fit and construction standard as every other world.",
    status: "coming-soon",
    image: {
      src: "/products/drop-001-discipline-sweatpants/bone-campaign.jpg",
      alt: "AFTER SIN Drop 001 Discipline Sweatpants, Bone colorway, campaign",
    },
  },
];

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}
