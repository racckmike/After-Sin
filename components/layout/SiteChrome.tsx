"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/commerce/CartDrawer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overDarkHero = pathname === "/";

  return (
    <>
      <AnnouncementBar />
      <Header overDarkHero={overDarkHero} />
      {/* On the homepage the header is transparent over the hero, so the hero
          is pulled up underneath the header's flow height (h-16) to remove
          the light body-background gap that otherwise shows through. */}
      <main id="main" className={overDarkHero ? "-mt-16" : undefined}>
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
