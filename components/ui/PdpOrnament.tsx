/**
 * Thin monochrome line-art marks that bleed past the product page's own
 * edges — an AFTER SIN original (a cross fragment and a compass ring,
 * developed from the existing signature-cross identity, not any
 * reference brand's artwork/assets). Colored via `--accent`, so it
 * re-tints per world automatically wherever `[data-collection]` scopes
 * it. Decorative only: aria-hidden, pointer-events-none, never placed
 * where it could compete with product photography or type.
 */
function CrossMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" aria-hidden className={className}>
      <line x1="80" y1="8" x2="80" y2="152" stroke="currentColor" strokeWidth="1" />
      <line x1="16" y1="80" x2="144" y2="80" stroke="currentColor" strokeWidth="1" />
      <circle cx="80" cy="80" r="7" stroke="currentColor" strokeWidth="1" />
      <circle cx="80" cy="8" r="2" fill="currentColor" />
      <circle cx="80" cy="152" r="2" fill="currentColor" />
      <circle cx="16" cy="80" r="2" fill="currentColor" />
      <circle cx="144" cy="80" r="2" fill="currentColor" />
    </svg>
  );
}

function RingMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" aria-hidden className={className}>
      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="80" cy="80" r="44" stroke="currentColor" strokeWidth="0.75" />
      <line x1="80" y1="2" x2="80" y2="18" stroke="currentColor" strokeWidth="1" />
      <line x1="80" y1="142" x2="80" y2="158" stroke="currentColor" strokeWidth="1" />
      <line x1="2" y1="80" x2="18" y2="80" stroke="currentColor" strokeWidth="1" />
      <line x1="142" y1="80" x2="158" y2="80" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function PdpOrnament({ mark, className = "" }: { mark: "cross" | "ring"; className?: string }) {
  const Mark = mark === "cross" ? CrossMark : RingMark;
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute text-[var(--accent)] opacity-[0.16] ${className}`}
    >
      <Mark className="h-full w-full" />
    </div>
  );
}
