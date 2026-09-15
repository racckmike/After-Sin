import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="on-dark relative flex h-[92vh] min-h-[560px] w-full items-end bg-off-black text-bone">
      <Image
        src="/products/drop-001-full-zip-hoodie/duo-campaign.png"
        alt="AFTER SIN Drop 001 — Consequence, Ash and Oxblood full-zip hoodies"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-off-black/85 via-off-black/15 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-8 md:pb-20">
        <p className="eyebrow text-soft-grey">Drop 001 — Consequence</p>
        <h1 className="mt-3 max-w-[16ch] font-display text-[13vw] leading-[0.95] md:text-[6.2vw]">
          The First
          <br />
          Consequence
        </h1>
        <div className="mt-8 flex items-center gap-6">
          <Link
            href="/shop"
            className="flex h-12 items-center bg-bone px-7 text-sm tracking-[0.08em] text-off-black transition-opacity hover:opacity-85"
          >
            SHOP DROP
          </Link>
          <Link href="/editorial" className="eyebrow underline underline-offset-4">
            Discover
          </Link>
        </div>
      </div>
    </section>
  );
}
