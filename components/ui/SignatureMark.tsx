import Image from "next/image";

/**
 * The standalone AFTER SIN signature cross — the icon-only mark pulled
 * from the approved identity board. Used sparingly: favicon-adjacent UI
 * moments, section separators, accordion glyphs, loading state, selected
 * nav indicator. Never as a repeated background pattern.
 */
export function SignatureMark({
  className = "",
  tone = "light",
  size = 16,
}: {
  className?: string;
  tone?: "light" | "dark";
  size?: number;
}) {
  const src = tone === "dark" ? "/brand/signature-bone.png" : "/brand/signature-black.png";
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={617}
      height={956}
      className={className}
      style={{ width: size, height: "auto" }}
    />
  );
}
