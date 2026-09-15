"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";

function GalleryFrame({ image, ratio, className = "" }: { image: ProductImage; ratio: string; className?: string }) {
  if (image.src) {
    return (
      <div className={`relative overflow-hidden bg-charcoal ${className}`} style={{ aspectRatio: ratio }}>
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
      </div>
    );
  }
  return <PlaceholderFrame label={image.placeholderLabel} ratio={ratio} tone="dark" className={className} />;
}

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [images]);

  const activeImage = images[active] ?? images[0];

  return (
    <div className="md:grid md:grid-cols-[72px_1fr] md:gap-4">
      <div className="hidden flex-col gap-3 md:flex">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show image ${i + 1}: ${img.alt}`}
            aria-current={active === i}
            className={`border transition-opacity ${
              active === i ? "border-off-black" : "border-off-black/20 opacity-60 hover:opacity-100"
            }`}
          >
            <GalleryFrame image={img} ratio="4 / 5" />
          </button>
        ))}
      </div>

      <div>
        <GalleryFrame image={activeImage} ratio="4 / 5" className="w-full" />
        <div className="mt-3 flex gap-2 overflow-x-auto md:hidden">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}: ${img.alt}`}
              aria-current={active === i}
              className={`h-16 w-16 shrink-0 border ${
                active === i ? "border-off-black" : "border-off-black/20"
              }`}
            >
              <GalleryFrame image={img} ratio="1 / 1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
