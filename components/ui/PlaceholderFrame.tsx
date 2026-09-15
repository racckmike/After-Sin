import { SignatureMark } from "@/components/ui/SignatureMark";

/**
 * Honest stand-in for campaign/product photography that doesn't exist
 * yet. Renders a designed "coming soon" moment (signature mark + label)
 * instead of fabricating a fake photo — swap for <Image> once real
 * photography is shot.
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
  const markTone = tone === "dark" ? "dark" : "light";
  const caption = label.replace(/\s*—\s*PLACEHOLDER$/i, "").trim();

  return (
    <div
      className={`placeholder-frame flex items-center justify-center ${
        tone === "dark" ? "bg-charcoal text-bone" : "bg-soft-grey/30 text-off-black"
      } ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      role="img"
      aria-label={label || "Coming soon"}
    >
      {caption ? (
        <div className="flex flex-col items-center gap-3 px-4 text-center">
          <SignatureMark size={18} tone={markTone} className="opacity-80" />
          <p className="eyebrow">Coming Soon</p>
          <p className="eyebrow text-[10px] opacity-45">{caption}</p>
        </div>
      ) : (
        <SignatureMark size={14} tone={markTone} className="opacity-30" />
      )}
    </div>
  );
}
