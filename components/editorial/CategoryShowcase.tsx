import Image from "next/image";
import { EditorialButton } from "@/components/ui/EditorialButton";

/**
 * Reproduces Shihiko's real homepage structure (measured live): after
 * the product section, it repeats a full-bleed showcase — "NAME [0N]"
 * + a short meta line + "View all" over a campaign image — four times.
 * Shihiko's four are garment categories with item counts; AFTER SIN's
 * real catalog only supports two of those honestly (Hoodies,
 * Sweatpants), so the remaining two reuse real AFTER SIN campaign
 * photography with a truthful editorial/world label instead of a
 * fabricated category + item count.
 */
export function CategoryShowcase({
  index,
  name,
  meta,
  href,
  image,
}: {
  index: number;
  name: string;
  /** Short line next to the CTA — a real item count ("1 // ITEM") for
      an actual category, or an honest editorial tagline where there's
      no category to count. */
  meta: string;
  href: string;
  image: { src: string; alt: string };
}) {
  return (
    <section className="on-dark relative flex h-[100vh] min-h-[640px] w-full items-start overflow-hidden bg-off-black text-bone md:h-[130vh]">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-off-black/85 via-off-black/25 to-transparent" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-8 md:px-8 [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
        <p className="font-display text-2xl uppercase tracking-tight md:text-4xl">
          {name}
          <span className="ml-2 text-base align-super text-soft-grey">
            [{String(index).padStart(2, "0")}]
          </span>
        </p>
        <div className="flex items-center gap-5">
          <span className="eyebrow text-soft-grey">{meta}</span>
          <EditorialButton href={href} tone="light" className="h-11">
            View All
          </EditorialButton>
        </div>
      </div>
    </section>
  );
}
