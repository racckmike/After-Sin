"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CurrencySelector } from "@/components/layout/CurrencySelector";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchOverlay } from "@/components/commerce/SearchOverlay";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth/client";
import { collections } from "@/data/collections";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Editorial", href: "/editorial" },
  { label: "About", href: "/about" },
];

export function Header({ overDarkHero = false }: { overDarkHero?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, openCart } = useCart();
  const { data: session } = authClient.useSession();
  const authed = !!session?.user;

  // The header stays transparent for the full hero — not a fixed scroll
  // distance — and only turns solid once the hero has scrolled entirely
  // behind it. An IntersectionObserver watching the hero's own height
  // (with the header's height subtracted via rootMargin) tracks that
  // boundary directly, so it stays correct whether the hero is 100svh
  // or any other height, and costs nothing on every scroll tick the way
  // a scroll-listener recalculation would.
  useEffect(() => {
    if (!overDarkHero) return;
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [overDarkHero]);

  const solid = !overDarkHero || scrolled;
  const tone: "light" | "dark" = solid ? "light" : "dark";

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-300 ${
          solid
            ? "bg-bone/95 border-b hairline text-off-black"
            : "bg-transparent border-b border-transparent text-bone"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex flex-col gap-[5px] md:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <span className={`h-px w-5 ${solid ? "bg-off-black" : "bg-bone"}`} />
              <span className={`h-px w-5 ${solid ? "bg-off-black" : "bg-bone"}`} />
            </button>
            <nav className="hidden items-center gap-7 md:flex">
              <Link href="/shop" className="eyebrow transition-opacity hover:opacity-60">
                Shop
              </Link>
              <div className="group relative">
                <Link href={`/collections/${collections[0].slug}`} className="eyebrow transition-opacity hover:opacity-60">
                  Collections
                </Link>
                <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
                  <div className="flex min-w-[220px] flex-col border border-off-black/15 bg-bone py-2 text-off-black shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                    {collections.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/collections/${c.slug}`}
                        className="flex items-baseline justify-between gap-4 px-4 py-2.5 text-sm transition-opacity hover:opacity-60"
                      >
                        <span>{c.name}</span>
                        {c.status === "coming-soon" && (
                          <span className="eyebrow text-[10px] text-charcoal">Soon</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              {NAV.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="eyebrow transition-opacity hover:opacity-60"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <Logo tone={tone} />
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden md:inline-flex">
              <CurrencySelector tone={tone} />
            </span>
            <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </button>
            <Link href="/account" aria-label="Account" className="relative hidden md:inline-flex">
              <AccountIcon />
              {authed && (
                <span
                  aria-hidden
                  className={`absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full ${
                    solid ? "bg-off-black" : "bg-bone"
                  }`}
                />
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Bag, ${count} item${count === 1 ? "" : "s"}`}
              className="eyebrow inline-flex items-center gap-1.5"
            >
              <BagIcon />
              <span>({count})</span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        nav={NAV.slice(1)}
        collections={collections.map((c) => ({ label: c.name, href: `/collections/${c.slug}`, status: c.status }))}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M16 16L12.5 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function AccountIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 16c1-3.2 4-4.8 6.5-4.8S15 12.8 16 16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" aria-hidden>
      <path d="M4 6V4.5a4.5 4.5 0 019 0V6" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1.5" y="6" width="14" height="10.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
