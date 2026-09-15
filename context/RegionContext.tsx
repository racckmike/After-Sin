"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface Region {
  code: "CA" | "MX";
  label: string;
  currency: "CAD" | "MXN";
}

export const REGIONS: Region[] = [
  { code: "CA", label: "Canada", currency: "CAD" },
  { code: "MX", label: "Mexico", currency: "MXN" }, // NOT LOCKED — architecture only, MXN pricing not live
];

interface RegionContextValue {
  region: Region;
  setRegion: (code: Region["code"]) => void;
}

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<Region>(REGIONS[0]);
  const setRegion = (code: Region["code"]) => {
    const next = REGIONS.find((r) => r.code === code);
    if (next) setRegionState(next);
  };
  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegion must be used within RegionProvider");
  return ctx;
}
