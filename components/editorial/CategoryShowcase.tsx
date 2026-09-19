import Image from "next/image";
import { EditorialButton } from "@/components/ui/EditorialButton";

/**
 * Reproduces Shihiko's real homepage structure (measured live): after
 * the product section, it repeats a full-bleed category showcase —
 * "CATEGORY [0N]" + a real item count + "View all" over a campaign
 * image — once per garment category. AFTER SIN only has two real
 * products, so this becomes two honest showcases (real counts, real
 * AFTER SIN campaign photography already in the project) instead of
 * Shihiko's four.
 */
export function CategoryShowcase({
  index,
  name,
  itemCount,
  href,
  image,
}: {
  index: number;
  name: string;
  itemCount: number;
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
      <div className="absolute inset-0 bg-gradient-to-b from-off-black/70 via-off-black/10 to-transparent" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-8 md:px-8">
        <p className="font-display text-2xl uppercase tracking-tight md:text-4xl">
          {name}
          <span className="ml-2 text-base align-super text-soft-grey">
            [{String(index).padStart(2, "0")}]
          </span>
        </p>
        <div className="flex items-center gap-5">
          <span className="eyebrow text-soft-grey">
            {`${itemCount} // ${itemCount === 1 ? "ITEM" : "ITEMS"}`}
          </span>
          <EditorialButton href={href} tone="light" className="h-11">
            View All
          </EditorialButton>
        </div>
      </div>
    </section>
  );
}
