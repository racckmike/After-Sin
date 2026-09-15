import type { StockStatus } from "@/lib/types";

const LABEL: Record<StockStatus, string> = {
  "in-stock": "",
  "low-stock": "Low Stock",
  "sold-out": "Sold Out",
  "coming-soon": "Coming Soon",
};

export function StatusBadge({ status }: { status: StockStatus }) {
  if (status === "in-stock") return null;
  return <span className="eyebrow text-charcoal">{LABEL[status]}</span>;
}
