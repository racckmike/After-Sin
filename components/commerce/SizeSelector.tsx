"use client";

interface Props {
  sizes: string[];
  soldOutSizes?: string[];
  selected: string | null;
  onSelect: (size: string) => void;
}

export function SizeSelector({ sizes, soldOutSizes = [], selected, onSelect }: Props) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="eyebrow">Size</span>
        <button type="button" className="eyebrow underline underline-offset-4 text-charcoal">
          Size Guide
        </button>
      </div>
      <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-label="Size">
        {sizes.map((size) => {
          const soldOut = soldOutSizes.includes(size);
          const isSelected = selected === size;
          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={soldOut}
              onClick={() => onSelect(size)}
              className={`relative flex h-11 items-center justify-center border text-sm transition-colors ${
                isSelected
                  ? "border-off-black bg-off-black text-bone"
                  : soldOut
                    ? "border-soft-grey/60 text-soft-grey"
                    : "border-off-black/70 hover:bg-off-black hover:text-bone"
              }`}
            >
              {size}
              {soldOut && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 flex items-center"
                >
                  <span className="h-px w-full rotate-[-18deg] bg-soft-grey" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
