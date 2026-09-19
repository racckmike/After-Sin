"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Product, ProductImage } from "@/lib/types";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { StatusBadge } from "@/components/commerce/StatusBadge";
import { useRegion } from "@/context/RegionContext";
import { getProductPrice } from "@/lib/format";
import { useTransitionLinkProps } from "@/context/PageTransitionContext";

function CardFrame({
  image,
  className = "",
  sizes,
}: {
  image: ProductImage;
  className?: string;
  sizes: string;
}) {
  if (image.src) {
    return (
      <div className={`aspect-[3/4] overflow-hidden bg-soft-grey/30 ${className}`}>
        <div className="relative h-full w-full">
          <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" />
        </div>
      </div>
    );
  }
  return <PlaceholderFrame label={image.placeholderLabel} ratio="3 / 4" className={className} />;
}

export function ProductCard({
  product,
  imageSizes = "(min-width: 768px) 33vw, 50vw",
}: {
  product: Product;
  /** Match this to the grid this card actually renders in — the default
      assumes a 2/3/4-col catalog grid; a wider (e.g. 2-col) homepage
      showcase should pass a wider hint so Next.js doesn't fetch an
      undersized image for a larger slot. */
  imageSizes?: string;
}) {
  const [hover, setHover] = useState(false);
  const { region } = useRegion();
  const secondaryImage = product.images[1] ?? product.images[0];
  // a locked MXN price shows a real number in both currencies (CAD via
  // conversion); skip the badge whenever the price line itself is
  // already standing in for the same status word (unlocked "coming
  // soon" renders "Coming Soon" as the price — a badge under it would
  // just repeat that)
  const priceIsLocked = product.priceMXN != null;
  const showBadge =
    product.status === "low-stock" ||
    product.status === "sold-out" ||
    (product.status === "coming-soon" && priceIsLocked);
  const href = `/product/${product.slug}`;
  // Light tone: the PDP itself lands on a bone background, so the
  // reveal reads as "the garment's own page rising into place" rather
  // than a dark interruption — distinct from the dark tone used for
  // editorial CTAs over photography.
  const transitionProps = useTransitionLinkProps(href, "light");

  return (
    <Link
      href={href}
      className="group flex flex-col"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...transitionProps}
    >
      {/* No hover zoom — verified against Shihiko's real product cards
          (no scale rule anywhere in their stylesheet for this
          element); only the secondary-image crossfade is real, at
          their measured 0.3s. */}
      <div className="relative overflow-hidden">
        <CardFrame
          image={product.images[0]}
          sizes={imageSizes}
          className={`transition-opacity duration-300 ${hover ? "opacity-0" : "opacity-100"}`}
        />
        <CardFrame
          image={secondaryImage}
          sizes={imageSizes}
          className={`absolute inset-0 transition-opacity duration-300 ${
            hover ? "opacity-100" : "opacity-0"
          }`}
        />
        {product.isNew && (
          <span className="eyebrow absolute left-3 top-3 bg-bone px-2 py-1">New</span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-base leading-tight transition-opacity group-hover:opacity-70">
            {product.name}
          </p>
          <p className="mt-1 text-xs text-charcoal">
            {product.colors.map((c) => c.name).join(" / ")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-sm">{getProductPrice(product, region.currency)}</span>
          {showBadge && <StatusBadge status={product.status} />}
        </div>
      </div>
    </Link>
  );
}
