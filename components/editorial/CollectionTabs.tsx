"use client";

import Link from "next/link";
import type { Collection } from "@/lib/types";
import { useTransitionLinkProps } from "@/context/PageTransitionContext";

function CollectionTab({ collection, active }: { collection: Collection; active: boolean }) {
  const transitionProps = useTransitionLinkProps(`/collections/${collection.slug}`, "light");
  return (
    <Link
      href={`/collections/${collection.slug}`}
      aria-current={active}
      className={`eyebrow transition-opacity hover:opacity-60 ${
        active ? "text-off-black" : "text-charcoal opacity-70"
      }`}
      {...transitionProps}
    >
      {collection.name}
    </Link>
  );
}

/**
 * Sticks directly under the header so switching worlds mid-browse never
 * requires a trip back through the nav — mirrors Shihiko's collection
 * tab row (verified live: it stays pinned under the header while the
 * campaign banner scrolls up behind it).
 */
export function CollectionTabs({ collections, activeSlug }: { collections: Collection[]; activeSlug: string }) {
  return (
    <nav
      aria-label="Switch world"
      className="sticky top-[74px] z-30 flex justify-center gap-8 border-b hairline bg-bone/95 px-4 py-3 backdrop-blur-md md:gap-10 md:px-8"
    >
      {collections.map((c) => (
        <CollectionTab key={c.slug} collection={c} active={c.slug === activeSlug} />
      ))}
    </nav>
  );
}
