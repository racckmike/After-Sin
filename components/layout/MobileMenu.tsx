"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CurrencySelector } from "@/components/layout/CurrencySelector";

interface NavItem {
  label: string;
  href: string;
}

interface CollectionNavItem extends NavItem {
  status: "live" | "coming-soon";
}

/**
 * Matches Shihiko's real mobile menu (opened and measured live): a
 * full-screen overlay — not a partial side drawer — with a close/
 * logo header row, then bold uppercase nav rows with hairline
 * dividers, "Collections" expanding in place as an accordion instead
 * of pushing to a submenu.
 */
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
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  // Collapse the accordion once the menu itself closes — adjusting state
  // during render instead of in an effect avoids the extra render pass a
  // setState-in-effect would cause (same pattern as ProductGallery).
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) setCollectionsOpen(false);
  }

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-bone transition-opacity duration-300 md:hidden ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <div
        className="flex items-center justify-between border-b hairline px-4 py-5"
        style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top, 0px))" }}
      >
        <button type="button" onClick={onClose} aria-label="Close menu" className="text-2xl leading-none">
          &times;
        </button>
        <Logo />
        <span className="w-6" aria-hidden />
      </div>

      <nav className="flex-1 overflow-y-auto px-4">
        <Link
          href="/shop"
          onClick={onClose}
          className="flex items-center justify-between border-b hairline py-5 font-display text-xl uppercase"
        >
          Shop
        </Link>

        <button
          type="button"
          onClick={() => setCollectionsOpen((v) => !v)}
          aria-expanded={collectionsOpen}
          className="flex w-full items-center justify-between border-b hairline py-5 font-display text-xl uppercase"
        >
          Collections
          <span aria-hidden className="text-lg">
            {collectionsOpen ? "−" : "+"}
          </span>
        </button>
        {collectionsOpen && (
          <div className="flex flex-col gap-4 border-b hairline py-4 pl-2">
            {collections.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={onClose}
                className="flex items-baseline justify-between gap-4 text-base"
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
            className="flex items-center justify-between border-b hairline py-5 font-display text-xl uppercase"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div
        className="flex items-center justify-between border-t hairline px-4 py-5"
        style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <CurrencySelector tone="light" />
        <Link href="/account" onClick={onClose} className="eyebrow">
          Account
        </Link>
      </div>
    </div>
  );
}
