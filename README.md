# Tanzania Wildmakers Safaris — Luxury Safari Website

SEO-optimized, conversion-focused website for **Tanzania Wildmakers Safaris**, a high-end DMC specializing in Southern and Western Tanzania (Ruaha, Julius Nyerere, Katavi).

## Stack

- **Next.js 14** (App Router, SSR)
- **TypeScript**
- **Tailwind CSS** (custom design system: safari green, sand, gold, glassmorphism)
- **Framer Motion** (scroll animations, parallax feel, multi-step form)

## Design

- **Typography:** Playfair Display (headings), Manrope (body)
- **Palette:** Deep safari green, sand beige, soft gold, cream
- **UI:** Glassmorphism overlays, golden gradients, dust particle background, smooth scroll

## Structure

| Section | Route | Notes |
|--------|--------|--------|
| Homepage | `/` | Hero (image; add video to `public/hero-safari.mp4`), About, Destinations teaser, Experiences strip, CTAs |
| About | `/about` | “We are wilderness architects”, positioning, conservation |
| Destinations | `/destinations/northern`, `/southern`, `/western` | Circuit index pages |
| Destination pages | `/destinations/[slug]` | Serengeti, Ngorongoro, Tarangire, Lake Manyara, Julius Nyerere, Ruaha, Katavi — long-form SEO, FAQ schema |
| Experiences | `/experiences/[slug]` | Luxury fly-in, Honeymoon, Photographic, Conservation, Corporate |
| Sustainability | `/sustainability` | Low-density, conservation, community |
| Plan Your Safari | `/plan-your-safari` | Multi-step form (interests → dates → budget → contact), WhatsApp CTA |

## SEO

- **Metadata:** Per-page titles and descriptions
- **Schema:** `TravelAgency` (global), `FAQPage` on destination pages
- **Sitemap:** `src/app/sitemap.ts`
- **Robots:** `src/app/robots.ts`
- **Internal linking:** Destinations ↔ experiences ↔ plan-your-safari

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Customize

- **WhatsApp:** Replace `255XXXXXXXXX` in `Nav`, `Footer`, `page.tsx`, `PlanYourSafariForm`, and plan-your-safari page with your number (no +).
- **Hero video:** Add `public/hero-safari.mp4` and switch the hero in `src/app/page.tsx` to a `<video>` element (see `public/hero-video-placeholder.txt`).
- **Domain:** Update `BASE` in `src/app/sitemap.ts` and `src/app/robots.ts` for production.
- **Content:** Long-form copy on destination pages can be extended to 1500+ words in `src/data/destinations.ts` and the destination template.

## Target keywords (content strategy)

- Luxury safari Tanzania  
- Southern Tanzania safari  
- Katavi luxury safari  
- Ruaha fly-in safari  
- Exclusive safari Tanzania  
- Remote safari Africa  

Each destination and experience page is structured with H1/H2, internal links, and FAQ schema for rich results.
