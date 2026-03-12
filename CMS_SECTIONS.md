# CMS sections — Tanzania Wildmakers Safari

This document lists **every section of the website that should be editable via a CMS**, so you can plan content types, fields, and wiring.

**Backend engineers:** For API design, endpoints, request/response shapes, and media handling, see **[CMS_BACKEND_API_SPEC.md](./CMS_BACKEND_API_SPEC.md)**.

---

## Media upload guidelines (images & video)

All uploads (images, videos, logo) must follow these rules so the site stays fast and consistent. **Enforce these on the backend** (validation, processing) and **guide editors in the CMS UI** (labels, limits, errors).

### Images

| Use case | Format | Dimensions (recommended) | Max file size | Notes |
|----------|--------|---------------------------|---------------|--------|
| **Logo** | PNG (transparent) or SVG | Height 72–96px, width proportional | 200 KB | SVG preferred for sharpness at all sizes; PNG if SVG not supported. |
| **Hero (full-bleed)** | WebP or JPEG | 1920×1080 (16:9) or 1920×1280 | 500 KB (WebP) / 800 KB (JPEG) | Prefer WebP; serve JPEG fallback. No 4K. |
| **Hero (portrait / about, sustainability)** | WebP or JPEG | 1920×1080 or 1200×1600 | 500 KB (WebP) / 800 KB (JPEG) | Same as above. |
| **Card / destination / experience thumb** | WebP or JPEG | 1200×800 or 800×600 | 300 KB (WebP) / 450 KB (JPEG) | Aspect 3:2 or 4:3. |
| **Blog post featured** | WebP or JPEG | 1200×630 (OG) or 1200×800 | 300 KB (WebP) / 450 KB (JPEG) | 1200×630 for social cards. |
| **Team / avatar** | WebP or JPEG | 400×400 (square) | 150 KB | Crop to square in CMS or backend. |
| **Media mention logo** | PNG or SVG | Max 200×60 or equivalent area | 100 KB | Optional; text-only is fine. |

**Best practices (backend & frontend):**

- **Validate on upload:** MIME type, dimensions, file size. Reject or resize if over limits.
- **Generate derivatives:** Backend should produce responsive widths (e.g. 640w, 1024w, 1920w) and WebP + JPEG; return URLs for each in the API (or use a single URL and let CDN/image service handle `srcset`).
- **Alt text required:** Every image field must have an `alt` (or `imageAlt`) for accessibility; validate non-empty in API.
- **CDN:** Serve images from a CDN; API returns public CDN URLs, not raw backend paths.

### Video

| Use case | Format | Resolution | Max file size | Duration (recommended) |
|----------|--------|------------|---------------|-------------------------|
| **Hero slideshow** | MP4 (H.264) + WebM (VP9) | 1080p (1920×1080) | **6–8 MB per file** | 15–30 s per slide (loop). |
| **Map video** | MP4 (H.264) + WebM (VP9) | 1080p (1920×1080) | **6–8 MB** (strict for fast load); up to 15–20 MB acceptable with loading state | As needed (e.g. 20–40 s). |

**Best practices (backend & frontend):**

- **Validate on upload:** Container (MP4/WebM), codec (H.264 / VP9), resolution ≤ 1920×1080, file size. Reject or re-encode if over limits.
- **Transcode on ingest:** Generate WebM (VP9) from MP4 for smaller size at same quality; store both and return both URLs in API so frontend can use `<source type="video/webm">` and `<source type="video/mp4">`.
- **No 4K:** 1080p only to keep size and decode cost low.
- **Serve from CDN:** Return CDN URLs; do not stream from app server.
- **Frontend:** Already uses loading state for map; hero slides are buffered in DOM. Keeping files under 6–8 MB avoids “stuck” playback in production.

### Text / rich content

- **Rich text:** Store as HTML or Markdown; API returns HTML (or structured JSON) for body fields. Sanitize on backend (allow only safe tags/attrs).
- **Max lengths:** Define and enforce per field (e.g. meta description 160 chars, tagline 120 chars) to keep SEO and UI predictable.
- **Language:** All CMS-editable copy is **English** unless you add locale support later; API can expose `locale` or `lang` for future i18n.

---

## 1. Global / site-wide

| Section | Current location | CMS content needed |
|--------|------------------|---------------------|
| **Site metadata** | `src/app/layout.tsx` | Default title, template, meta description, keywords, OG image |
| **Logo** | `Nav.tsx`, `Footer.tsx` — `/logo.png` | Logo image (and optional alternate for footer) |
| **Navigation** | `src/components/Nav.tsx` — `navLinks`, `destinationNavGroups` | Main nav items (label, href), Destinations dropdown (circuit label + park links), Experiences sub-items |
| **Footer** | `src/components/Footer.tsx` | Brand tagline, short description, location line, **footer link groups**: Destinations (headings + links), Experiences, Company; **contact**: WhatsApp number, email; **legal links**: Terms, Privacy, Cookies; copyright text |
| **Contact strip (side banner)** | `src/components/ContactUsBanner.tsx` | Label (“Contact Us”), email (mailto) |
| **WhatsApp float** | `src/components/WhatsAppFloat.tsx` | Phone number (e.g. 255762111315), optional label (“Chat on WhatsApp”) |

---

## 2. Homepage (`/`)

| Section | Current location | CMS content needed |
|--------|------------------|---------------------|
| **Hero slideshow** | `src/app/page.tsx` — `HERO_SLIDES` | List of slides: **video** (or image) URL, alt text, optional label; **slide duration** (ms) |
| **Hero copy** | Same file | Eyebrow (“Est. 2010 • Private & Exclusive”), **headline** (e.g. “Where Untamed Wild Meets Refined Luxury”), **subhead**, **CTA buttons** (label + href) — e.g. “Begin Your Journey”, “Explore Our Sanctuaries” |
| **Map phase** | `src/components/AnimatedTanzaniaMap.tsx` | Map **video** URL; **heading** (“Discover Tanzania’s Untamed Frontiers”) |
| **Media mentions** | `src/app/page.tsx` | List of **press / partner names** (e.g. Condé Nast Traveler, Vogue, Financial Times, Departures, Tatler) — text only or with optional logo image/link |
| **Sanctuaries (Our destinations)** | Same file | **Section**: eyebrow, title (“Sanctuaries of The Wild”), body copy, CTA label + href. **Images**: lodge, wild, safari (3 images with alt) |
| **Distinction (pillar cards)** | Same file — inline array | List of **pillars**: icon key (or icon choice), title, short copy (e.g. Bespoke Curation, Elite Guidance, Ethical Impact, Infinite Care) |
| **Our Story (editorial)** | Same file | **Eyebrow**, **quote** (“We are wilderness architects.”), **body paragraphs**, **CTA** label + href; **background image** URL |
| **Testimonials** | Same file — `TESTIMONIALS` | List of **testimonials**: quote, name, trip/location, initials (or derived) |
| **Where We Go (circuits)** | Same file — inline array | **Three cards**: title, short description, href, **background image** URL (Northern, Southern, Western) |
| **Safari Experiences (preview)** | Same file | Section **eyebrow**, **heading**; list of **experience cards** (title, tagline, href, optional image) — can be driven from same CMS as Experiences |
| **Final CTA** | Same file | **Headline**, **subcopy**, **button** label + href (e.g. “Begin Your Journey” → `/plan-your-safari`) |

---

## 3. Destinations

| Section | Current location | CMS content needed |
|--------|------------------|---------------------|
| **Circuits** | `src/data/destinations.ts` — `circuits` | Circuit **name**, **slug** (northern, southern, western) |
| **Destinations (parks)** | `src/data/destinations.ts` — `destinations` | Per park: **slug**, **name**, **circuit**, **tagline**, **metaDescription**, **highlights** (list), **bestTime**, **luxuryCamps** (list), **migrationNote**, **ecosystem**, **avgTemp**, **imageUrl**, **internalLinks** (label + href) |
| **Circuit page** | `src/app/destinations/CircuitPageContent.tsx` | Hero **image**, circuit **title/copy**; list of parks comes from destinations data |
| **Destination detail** | `src/app/destinations/[slug]/DestinationPageContent.tsx` | All destination fields above; page layout may add **sections** (e.g. Fast Facts, Highlights, Luxury Camps) — can be fixed layout with CMS-driven fields |
| **Destinations index** | `src/app/destinations/page.tsx` | **Hero** image, **title**, **intro** copy |

---

## 4. Experiences

| Section | Current location | CMS content needed |
|--------|------------------|---------------------|
| **Experiences list** | `src/data/experiences.ts` | Per experience: **slug**, **name**, **tagline**, **metaDescription**, **body** (rich text), **highlights** (list), **cta**, **internalLinks**, **imageUrl**, **eyebrow** |
| **Experiences index** | `src/app/experiences/page.tsx` | **Hero** image, **title**, **intro** |
| **Experience detail** | `src/app/experiences/[slug]/page.tsx` | All experience fields; **hero image** from `imageUrl` or override |

---

## 5. Safari Journal (Blog)

| Section | Current location | CMS content needed |
|--------|------------------|---------------------|
| **Categories** | `src/data/safariJournal.ts` — `JOURNAL_CATEGORIES` | **Slug**, **label** (e.g. Safari Planning, Wildlife Encounters, Destination Guides) |
| **Posts** | `src/data/safariJournal.ts` — `JOURNAL_POSTS` | **Slug**, **title**, **excerpt**, **category** (slug), **image**, **imageAlt**, **readTime**; **body** (rich text) for post detail page |
| **Journal index** | `src/app/safari-journal/page.tsx` | **Hero** image, **title**, **intro** (if any) |
| **Post detail** | `src/app/safari-journal/[slug]/page.tsx` | Full post content (title, image, body, meta); **related posts** optional |

---

## 6. About

| Section | Current location | CMS content needed |
|--------|------------------|---------------------|
| **Hero** | `src/app/about/AboutContent.tsx` | **Background image**, **headline**, optional subhead |
| **Story / mission** | Same file | **Body copy** (one or more rich-text blocks) |
| **Founder quote** | Same file — `FOUNDER_QUOTE` | **Quote** text, optional attribution |
| **Team** | Same file — `TEAM` | List: **name**, **role**, **image** URL, **alt** |
| **Testimonials** | Same file — `ABOUT_TESTIMONIALS` | **Quote**, **name**, **location** |

---

## 7. Sustainability

| Section | Current location | CMS content needed |
|--------|------------------|---------------------|
| **Hero** | `src/app/sustainability/SustainabilityContent.tsx` | **Image** (`HERO_IMAGE`), **headline**, optional subhead |
| **Pillars** | Same file — `PILLARS` | **Title**, **body**, **cta** label, **href**, **icon** (key or asset) |
| **Stats** | Same file — `STATS` | **Value**, **label** (e.g. “120k+”, “Acres protected”) |
| **Image break + CTA** | Same file | **Image** URL, **headline**, **copy**, **button** label + href |

---

## 8. Plan Your Safari

| Section | Current location | CMS content needed |
|--------|------------------|---------------------|
| **Page content** | `src/app/plan-your-safari/page.tsx` | **Background image**, **eyebrow**, **headline**, **intro** copy; **concierge card**: name, role, **image**, short bio; **form** fields can stay fixed or be CMS-driven (labels, placeholders); **WhatsApp CTA** copy + number (or use global) |

---

## 9. Legal pages

| Section | Current location | CMS content needed |
|--------|------------------|---------------------|
| **Privacy Policy** | `src/app/privacy-policy/page.tsx` | **Title**, **meta description**, **body** (rich text or structured sections: what we collect, how we use it, contact) |
| **Terms of Use** | `src/app/terms/page.tsx` | **Title**, **meta description**, **body** (rich text) |
| **Cookie Policy** | `src/app/cookies/page.tsx` | **Title**, **meta description**, **body** (rich text) |

---

## 10. SEO & schema

| Section | Current location | CMS content needed |
|--------|------------------|---------------------|
| **Travel agency schema** | `src/components/seo/TravelAgencySchema.tsx` | Organization name, logo URL, description, sameAs (social/contact URLs), contact email/phone — can be global settings in CMS |

---

## Summary: content types to model in the CMS

1. **Global settings** — Site metadata, logo, nav, footer, contact (email, WhatsApp), legal link labels.
2. **Homepage** — Hero (slides + copy), media mentions, sanctuaries (text + 3 images), distinction pillars, Our Story block, testimonials, Where We Go cards, experience preview, final CTA; map video + heading.
3. **Destinations** — Circuits (name, slug); Parks (full destination model: slug, name, tagline, meta, highlights, best time, camps, images, internal links).
4. **Experiences** — List + detail model (slug, name, tagline, body, highlights, CTA, image, internal links).
5. **Safari Journal** — Categories; Posts (slug, title, excerpt, category, image, body, read time).
6. **About** — Hero, story blocks, founder quote, team members, testimonials.
7. **Sustainability** — Hero, pillars, stats, image + CTA block.
8. **Plan Your Safari** — Hero, intro, concierge card (name, role, image, bio); optional form labels.
9. **Legal** — Privacy, Terms, Cookies (title, description, body per page).
10. **Schema** — Organization / travel agency fields for structured data.

Use this list to define content types, fields, and relationships in your CMS (e.g. Sanity, Contentful, Strapi, or headless WordPress), then connect the app to fetch from the CMS instead of static data files and inline constants.

---

## Backend & APIs

- **Full API specification for backend engineers:** [CMS_BACKEND_API_SPEC.md](./CMS_BACKEND_API_SPEC.md) — resources, endpoints, request/response shapes, media upload/validation, and recommended tech stack.
- **Backend language:** The frontend is Next.js (TypeScript) and consumes **JSON over REST** (or GraphQL). The CMS backend can be implemented in any language that can expose HTTP APIs and handle file uploads, for example:
  - **Node.js (TypeScript/JavaScript)** — same ecosystem as frontend; good for shared types and fast iteration.
  - **Python** (Django, FastAPI, Flask) — strong for admin tools, image/video processing (e.g. Pillow, FFmpeg wrappers).
  - **Go** — good for high-throughput uploads and transcoding services.
  - **PHP** (Laravel, headless WordPress) — if you prefer a traditional CMS with REST/GraphQL plugin.
- **Media processing:** Prefer a single stack that can validate uploads, generate image derivatives, and optionally transcode video (or delegate transcoding to a job queue / external service).
