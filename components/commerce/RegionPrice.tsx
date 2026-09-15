"use client";

import { useRegion } from "@/context/RegionContext";
import { formatPrice } from "@/lib/format";

/** Formats a CAD source amount in the currently selected region's currency. */
export function RegionPrice({ amountCAD, className = "" }: { amountCAD: number; className?: string }) {
  const { region } = useRegion();
  return <span className={className}>{formatPrice(amountCAD, region.currency)}</span>;
}
