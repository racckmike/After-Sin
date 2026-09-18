import type { Metadata } from "next";
import { listCustomers } from "@/lib/admin/db";
import { CustomersView } from "@/components/admin/CustomersView";

export const metadata: Metadata = { title: "Customers — AFTER SIN Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  const { rows, total } = await listCustomers({ search, page, pageSize: PAGE_SIZE });

  return <CustomersView rows={rows} total={total} page={page} pageSize={PAGE_SIZE} search={search} />;
}
