import Link from "next/link";
import Image from "next/image";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";

export function EditorialSection({
  eyebrow,
  title,
  body,
  href,
  linkLabel = "View",
  reverse = false,
  image,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  linkLabel?: string;
  reverse?: boolean;
  image?: { src: string; alt: string };
}) {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
      <div
        className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {image ? (
          <div className="relative overflow-hidden bg-charcoal" style={{ aspectRatio: "4 / 5" }}>
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        ) : (
          <PlaceholderFrame
            label="EDITORIAL / CAMPAIGN IMAGE — PLACEHOLDER"
            ratio="4 / 5"
            tone="dark"
          />
        )}
        <div className="max-w-[42ch]">
          <p className="eyebrow text-charcoal">{eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl">{title}</h2>
          <p className="mt-5 text-[15px] leading-relaxed text-charcoal">{body}</p>
          <Link href={href} className="eyebrow mt-7 inline-block underline underline-offset-4">
            {linkLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
