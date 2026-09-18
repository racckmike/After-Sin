import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/editorial/Hero";
import { EditorialSection } from "@/components/editorial/EditorialSection";
import { Newsletter } from "@/components/editorial/Newsletter";
import { CollectionGateway } from "@/components/editorial/CollectionGateway";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { SignatureMark } from "@/components/ui/SignatureMark";
import { Reveal } from "@/components/ui/Reveal";
import { RegionPrice } from "@/components/commerce/RegionPrice";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { collections } from "@/data/collections";
import { getProduct, getProductsByCollection } from "@/data/products";

export default function Home() {
  const hero = getProduct("drop-001-full-zip-hoodie")!;
  const dropProducts = getProductsByCollection("dark");

  return (
    <>
      <Hero />

      {/* DROP 001 — hero product. The loudest moment on the page after the
          hero itself: oversized display type, tight image crop, generous
          top space so it reads as a statement, not a listing header. */}
      <section className="mx-auto max-w-[1600px] px-4 pb-20 pt-24 md:px-8 md:pb-28 md:pt-36">
        <Reveal className="mb-12 flex flex-col gap-4 border-b hairline pb-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-charcoal">Drop 001 — Consequence</p>
            <h2 className="mt-3 font-display text-[13vw] leading-[0.95] md:text-6xl lg:text-7xl">
              Full-Zip Hoodie
            </h2>
          </div>
          <Link href="/shop" className="eyebrow underline underline-offset-4">
            Shop All
          </Link>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr] md:gap-6">
          {hero.images[0].src ? (
            <div className="group relative overflow-hidden bg-charcoal" style={{ aspectRatio: "4 / 5" }}>
              <Image
                src={hero.images[0].src}
                alt={hero.images[0].alt}
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                priority
              />
            </div>
          ) : (
            <PlaceholderFrame label={hero.images[0].placeholderLabel} ratio="4 / 5" tone="dark" />
          )}
          <div className="grid grid-cols-2 gap-4 md:grid-rows-2 md:gap-6">
            {[hero.images[2], hero.images[3]].map((img, i) =>
              img?.src ? (
                <div key={img.id} className="group relative overflow-hidden bg-charcoal" style={{ aspectRatio: "1 / 1" }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="27vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
              ) : (
                <PlaceholderFrame key={img?.id ?? i} label={img?.placeholderLabel ?? ""} ratio="1 / 1" tone="dark" />
              )
            )}
          </div>
        </div>

        <Reveal className="mt-8 flex flex-col items-start justify-between gap-6 border-t hairline pt-6 md:flex-row md:items-center">
          <p className="max-w-[58ch] text-[15px] leading-relaxed text-charcoal">
            {hero.summary}
          </p>
          <div className="flex shrink-0 items-center gap-6">
            <RegionPrice
              amountCAD={hero.price}
              amountMXN={hero.priceMXN}
              status={hero.status}
              className="font-display text-xl"
            />
            <Link
              href={`/product/${hero.slug}`}
              className="flex h-12 items-center bg-off-black px-7 text-sm tracking-[0.08em] text-bone transition-all duration-200 hover:opacity-85 active:scale-[0.97]"
            >
              VIEW PRODUCT
            </Link>
          </div>
        </Reveal>
      </section>

      {/* SHOP THE DROP — deliberately quieter/more functional than the
          moments around it: this is a utility grid, not a statement. */}
      <section className="border-t hairline px-4 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1600px]">
          <Reveal className="mb-10 flex items-end justify-between">
            <h2 className="eyebrow text-charcoal">Shop the Drop</h2>
            <Link href="/collections/dark" className="eyebrow hidden underline underline-offset-4 md:inline">
              Shop All
            </Link>
          </Reveal>
          <ProductGrid products={dropProducts} />
        </div>
      </section>

      {/* SHOP BY WORLD — the signature AFTER SIN feature: given room to
          feel cinematic, with a real display heading instead of a label. */}
      <section className="border-t hairline px-4 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1600px]">
          <Reveal className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
            <SignatureMark size={20} />
            <h2 className="font-display text-4xl md:text-6xl">Shop by World</h2>
            <p className="max-w-[46ch] text-sm text-charcoal">
              Every AFTER SIN world shares one standard of construction — and its own visual language.
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {collections.map((c, i) => (
              <Reveal key={c.slug} delay={i * 90}>
                <CollectionGateway collection={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reveal>
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
      </Reveal>

      {/* BRAND STATEMENT — the quietest moment on the page: intimate,
          centered, almost no chrome, so it reads as a held breath before
          the closing Enter AFTER SIN moment. */}
      <Reveal className="mx-auto max-w-[640px] px-4 py-28 text-center md:py-36">
        <SignatureMark size={22} className="mx-auto" />
        <p className="mt-8 font-display text-3xl leading-snug md:text-4xl">
          Quality over quantity.
          <br />
          One drop at a time.
        </p>
      </Reveal>

      <Newsletter />
    </>
  );
}
