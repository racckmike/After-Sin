import type { Metadata } from "next";
import "@fontsource-variable/bodoni-moda/wght.css";
import "@fontsource-variable/archivo/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { RegionProvider } from "@/context/RegionContext";
import { PageTransitionProvider } from "@/context/PageTransitionContext";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { TransitionOverlay } from "@/components/layout/TransitionOverlay";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aftersin.shop"),
  title: "AFTER SIN",
  description: "AFTER SIN — premium contemporary streetwear. Toronto.",
  openGraph: {
    title: "AFTER SIN",
    description: "AFTER SIN — premium contemporary streetwear. Toronto.",
    url: "https://www.aftersin.shop",
    siteName: "AFTER SIN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AFTER SIN",
    description: "AFTER SIN — premium contemporary streetwear. Toronto.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-off-black focus:px-4 focus:py-2 focus:text-bone"
        >
          Skip to content
        </a>
        <RegionProvider>
          <CartProvider>
            <PageTransitionProvider>
              <SiteChrome>{children}</SiteChrome>
              <TransitionOverlay />
            </PageTransitionProvider>
          </CartProvider>
        </RegionProvider>
      </body>
    </html>
  );
}
