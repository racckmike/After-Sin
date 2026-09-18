import type { Metadata } from "next";
import { products } from "@/data/products";
import { ShopControls } from "@/components/commerce/ShopControls";

export const metadata: Metadata = { title: "Shop — AFTER SIN" };

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-24">
      <h1 className="font-display text-5xl md:text-6xl">All Products</h1>
      <p className="mt-4 max-w-[52ch] text-[15px] text-charcoal">
        AFTER SIN&rsquo;s full range, across every world currently in development.
      </p>
      <div className="mt-10">
        <ShopControls products={products} />
      </div>
    </div>
  );
}
