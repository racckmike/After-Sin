export type EditorialType = "campaign" | "lookbook" | "story";

export interface EditorialEntry {
  slug: string;
  type: EditorialType;
  title: string;
  excerpt: string;
}

/** PLACEHOLDER entries — proves out the architecture ahead of real content. */
export const editorialEntries: EditorialEntry[] = [
  {
    slug: "drop-001-campaign",
    type: "campaign",
    title: "Drop 001 — Campaign",
    excerpt: "The first look at AFTER SIN DARK, shot in Toronto.",
  },
  {
    slug: "dark-lookbook",
    type: "lookbook",
    title: "AFTER SIN DARK — Lookbook",
    excerpt: "Full look breakdown for the first world to ship.",
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
