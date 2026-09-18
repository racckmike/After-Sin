import Link from "next/link";
import Image from "next/image";
import { EditorialButton } from "@/components/ui/EditorialButton";

export function Hero() {
  return (
    <section className="on-dark relative flex h-[92vh] min-h-[560px] w-full items-end overflow-hidden bg-off-black text-bone">
      <Image
        src="/products/drop-001-full-zip-hoodie/duo-campaign.jpg"
        alt="AFTER SIN Drop 001 — Consequence, Ash and Oxblood full-zip hoodies"
        fill
        priority
        sizes="100vw"
        className="slow-zoom absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-off-black/90 via-off-black/20 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-8 md:pb-20">
        <p className="hero-rise eyebrow text-soft-grey" style={{ animationDelay: "0.1s" }}>
          Drop 001 — Consequence
        </p>
        <h1
          className="hero-rise mt-3 max-w-[16ch] font-display text-[14vw] leading-[0.92] md:text-[6.4vw]"
          style={{ animationDelay: "0.2s" }}
        >
          The First
          <br />
          Consequence
        </h1>
        <div className="hero-rise mt-8 flex items-center gap-6" style={{ animationDelay: "0.4s" }}>
          <EditorialButton href="/shop" tone="light" className="h-12">
            SHOP DROP
          </EditorialButton>
          <Link href="/editorial" className="eyebrow underline underline-offset-4 transition-opacity hover:opacity-60">
            Discover
          </Link>
        </div>
      </div>
    </section>
  );
}
