import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { collections, getCollection } from "@/data/collections";
import { getProductsByCollection } from "@/data/products";
import { ShopControls } from "@/components/commerce/ShopControls";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";

const collectionCampaignImage: Record<string, string> = {
  dark: "/products/drop-001-full-zip-hoodie/trio-campaign.jpg",
};

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  const title = `${collection.name} — AFTER SIN`;
  return {
    title,
    description: collection.description,
    openGraph: { title, description: collection.description },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const collectionProducts = getProductsByCollection(collection.slug);

  return (
    <div>
      <div className="on-dark relative flex h-[58vh] min-h-[380px] w-full items-end overflow-hidden bg-off-black text-bone">
        {collectionCampaignImage[collection.slug] ? (
          <Image
            src={collectionCampaignImage[collection.slug]}
            alt={`${collection.name} campaign`}
            fill
            sizes="100vw"
            className="slow-zoom absolute inset-0 h-full w-full object-cover object-top"
            priority
          />
        ) : (
          <PlaceholderFrame
            label={`${collection.name} — CAMPAIGN — PLACEHOLDER`}
            tone="dark"
            className="absolute inset-0 h-full w-full"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-off-black/85 via-off-black/15 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 pb-12 md:px-8">
          <p className="hero-rise eyebrow text-soft-grey" style={{ animationDelay: "0.1s" }}>
            {collection.tagline}
          </p>
          <h1
            className="hero-rise mt-2 font-display text-6xl md:text-7xl"
            style={{ animationDelay: "0.2s" }}
          >
            {collection.name}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-20">
        <p className="max-w-[60ch] text-[15px] text-charcoal">{collection.description}</p>

        {collection.status === "coming-soon" ? (
          <div className="mt-14 flex flex-col items-center gap-2 border-t hairline py-20 text-center">
            <p className="eyebrow text-charcoal">This world is coming soon</p>
            <p className="text-sm text-charcoal">
              {collection.name} is still in development. Check back for Drop 001 details.
            </p>
          </div>
        ) : (
          <div className="mt-10">
            <ShopControls products={collectionProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
