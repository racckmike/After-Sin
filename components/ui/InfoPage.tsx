import type { ReactNode } from "react";

export function InfoPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-16 md:py-24">
      <h1 className="font-display text-4xl md:text-5xl">{title}</h1>
      <div className="prose-info mt-8 flex flex-col gap-5 text-[15px] leading-relaxed text-charcoal [&_h2]:mt-4 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-off-black [&_strong]:text-off-black">
        {children}
      </div>
    </div>
  );
}
