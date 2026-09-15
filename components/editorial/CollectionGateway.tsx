import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/lib/types";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";

export function CollectionGateway({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative flex flex-col overflow-hidden"
    >
      {collection.image ? (
        <div
          className="relative overflow-hidden bg-charcoal transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          style={{ aspectRatio: "3 / 4" }}
        >
          <Image
            src={collection.image.src}
            alt={collection.image.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <PlaceholderFrame
          label={`${collection.name} — CAMPAIGN — PLACEHOLDER`}
          ratio="3 / 4"
          tone="dark"
          className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      )}
      <div className="mt-4 flex items-baseline justify-between border-t hairline pt-3">
        <div>
          <p className="font-display text-xl">{collection.name}</p>
          <p className="eyebrow mt-1 text-charcoal">{collection.tagline}</p>
        </div>
        {collection.status === "coming-soon" && (
          <span className="eyebrow text-charcoal">Coming Soon</span>
        )}
      </div>
    </Link>
  );
}
