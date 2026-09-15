"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGallery } from "@/components/commerce/ProductGallery";
import { ProductInfo } from "@/components/commerce/ProductInfo";

export function ProductDisplay({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]?.name ?? "");

  const galleryImages = useMemo(() => {
    const forColor = product.images.filter((img) => !img.color || img.color === color);
    return forColor.length > 0 ? forColor : product.images;
  }, [product.images, color]);

  return (
    <>
      <ProductGallery images={galleryImages} />
      <div className="md:sticky md:top-24 md:self-start">
        <ProductInfo product={product} color={color} onColorChange={setColor} />
      </div>
    </>
  );
}
