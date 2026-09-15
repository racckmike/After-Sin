import Link from "next/link";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";

export function EditorialSection({
  eyebrow,
  title,
  body,
  href,
  linkLabel = "View",
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  linkLabel?: string;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
      <div
        className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <PlaceholderFrame
          label="EDITORIAL / CAMPAIGN IMAGE — PLACEHOLDER"
          ratio="4 / 5"
          tone="dark"
        />
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
