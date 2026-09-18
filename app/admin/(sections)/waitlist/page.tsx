import type { Metadata } from "next";
import { listWaitlist, listWaitlistProductSlugs, waitlistBreakdown } from "@/lib/admin/db";
import { WaitlistView } from "@/components/admin/WaitlistView";

export const metadata: Metadata = { title: "Waitlist — AFTER SIN Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function AdminWaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; product?: string; sort?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const productSlug = params.product ?? "";
  const sort = (params.sort as "newest" | "oldest" | "email") ?? "newest";
  const page = Math.max(1, Number(params.page) || 1);

  const [{ rows, total }, productSlugs, breakdown] = await Promise.all([
    listWaitlist({ search, productSlug, sort, page, pageSize: PAGE_SIZE }),
    listWaitlistProductSlugs(),
    waitlistBreakdown(),
  ]);

  return (
    <WaitlistView
      rows={rows}
      total={total}
      page={page}
      pageSize={PAGE_SIZE}
      productSlugs={productSlugs}
      breakdown={breakdown}
      search={search}
      productSlug={productSlug}
      sort={sort}
    />
  );
}
