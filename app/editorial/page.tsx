import type { Metadata } from "next";
import Link from "next/link";
import { editorialEntries } from "@/data/editorial";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";

export const metadata: Metadata = { title: "Editorial — AFTER SIN" };

export default function EditorialIndex() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8 md:py-16">
      <h1 className="font-display text-4xl md:text-5xl">Editorial</h1>
      <p className="mt-3 max-w-[52ch] text-[15px] text-charcoal">
        Campaigns, lookbooks and stories — fashion content that lives outside the
        shop.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {editorialEntries.map((entry) => (
          <Link key={entry.slug} href={`/editorial/${entry.slug}`} className="group flex flex-col">
            <PlaceholderFrame
              label={`${entry.title.toUpperCase()} — PLACEHOLDER`}
              ratio="4 / 5"
              tone="dark"
            />
            <p className="eyebrow mt-4 text-charcoal">{entry.type}</p>
            <p className="mt-1 font-display text-xl">{entry.title}</p>
            <p className="mt-1 text-sm text-charcoal">{entry.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
