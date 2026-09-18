"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/waitlist", label: "Waitlist" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 overflow-x-auto sm:flex-col sm:gap-1 sm:overflow-visible">
      {LINKS.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`eyebrow shrink-0 whitespace-nowrap border-b-2 py-3 transition-colors sm:border-b-0 sm:border-l-2 sm:py-2 sm:pl-4 ${
              active
                ? "border-off-black text-off-black"
                : "border-transparent text-charcoal hover:text-off-black"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
