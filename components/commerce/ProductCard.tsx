"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Product, ProductImage } from "@/lib/types";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { StatusBadge } from "@/components/commerce/StatusBadge";
import { useRegion } from "@/context/RegionContext";
import { getProductPrice } from "@/lib/format";

function CardFrame({ image, className = "" }: { image: ProductImage; className?: string }) {
  if (image.src) {
    return (
      <div className={`aspect-[4/5] overflow-hidden bg-soft-grey/30 ${className}`}>
        <div className="relative h-full w-full">
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
        </div>
      </div>
    );
  }
  return <PlaceholderFrame label={image.placeholderLabel} ratio="4 / 5" className={className} />;
}

export function ProductCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false);
  const { region } = useRegion();
  const secondaryImage = product.images[1] ?? product.images[0];
  // a locked MXN price already says the number; only skip the badge when the
  // price line itself is standing in for "coming soon"
  const priceIsLocked = region.currency === "MXN" && product.priceMXN != null;
  const showBadge = product.status !== "in-stock" && !(product.status === "coming-soon" && priceIsLocked);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative overflow-hidden">
        <CardFrame
          image={product.images[0]}
          className={`transition-opacity duration-300 ${hover ? "opacity-0" : "opacity-100"}`}
        />
        <CardFrame
          image={secondaryImage}
          className={`absolute inset-0 transition-opacity duration-300 ${
            hover ? "opacity-100" : "opacity-0"
          }`}
        />
        {product.isNew && (
          <span className="eyebrow absolute left-3 top-3 bg-bone px-2 py-1">New</span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[15px] leading-tight">{product.name}</p>
          <p className="mt-0.5 text-xs text-charcoal">
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
