"use client";

import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/lib/types";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { useTransitionLinkProps } from "@/context/PageTransitionContext";

export function CollectionGateway({ collection }: { collection: Collection }) {
  const href = `/collections/${collection.slug}`;
  const transitionProps = useTransitionLinkProps(href);
  return (
    <Link
      href={href}
      data-collection={collection.slug}
      className="group relative flex flex-col overflow-hidden"
      {...transitionProps}
    >
      <div className="on-dark relative overflow-hidden bg-charcoal" style={{ aspectRatio: "3 / 4" }}>
        {collection.image ? (
          <Image
            src={collection.image.src}
            alt={collection.image.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <PlaceholderFrame
            label={`${collection.name} — CAMPAIGN — PLACEHOLDER`}
            ratio="3 / 4"
            tone="dark"
            className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-off-black/90 via-off-black/10 to-transparent transition-opacity duration-500 group-hover:from-off-black/95" />
        {collection.status === "coming-soon" && (
          <span className="eyebrow absolute right-4 top-4 text-bone/80">Coming Soon</span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span
            className="block h-[2px] w-8 scale-x-0 bg-[var(--accent-on-dark)] transition-transform duration-500 ease-out group-hover:scale-x-100"
            aria-hidden
          />
          <p className="mt-3 font-display text-2xl text-bone md:text-3xl">{collection.name}</p>
          <p className="eyebrow mt-1.5 text-[var(--accent-on-dark)] transition-opacity duration-300 group-hover:opacity-100 md:opacity-80">
            {collection.tagline}
          </p>
        </div>
      </div>
    </Link>
  );
}
