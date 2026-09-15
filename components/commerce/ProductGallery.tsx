"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/types";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);

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
            <PlaceholderFrame label="" ratio="4 / 5" tone="dark" />
          </button>
        ))}
      </div>

      <div>
        <PlaceholderFrame
          label={images[active].placeholderLabel}
          ratio="4 / 5"
          tone="dark"
          className="w-full"
        />
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
              <PlaceholderFrame label="" ratio="1 / 1" tone="dark" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
