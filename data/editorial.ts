export type EditorialType = "campaign" | "lookbook" | "story";

export interface EditorialEntry {
  slug: string;
  type: EditorialType;
  title: string;
  excerpt: string;
  /** listing card image — falls back to the placeholder frame when absent */
  thumbnail?: { src: string; alt: string };
  /** detail page hero image — falls back to the placeholder frame when absent */
  heroImage?: { src: string; alt: string };
}

/** PLACEHOLDER entries — proves out the architecture ahead of real content. */
export const editorialEntries: EditorialEntry[] = [
  {
    slug: "drop-001-campaign",
    type: "campaign",
    title: "Drop 001 — Campaign",
    excerpt: "The first look at AFTER SIN DARK, shot in Toronto.",
    thumbnail: {
      src: "/editorial/drop-001-campaign-thumb.jpg",
      alt: "AFTER SIN Drop 001 campaign, Ash and Oxblood full-zip hoodies",
    },
    heroImage: {
      src: "/editorial/drop-001-campaign-hero.jpg",
      alt: "AFTER SIN Drop 001 campaign, Discipline Sweatpants in Black and Bone",
    },
  },
  {
    slug: "dark-lookbook",
    type: "lookbook",
    title: "AFTER SIN DARK — Lookbook",
    excerpt: "Full look breakdown for the first world to ship.",
    thumbnail: {
      src: "/products/drop-001-full-zip-hoodie/oxblood-lookbook.jpg",
      alt: "AFTER SIN Drop 001 full-zip hoodie, Oxblood colorway, lookbook",
    },
  },
  {
    slug: "what-comes-after",
    type: "story",
    title: "What Comes After",
    excerpt: "On consequence, transformation, and building AFTER SIN.",
  },
];

export function getEditorialEntry(slug: string) {
  return editorialEntries.find((e) => e.slug === slug);
}
