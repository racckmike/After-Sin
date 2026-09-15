"use client";

import { useRegion } from "@/context/RegionContext";
import { priceOrStatus } from "@/lib/format";
import type { StockStatus } from "@/lib/types";

/** Formats a CAD source amount in the currently selected region's currency, or the status word when not yet available. */
export function RegionPrice({
  amountCAD,
  status = "in-stock",
  className = "",
}: {
  amountCAD: number;
  status?: StockStatus;
  className?: string;
}) {
  const { region } = useRegion();
  return <span className={className}>{priceOrStatus(amountCAD, region.currency, status)}</span>;
}
