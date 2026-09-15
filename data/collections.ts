import type { Collection } from "@/lib/types";

/**
 * "Worlds" are the architecture placeholders described in the brief —
 * NOT necessarily final customer-facing category names. Only DARK has
 * a product in development; CORE and RACING exist so the navigation
 * and template system are proven out ahead of real product.
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
  },
  {
    slug: "core",
    world: "core",
    name: "AFTER SIN CORE",
    tagline: "Essentials",
    description:
      "Clean, studio-focused basics built on the same fit and construction standard as every other world.",
    status: "coming-soon",
  },
  {
    slug: "racing",
    world: "racing",
    name: "AFTER SIN RACING",
    tagline: "Technical",
    description:
      "Motorsport-informed technical pieces. Structure first, graphics second.",
    status: "coming-soon",
  },
];

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}
