import type { Metadata } from "next";
import "@fontsource-variable/bodoni-moda/wght.css";
import "@fontsource-variable/archivo/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { RegionProvider } from "@/context/RegionContext";
import { SiteChrome } from "@/components/layout/SiteChrome";

export const metadata: Metadata = {
  title: "AFTER SIN",
  description: "AFTER SIN — premium contemporary streetwear. Toronto.",
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
            <SiteChrome>{children}</SiteChrome>
          </CartProvider>
        </RegionProvider>
      </body>
    </html>
  );
}
