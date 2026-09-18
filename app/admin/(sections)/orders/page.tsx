import type { Metadata } from "next";
import { listOrdersForAdmin } from "@/lib/orders/db";
import { OrdersView } from "@/components/admin/OrdersView";

export const metadata: Metadata = { title: "Orders — AFTER SIN Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const status = params.status ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  const { rows, total } = await listOrdersForAdmin({ search, status, page, pageSize: PAGE_SIZE });

  return <OrdersView rows={rows} total={total} page={page} pageSize={PAGE_SIZE} search={search} status={status} />;
}
