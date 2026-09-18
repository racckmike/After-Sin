import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { editorialEntries, getEditorialEntry } from "@/data/editorial";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";

export function generateStaticParams() {
  return editorialEntries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEditorialEntry(slug);
  if (!entry) return {};
  return {
    title: `${entry.title} — AFTER SIN`,
    description: entry.excerpt,
    openGraph: { title: `${entry.title} — AFTER SIN`, description: entry.excerpt },
  };
}

export default async function EditorialEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEditorialEntry(slug);
  if (!entry) notFound();

  return (
    <div>
      <div className="on-dark relative flex h-[70vh] min-h-[420px] w-full items-end bg-off-black text-bone">
        {entry.heroImage ? (
          <>
            <Image
              src={entry.heroImage.src}
              alt={entry.heroImage.alt}
              fill
              sizes="100vw"
              className="absolute inset-0 h-full w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-off-black/85 via-off-black/10 to-transparent" />
          </>
        ) : (
          <PlaceholderFrame
            label={`${entry.title.toUpperCase()} — PLACEHOLDER`}
            tone="dark"
            className="absolute inset-0 h-full w-full"
          />
        )}
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 pb-12 md:px-8">
          <p className="eyebrow text-soft-grey">{entry.type}</p>
          <h1 className="mt-2 max-w-[24ch] font-display text-4xl md:text-6xl">{entry.title}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-[720px] px-4 py-20">
        <p className="text-lg leading-relaxed text-charcoal">{entry.excerpt}</p>
      </div>
      {!entry.heroImage && (
        <div className="grid grid-cols-1 gap-4 px-4 pb-20 md:grid-cols-2 md:px-8">
          <PlaceholderFrame label="Full story — PLACEHOLDER" ratio="4 / 5" tone="dark" />
          <PlaceholderFrame label="Full story — PLACEHOLDER" ratio="4 / 5" tone="dark" />
        </div>
      )}
    </div>
  );
}
