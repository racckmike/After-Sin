"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";

function GalleryFrame({
  image,
  ratio,
  className = "",
  zoomOnHover = false,
}: {
  image: ProductImage;
  ratio: string;
  className?: string;
  zoomOnHover?: boolean;
}) {
  if (image.src) {
    return (
      <div className={`group relative overflow-hidden bg-charcoal ${className}`} style={{ aspectRatio: ratio }}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className={`object-cover ${
            zoomOnHover ? "transition-transform duration-700 ease-out group-hover:scale-[1.06]" : ""
          }`}
        />
      </div>
    );
  }
  return <PlaceholderFrame label={image.placeholderLabel} ratio={ratio} tone="dark" className={className} />;
}

/**
 * Matches Shihiko's real product gallery structure (measured directly,
 * not guessed): a square (1:1) main image with prev/next + an "N / total"
 * counter, and a thumbnail strip BELOW it at every breakpoint — no
 * separate desktop vertical rail.
 */
export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const [prevImages, setPrevImages] = useState(images);

  // Reset to the first image when the gallery's image set changes (e.g. a
  // color swap) — adjusting state during render instead of in an effect
  // avoids the extra render pass a setState-in-effect would cause.
  if (images !== prevImages) {
    setPrevImages(images);
    setActive(0);
  }

  const activeImage = images[active] ?? images[0];
  const goTo = (i: number) => setActive((i + images.length) % images.length);

  return (
    <div>
      <div key={activeImage.id} className="group/gallery relative hero-rise" style={{ animationDuration: "0.4s" }}>
        <GalleryFrame image={activeImage} ratio="1 / 1" className="w-full" zoomOnHover />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-bone opacity-100 transition-opacity duration-200 [text-shadow:0_1px_4px_rgba(0,0,0,0.55)] md:opacity-0 md:group-hover/gallery:opacity-100"
            >
              <span aria-hidden className="text-xl leading-none">‹</span>
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-bone opacity-100 transition-opacity duration-200 [text-shadow:0_1px_4px_rgba(0,0,0,0.55)] md:opacity-0 md:group-hover/gallery:opacity-100"
            >
              <span aria-hidden className="text-xl leading-none">›</span>
            </button>
            <span
              className="eyebrow absolute bottom-3 left-3 text-bone [text-shadow:0_1px_4px_rgba(0,0,0,0.55)]"
              aria-hidden
            >
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show image ${i + 1}: ${img.alt}`}
            aria-current={active === i}
            className={`h-16 w-16 shrink-0 border ${
              active === i ? "border-off-black" : "border-off-black/20 opacity-60 hover:opacity-100"
            }`}
          >
            <GalleryFrame image={img} ratio="1 / 1" />
          </button>
        ))}
      </div>
    </div>
  );
}
