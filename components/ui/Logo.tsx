import Image from "next/image";
import Link from "next/link";

/**
 * Approved AFTER SIN wordmark (full lockup, integrated signature cross).
 * This is brand artwork, not a web font — do not recreate it in type.
 * `tone` picks the black-ink-on-transparent or reversed bone-on-transparent
 * export so the same asset reads correctly over both light and dark grounds.
 */
export function Logo({
  className = "",
  tone = "light",
  priority = false,
}: {
  className?: string;
  tone?: "light" | "dark";
  priority?: boolean;
}) {
  const src = tone === "dark" ? "/brand/wordmark-bone.png" : "/brand/wordmark-black.png";
  return (
    <Link href="/" aria-label="AFTER SIN — home" className={`inline-flex ${className}`}>
      <Image
        src={src}
        alt="AFTER SIN"
        width={1150}
        height={582}
        priority={priority}
        className="h-auto w-[132px] md:w-[150px]"
      />
    </Link>
  );
}
