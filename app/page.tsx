import { Hero } from "@/components/editorial/Hero";
import { EditorialSection } from "@/components/editorial/EditorialSection";
import { CategoryShowcase } from "@/components/editorial/CategoryShowcase";
import { CollectionGateway } from "@/components/editorial/CollectionGateway";
import { SignatureMark } from "@/components/ui/SignatureMark";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ProductCard } from "@/components/commerce/ProductCard";
import { collections } from "@/data/collections";
import { getProductsByCollection } from "@/data/products";

export default function Home() {
  const dropProducts = getProductsByCollection("dark");

  return (
    <>
      <Hero />

      {/* DROP 001 — product discovery. The loudest moment on the page after
          the hero itself: a real display heading introduces the drop, then
          the garments themselves — large, few, unboxed — carry the section.
          This is a teaser into the collection, not a product explainer;
          full front/back/detail/hardware imagery lives on each PDP. */}
      <section className="mx-auto max-w-[1600px] px-4 pb-20 pt-24 md:px-8 md:pb-28 md:pt-36">
        <Reveal className="mb-12 flex flex-col gap-4 border-b hairline pb-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-charcoal">Drop 001 — Consequence</p>
            <h2 className="mt-3 font-display text-2xl uppercase leading-[1.05] tracking-tight md:text-4xl lg:text-[43px]">
              Explore the Collection
            </h2>
          </div>
          <ArrowLink href="/shop" tone="light">
            Shop All
          </ArrowLink>
        </Reveal>

        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 md:gap-x-10">
          {dropProducts.map((product, i) => (
            <Reveal key={product.slug} delay={i * 100}>
              <ProductCard product={product} imageSizes="(min-width: 768px) 46vw, 92vw" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATEGORY SHOWCASES — reproduces Shihiko's real homepage rhythm
          (measured live: it repeats a full-bleed category banner once per
          garment category after the product section). AFTER SIN's real
          catalog is two categories, so this is two honest showcases with
          real item counts, not four invented ones. */}
      <CategoryShowcase
        index={1}
        name="Hoodies"
        itemCount={1}
        href="/product/drop-001-full-zip-hoodie"
        image={{
          src: "/products/drop-001-full-zip-hoodie/oxblood-portrait.jpg",
          alt: "AFTER SIN Drop 001 full-zip hoodie, Oxblood colorway, hood portrait",
        }}
      />
      <CategoryShowcase
        index={2}
        name="Sweatpants"
        itemCount={1}
        href="/product/drop-001-discipline-sweatpants"
        image={{
          src: "/products/drop-001-discipline-sweatpants/slate-campaign.jpg",
          alt: "AFTER SIN Drop 001 Discipline Sweatpants, Slate colorway, campaign",
        }}
      />

      {/* SHOP BY WORLD — the signature AFTER SIN feature: given room to
          feel cinematic, with a real display heading instead of a label. */}
      <section className="border-t hairline px-4 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1600px]">
          <Reveal className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
            <SignatureMark size={20} />
            <h2 className="font-display text-2xl uppercase tracking-tight md:text-4xl lg:text-[43px]">Shop by World</h2>
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
    </>
  );
}
