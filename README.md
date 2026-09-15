# AFTER SIN

The official storefront for AFTER SIN — master brand site covering CORE, DARK, and RACING worlds. Built with Next.js (App Router), TypeScript, and Tailwind CSS v4.

## Status

This is a real, working storefront — not a mockup. Drop 001 (AFTER SIN DARK) is the only world currently shipping; CORE and RACING are wired into the architecture as "coming soon" so the system scales without rework when they're ready.

Anything not yet finalized is explicitly marked in the UI and/or code as `PLACEHOLDER`, `DIRECTIONAL`, or `NOT LOCKED` rather than presented as real — pricing, materials, care instructions, and all campaign/product photography (which renders as labeled textured frames instead of fake stock imagery).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production build:

```bash
npm run build
npm run start
```

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4** — CSS-first config, tokens defined in `app/globals.css`
- Fonts are self-hosted via `@fontsource-variable/*` packages (not `next/font/google`) — display: Bodoni Moda, UI: Archivo, mono/eyebrow: JetBrains Mono
- No commerce backend is wired up yet — `/data` is a typed mock layer (`lib/types.ts`) standing in for Shopify/headless/whatever is chosen later. Swapping it out should only touch `/data` and `/lib`, not components.

## Structure

```
app/                  routes (home, shop, collections/[slug], product/[slug], cart, about, editorial, search-adjacent pages, legal/info pages)
components/
  layout/              header, footer, announcement bar, mobile menu
  commerce/            product cards/grid, gallery, cart drawer, search overlay, size selector
  editorial/           hero, campaign sections, newsletter, collection gateways
  brand/ui/            Logo, SignatureMark, PlaceholderFrame, Accordion — shared brand primitives
lib/                   types, price formatting
data/                  mock products, collections, editorial entries
context/               CartContext, RegionContext (CA/MX, CAD/MXN)
public/brand/          approved wordmark + signature mark assets (black + reversed bone, transparent PNG)
```

## Brand system notes

- The approved AFTER SIN wordmark and signature cross are used as supplied — `components/ui/Logo.tsx` and `SignatureMark.tsx` render the actual brand artwork (`public/brand/*.png`), never a recreated web font. The signature mark is used sparingly as a system glyph (favicon, accordion indicator, dividers), not decoratively.
- Color tokens, semantic surface tokens, and type tokens live in `app/globals.css` under `:root` / `@theme inline`. Custom base classes (`.eyebrow`, `.hairline`, `.placeholder-frame`) are wrapped in `@layer components` so utility classes always win over them — don't move them back to unlayered CSS, it silently breaks `bg-*`/`absolute`/etc. overrides.
- The header is transparent-to-solid over the homepage hero only (`overDarkHero` in `SiteChrome.tsx`); every other page runs a solid header from load.
- Nothing fabricated: no fake reviews, press, sustainability claims, scarcity, or brand history. Copy in `about/page.tsx` and the FAQ is written to be true today, not aspirational.

## What's next

Swap `PlaceholderFrame` usages for real photography as it's shot, lock pricing/materials/care once samples are approved, and connect a commerce backend behind the `/data` layer when that decision is made.
