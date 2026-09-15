"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { StatusBadge } from "@/components/commerce/StatusBadge";
import { useRegion } from "@/context/RegionContext";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false);
  const { region } = useRegion();
  const secondaryImage = product.images[1] ?? product.images[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative overflow-hidden">
        <PlaceholderFrame
          label={product.images[0].placeholderLabel}
          ratio="4 / 5"
          className={`transition-opacity duration-300 ${hover ? "opacity-0" : "opacity-100"}`}
        />
        <PlaceholderFrame
          label={secondaryImage.placeholderLabel}
          ratio="4 / 5"
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
          <span className="text-sm">{formatPrice(product.price, region.currency)}</span>
          <StatusBadge status={product.status} />
        </div>
      </div>
    </Link>
  );
}
