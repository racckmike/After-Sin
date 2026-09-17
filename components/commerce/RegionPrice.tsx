"use client";

import { useRegion } from "@/context/RegionContext";
import { getProductPrice } from "@/lib/format";
import type { StockStatus } from "@/lib/types";

/** Formats a product's price in the currently selected region's currency, or the status word when not yet available. */
export function RegionPrice({
  amountCAD,
  amountMXN,
  status = "in-stock",
  className = "",
}: {
  amountCAD: number;
  amountMXN?: number;
  status?: StockStatus;
  className?: string;
}) {
  const { region } = useRegion();
  return (
    <span className={className}>
      {getProductPrice({ price: amountCAD, priceMXN: amountMXN, status }, region.currency)}
    </span>
  );
}
