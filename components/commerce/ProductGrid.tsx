import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/commerce/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 border-t hairline py-20 text-center">
        <p className="eyebrow text-charcoal">Nothing here yet</p>
        <p className="text-sm text-charcoal">This world is still in development.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
