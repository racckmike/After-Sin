"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CurrencySelector } from "@/components/layout/CurrencySelector";

interface NavItem {
  label: string;
  href: string;
}

interface CollectionNavItem extends NavItem {
  status: "live" | "coming-soon";
}

export function MobileMenu({
  open,
  onClose,
  nav,
  collections = [],
}: {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
  collections?: CollectionNavItem[];
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-off-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute inset-y-0 left-0 flex w-[84%] max-w-[360px] flex-col bg-bone px-6 pt-6 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ paddingTop: "max(1.5rem, env(safe-area-inset-top, 0px))" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="mb-10 self-end text-2xl leading-none"
        >
          &times;
        </button>
        <nav className="flex flex-col gap-6 overflow-y-auto">
          <Link href="/shop" onClick={onClose} className="font-display text-3xl">
            Shop
          </Link>
          {collections.length > 0 && (
            <div className="flex flex-col gap-3 pl-1">
              <span className="eyebrow text-charcoal">Collections</span>
              {collections.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  onClick={onClose}
                  className="flex items-baseline justify-between gap-4 text-xl"
                >
                  <span>{c.label}</span>
                  {c.status === "coming-soon" && (
                    <span className="eyebrow text-[10px] text-charcoal">Soon</span>
                  )}
                </Link>
              ))}
            </div>
          )}
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="font-display text-3xl"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-4 border-t hairline py-6">
          <CurrencySelector tone="light" />
          <Link href="/account" onClick={onClose} className="eyebrow">
            Account
          </Link>
        </div>
      </div>
    </div>
  );
}
