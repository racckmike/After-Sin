/**
 * Honest stand-in for campaign/product photography that doesn't exist
 * yet. Renders a labeled textured frame instead of fabricating a fake
 * photo — swap for <Image> once real photography is shot.
 */
export function PlaceholderFrame({
  label,
  className = "",
  tone = "light",
  ratio,
}: {
  label: string;
  className?: string;
  tone?: "light" | "dark";
  ratio?: string;
}) {
  return (
    <div
      className={`placeholder-frame ${
        tone === "dark" ? "bg-charcoal text-bone" : "bg-soft-grey/30 text-off-black"
      } ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      data-label={label}
      role="img"
      aria-label={label}
    />
  );
}
