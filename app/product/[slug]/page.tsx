import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/data/products";
import { ProductDisplay } from "@/components/commerce/ProductDisplay";
import { ProductGrid } from "@/components/commerce/ProductGrid";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const title = `${product.name} — AFTER SIN`;
  const image = product.images[0]?.src;
  return {
    title,
    description: product.summary,
    openGraph: {
      title,
      description: product.summary,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter(
    (p) => p.collectionSlug === product.collectionSlug && p.slug !== product.slug
  );

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-8 md:py-14">
      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:gap-14 lg:grid-cols-[1.7fr_1fr]">
        <ProductDisplay product={product} />
      </div>

      {related.length > 0 && (
        <section className="mt-24 border-t hairline pt-10">
          <h2 className="eyebrow mb-8">Complete the Look</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
