"use client";

import { REGIONS, useRegion } from "@/context/RegionContext";

export function CurrencySelector({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { region, setRegion } = useRegion();
  return (
    <label className="eyebrow inline-flex items-center gap-2">
      <span className="sr-only">Country and currency</span>
      <select
        value={region.code}
        onChange={(e) => setRegion(e.target.value as "CA" | "MX")}
        className={`eyebrow cursor-pointer appearance-none bg-transparent pr-1 outline-none ${
          tone === "dark" ? "text-bone" : "text-off-black"
        }`}
      >
        {REGIONS.map((r) => (
          <option key={r.code} value={r.code} className="text-off-black">
            {r.label} / {r.currency}
          </option>
        ))}
      </select>
    </label>
  );
}
