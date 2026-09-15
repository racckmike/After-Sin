import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CurrencySelector } from "@/components/layout/CurrencySelector";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "AFTER SIN DARK", href: "/collections/dark" },
      { label: "AFTER SIN CORE", href: "/collections/core" },
      { label: "AFTER SIN RACING", href: "/collections/racing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Editorial", href: "/editorial" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="on-dark border-t border-off-black bg-off-black text-bone">
      <div className="mx-auto max-w-[1600px] px-4 py-14 md:px-8 md:py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-4">
            <Logo tone="dark" />
            <p className="max-w-[28ch] text-sm text-soft-grey">
              Premium contemporary streetwear. Toronto — building for Canada and
              Mexico first.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <span className="eyebrow text-soft-grey">{col.title}</span>
              {col.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm transition-opacity hover:opacity-60"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/10 pt-6 md:flex-row md:items-center">
          <p className="eyebrow text-soft-grey">
            © {new Date().getFullYear()} AFTER SIN. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <CurrencySelector tone="dark" />
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Instagram" className="eyebrow hover:opacity-60">
                Instagram
              </a>
              <a href="#" aria-label="TikTok" className="eyebrow hover:opacity-60">
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
