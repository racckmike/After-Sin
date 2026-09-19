"use client";

import { useState, type ReactNode } from "react";

/** Matches Shihiko's measured accordion timing exactly: 700ms,
    cubic-bezier(0.4, 0, 0.2, 1) — Material's standard easing curve,
    not a proprietary asset. Its indicator is a plain +/− glyph, not a
    branded icon, so that's what this uses too. */
export function Accordion({ items }: { items: { title: string; content: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="border-t hairline">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <div key={item.title} className="border-b hairline">
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : i)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="eyebrow">{item.title}</span>
              <span aria-hidden className="w-3 text-center text-base leading-none">
                {expanded ? "−" : "+"}
              </span>
            </button>
            <div
              className={`grid overflow-hidden transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              {/* padding lives on this inner div, not the min-h-0/overflow-hidden
                  row above — padding is always part of a box's own min size, so
                  putting it directly on the collapsing element left a permanent
                  ~16px sliver (and a clipped first line of the answer) even when
                  "closed" */}
              <div className="min-h-0 overflow-hidden">
                <div className="pb-4 text-sm text-charcoal">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
