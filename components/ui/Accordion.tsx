"use client";

import { useState, type ReactNode } from "react";
import { SignatureMark } from "@/components/ui/SignatureMark";

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
              <span
                className={`transition-transform duration-300 ${expanded ? "rotate-45" : ""}`}
              >
                <SignatureMark size={11} className="opacity-70" />
              </span>
            </button>
            <div
              className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ${
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
