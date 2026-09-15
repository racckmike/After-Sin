import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/editorial/Hero";
import { EditorialSection } from "@/components/editorial/EditorialSection";
import { Newsletter } from "@/components/editorial/Newsletter";
import { CollectionGateway } from "@/components/editorial/CollectionGateway";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { SignatureMark } from "@/components/ui/SignatureMark";
import { collections } from "@/data/collections";
import { getProduct } from "@/data/products";
import { formatPrice } from "@/lib/format";

export default function Home() {
  const hero = getProduct("drop-001-full-zip-hoodie")!;

  return (
    <>
      <Hero />

      {/* DROP 001 — hero product */}
      <section className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
        <div className="mb-10 flex items-end justify-between border-b hairline pb-5">
          <div>
            <p className="eyebrow text-charcoal">Drop 001 — Consequence</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">
              AFTER SIN — Full-Zip Hoodie
            </h2>
          </div>
          <Link href="/shop" className="eyebrow hidden underline underline-offset-4 md:inline">
            Shop All
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.3fr_1fr] md:gap-6">
          {hero.images[0].src ? (
            <div className="relative overflow-hidden bg-charcoal" style={{ aspectRatio: "4 / 5" }}>
              <Image
                src={hero.images[0].src}
                alt={hero.images[0].alt}
                fill
                sizes="(min-width: 768px) 55vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <PlaceholderFrame label={hero.images[0].placeholderLabel} ratio="4 / 5" tone="dark" />
          )}
          <div className="grid grid-cols-2 gap-4 md:grid-rows-2 md:gap-6">
            {[hero.images[2], hero.images[3]].map((img, i) =>
              img?.src ? (
                <div key={img.id} className="relative overflow-hidden bg-charcoal" style={{ aspectRatio: "1 / 1" }}>
                  <Image src={img.src} alt={img.alt} fill sizes="27vw" className="object-cover" />
                </div>
              ) : (
                <PlaceholderFrame key={img?.id ?? i} label={img?.placeholderLabel ?? ""} ratio="1 / 1" tone="dark" />
              )
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 border-t hairline pt-6 md:flex-row md:items-center">
          <p className="max-w-[58ch] text-[15px] leading-relaxed text-charcoal">
            {hero.summary}
          </p>
          <div className="flex shrink-0 items-center gap-6">
            <span className="font-display text-xl">{formatPrice(hero.price, "CAD")}</span>
            <Link
              href={`/product/${hero.slug}`}
              className="flex h-12 items-center bg-off-black px-7 text-sm tracking-[0.08em] text-bone transition-opacity hover:opacity-85"
            >
              VIEW PRODUCT
            </Link>
          </div>
        </div>
      </section>

      {/* SHOP BY WORLD */}
      <section className="border-t hairline px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-10 flex items-center gap-3">
            <SignatureMark size={16} />
            <h2 className="eyebrow">Shop by World</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {collections.map((c) => (
              <CollectionGateway key={c.slug} collection={c} />
            ))}
          </div>
        </div>
      </section>

      <EditorialSection
        eyebrow="Editorial"
        title="What Comes After"
        body="AFTER SIN is interested in what happens after — after decisions, after mistakes, after the version of yourself you used to defend. The product is built around that idea; the campaigns will be too."
        href="/editorial"
        linkLabel="Read the story"
        image={{
          src: "/products/drop-001-full-zip-hoodie/oxblood-detail.jpg",
          alt: "AFTER SIN Drop 001 full-zip hoodie, Oxblood colorway, thorn print detail",
        }}
      />

      {/* BRAND STATEMENT */}
      <section className="mx-auto max-w-[720px] px-4 py-24 text-center md:py-32">
        <SignatureMark size={22} className="mx-auto" />
        <p className="mt-8 font-display text-2xl leading-snug md:text-3xl">
          Quality over quantity. One drop at a time.
        </p>
      </section>

      <Newsletter />
    </>
  );
}
