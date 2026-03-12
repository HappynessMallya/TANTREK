# CMS Backend API Specification

This document is for **backend engineers** building the CMS APIs that the Tanzania Wildmakers Safari frontend (Next.js) will consume. It defines resources, endpoints, request/response shapes, media rules, and implementation notes.

**Related docs:** [CMS_SECTIONS.md](./CMS_SECTIONS.md) lists every section that needs CMS content and includes **media upload guidelines** (image/video types, sizes, best practices). Enforce those rules in your upload and validation APIs.

------

## 1. Overview

- **Frontend:** Next.js 14 (App Router), TypeScript. Fetches content via HTTP; expects **JSON**.
- **API style:** REST preferred (optional: GraphQL if you prefer a single endpoint and flexible queries).
- **Base URL:** e.g. `https://api.example.com/v1` or `https://cms.tanzaniawildmakersafari.com/api/v1`. Frontend will use env var `NEXT_PUBLIC_CMS_API_URL`.
- **Auth:** Admin/write operations (create, update, delete, upload) require auth (e.g. JWT or API key). **Read (GET)** endpoints that return public website content can be unauthenticated; optionally protect by API key for rate limiting.

---

## 2. Backend language and stack

The CMS backend can be implemented in any language that supports HTTP APIs and file handling. Recommended options:

| Language / runtime | Suited for | Notes |
|-------------------|------------|--------|
| **Node.js (TypeScript)** | Full-stack team, shared types with frontend | Use Express or NestJS; reuse DTOs/types with Next.js. |

**Recommendation:** Use one stack for **API + auth** and, if needed, a separate **media pipeline** (e.g. Node/Python for API, worker in Python/Go for image resize and video transcode). All responses must be **JSON** with consistent error format (see below).

---

## 3. General conventions

- **JSON** for all request bodies (where applicable) and responses. `Content-Type: application/json`.
- **Timestamps:** ISO 8601 (e.g. `2025-03-06T14:00:00Z`).
- **Slugs:** Lowercase, alphanumeric and hyphens only; unique per resource type (e.g. destinations, experiences, posts).
- **Errors:** HTTP status + JSON body, e.g. `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }`.
- **Pagination:** For list endpoints use `?page=1&limit=20` (or `offset`/`limit`). Response: `{ "data": [...], "meta": { "total": 100, "page": 1, "limit": 20 } }`.
- **Localization:** Current scope is **English** only. API can expose `Accept-Language` or `?locale=en` for future i18n; for now a single default locale is enough.

---

## 4. API resources and endpoints

Below are the **resources** the frontend needs. Implement at least these endpoints (method, path, and main payload). IDs can be UUID or numeric; use `slug` for public-facing URLs.

### 4.1 Global / settings

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/settings` or `/global` | Site-wide settings | Single object: `siteTitle`, `siteDescription`, `keywords[]`, `ogImage`, `logo` (url), `logoAlt`, `contactEmail`, `whatsappNumber`, `footerTagline`, `footerDescription`, `footerLocation`, `copyrightText`, `schemaOrganizationName`, `schemaLogoUrl`, `schemaDescription`, `sameAs[]` (social URLs). |
| PUT or PATCH | `/settings` | Update global settings | Same shape as GET; validate lengths and URLs. |

**Navigation and footer links** can be part of settings (nested JSON) or separate:

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/nav` or `/settings/nav` | Main navigation | `{ "items": [ { "label", "href" } \| { "label", "children": [ { "label", "href" } ] } ] }`. Destinations can be built from circuits + parks (see below). |
| GET | `/footer` or `/settings/footer` | Footer link groups | `{ "destinationSections": [ { "heading", "links": [ { "label", "href" } ] } ], "experienceLinks": [...], "companyLinks": [...] }`. |

---

### 4.2 Homepage

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/home` or `/pages/home` | Homepage content | Single object. Suggested shape: |

```json
{
  "heroSlides": [
    { "src": "https://cdn.../tembo.mp4", "srcWebM": "https://cdn.../tembo.webm", "alt": "...", "label": "The Wild", "order": 1 }
  ],
  "heroSlideDurationMs": 7000,
  "heroEyebrow": "Est. 2010 • Private & Exclusive",
  "heroHeadline": "Where Untamed Wild Meets Refined Luxury",
  "heroSubhead": "Private safaris across...",
  "heroCtaPrimary": { "label": "Begin Your Journey", "href": "/plan-your-safari" },
  "heroCtaSecondary": { "label": "Explore Our Sanctuaries", "href": "/destinations" },
  "mapVideoUrl": "https://cdn.../map.mp4",
  "mapVideoWebM": "https://cdn.../map.webm",
  "mapHeading": "Discover Tanzania's Untamed Frontiers",
  "mediaMentions": [ { "name": "Condé Nast Traveler", "logoUrl": null, "linkUrl": null } ],
  "sanctuaries": {
    "eyebrow": "Our destinations",
    "title": "Sanctuaries of The Wild",
    "body": "...",
    "ctaLabel": "Explore our sanctuaries",
    "ctaHref": "/destinations",
    "imageLodge": { "url": "...", "alt": "..." },
    "imageWild": { "url": "...", "alt": "..." },
    "imageSafari": { "url": "...", "alt": "..." }
  },
  "distinctionPillars": [
    { "icon": "diamond", "title": "Bespoke Curation", "copy": "..." }
  ],
  "ourStory": {
    "eyebrow": "Our Story",
    "quote": "We are wilderness architects.",
    "body": "...",
    "ctaLabel": "Our Story",
    "ctaHref": "/about",
    "backgroundImageUrl": "..."
  },
  "testimonials": [
    { "quote": "...", "name": "...", "trip": "...", "initials": "S & J" }
  ],
  "whereWeGoCards": [
    { "title": "Northern Circuit", "desc": "...", "href": "/destinations/northern", "backgroundImageUrl": "..." }
  ],
  "experiencesSection": { "eyebrow": "Curated journeys", "heading": "..." },
  "finalCta": { "headline": "...", "subcopy": "...", "buttonLabel": "...", "buttonHref": "..." }
}
```

| PUT or PATCH | `/home` | Update homepage | Same shape; validate media URLs and sizes per CMS_SECTIONS.md. |

---

### 4.3 Destinations

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/circuits` | List circuits | `{ "data": [ { "id", "slug", "name" } ] }`. |
| GET | `/circuits/:slug` | Single circuit | `{ "id", "slug", "name" }`. |
| GET | `/destinations` | List all parks (optional query: `?circuit=northern`) | `{ "data": [ { "id", "slug", "name", "circuit", "tagline", "metaDescription", "highlights", "bestTime", "luxuryCamps", "migrationNote", "ecosystem", "avgTemp", "imageUrl", "internalLinks" } ] }`. |
| GET | `/destinations/:slug` | Single destination by slug | Full destination object. |
| POST | `/destinations` | Create destination | Body: same fields; respond with created resource. |
| PUT/PATCH | `/destinations/:id` or `/:slug` | Update destination | Body: partial or full; respond with updated resource. |
| DELETE | `/destinations/:id` or `/:slug` | Delete (soft or hard) | 204 or 200. |

**Destination object shape (minimal):**

```json
{
  "id": "uuid-or-int",
  "slug": "serengeti",
  "name": "Serengeti National Park",
  "circuit": "northern",
  "tagline": "...",
  "metaDescription": "...",
  "highlights": [ "..." ],
  "bestTime": "...",
  "luxuryCamps": [ "..." ],
  "migrationNote": "...",
  "ecosystem": "...",
  "avgTemp": "...",
  "imageUrl": "https://cdn.../image.webp",
  "internalLinks": [ { "label": "...", "href": "/destinations/..." } ]
}
```

**Circuit page / index content** (hero, title, intro) can be:

- GET `/circuits/:slug/page` or GET `/destination-pages/circuit/:slug`, or
- Embedded in circuit + a “page content” table keyed by circuit slug.

---

### 4.4 Experiences

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/experiences` | List experiences | `{ "data": [ { "id", "slug", "name", "tagline", "metaDescription", "body", "highlights", "cta", "internalLinks", "imageUrl", "eyebrow" } ] }`. |
| GET | `/experiences/:slug` | Single experience | Full experience object. |
| POST | `/experiences` | Create | Body: same fields. |
| PUT/PATCH | `/experiences/:id` or `/:slug` | Update | Body: partial or full. |
| DELETE | `/experiences/:id` or `/:slug` | Delete | 204 or 200. |

**Experience object:** `slug`, `name`, `tagline`, `metaDescription`, `body` (HTML or markdown), `highlights[]`, `cta`, `internalLinks[]`, `imageUrl`, `eyebrow`.

---

### 4.5 Safari Journal (blog)

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/journal/categories` | List categories | `{ "data": [ { "slug", "label" } ] }`. |
| GET | `/journal/posts` | List posts (paginated; optional `?category=slug`) | `{ "data": [...], "meta": { "total", "page", "limit" } }`. |
| GET | `/journal/posts/:slug` | Single post | `{ "slug", "title", "excerpt", "category", "image", "imageAlt", "readTime", "body", "publishedAt" }`. |
| POST | `/journal/posts` | Create post | Body: same fields. |
| PUT/PATCH | `/journal/posts/:id` or `/:slug` | Update | Body: partial or full. |
| DELETE | `/journal/posts/:id` or `/:slug` | Delete | 204 or 200. |

**Journal index page:** e.g. GET `/journal/page` or include hero/title in settings — return `{ "heroImageUrl", "title", "intro" }`.

---

### 4.6 About

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/about` or `/pages/about` | About page content | `{ "heroImageUrl", "headline", "subhead", "storyBody", "founderQuote", "team": [ { "name", "role", "imageUrl", "alt" } ], "testimonials": [ { "quote", "name", "location" } ] }`. |
| PUT/PATCH | `/about` | Update | Same shape. |

---

### 4.7 Sustainability

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/sustainability` or `/pages/sustainability` | Sustainability page | `{ "heroImageUrl", "headline", "subhead", "pillars": [ { "title", "body", "cta", "href", "icon" } ], "stats": [ { "value", "label", "icon" } ], "imageBreak": { "imageUrl", "headline", "copy", "buttonLabel", "buttonHref" } }`. |
| PUT/PATCH | `/sustainability` | Update | Same shape. |

---

### 4.8 Plan Your Safari

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/plan-your-safari` or `/pages/plan-your-safari` | Plan page content | `{ "backgroundImageUrl", "eyebrow", "headline", "intro", "concierge": { "name", "role", "imageUrl", "bio" } }`. Optional: form field labels/placeholders. |
| PUT/PATCH | `/plan-your-safari` | Update | Same shape. |

---

### 4.9 Legal pages

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/legal/privacy` | Privacy policy | `{ "title", "metaDescription", "body" }` (body = HTML string). |
| GET | `/legal/terms` | Terms of use | Same. |
| GET | `/legal/cookies` | Cookie policy | Same. |
| PUT/PATCH | `/legal/privacy`, `/legal/terms`, `/legal/cookies` | Update | Same shape. |

---

## 5. Media upload API

Backend must accept file uploads, validate type/size/dimensions, and return a **public URL** (CDN) for the frontend to use. Enforce the rules in [CMS_SECTIONS.md](./CMS_SECTIONS.md#media-upload-guidelines-images--video).

### 5.1 Image upload

| Method | Path | Description | Request | Response |
|--------|------|-------------|----------|----------|
| POST | `/media/images` or `/upload/image` | Upload image | `multipart/form-data`: `file` (required), optional `alt`, `usage` (e.g. `hero`, `logo`, `card`, `team`). | `{ "url": "https://cdn.../xyz.webp", "width", "height", "alt" }`. Optionally return `urls`: `{ "640": "...", "1024": "...", "1920": "..." }` for responsive. |

**Validation (backend):**

- **Allowed types:** JPEG, PNG, WebP; SVG for logo only.
- **Max size:** By usage (see CMS_SECTIONS.md) — e.g. hero 800 KB (JPEG), 500 KB (WebP); logo 200 KB; card 450 KB (JPEG).
- **Dimensions:** Reject or auto-resize if above max (e.g. 1920px width for heroes). Logo: height 72–96px equivalent.
- **Alt:** If `usage` requires alt, validate non-empty when provided; store with asset.

**Processing (backend):**

- Generate WebP (and keep JPEG/PNG if uploaded).
- Generate responsive widths (e.g. 640, 1024, 1920) for heroes/cards.
- Store in object storage (S3, GCS, etc.) and serve via CDN; return CDN URL(s).

### 5.2 Video upload

| Method | Path | Description | Request | Response |
|--------|------|-------------|----------|----------|
| POST | `/media/videos` or `/upload/video` | Upload video | `multipart/form-data`: `file` (required), `usage` (`hero` \| `map`). | `{ "url": "https://cdn.../clip.mp4", "urlWebM": "https://cdn.../clip.webm", "duration", "width", "height" }`. |

**Validation (backend):**

- **Allowed types:** MP4 (H.264). Optional: accept WebM upload or generate WebM server-side.
- **Max size:** 6–8 MB for hero and map (strict); optionally allow up to 15–20 MB for map with warning.
- **Resolution:** Reject if &gt; 1920×1080; recommend 1080p.
- **Duration:** Optional max (e.g. 60 s for hero, 120 s for map).

**Processing (backend):**

- Transcode to WebM (VP9) for smaller size; store both MP4 and WebM; return both URLs so frontend can use `<source type="video/webm">` and `<source type="video/mp4">`.
- Use FFmpeg (or similar) in a job queue so upload responds quickly and transcoding runs async.
- Serve files from CDN only; do not stream from app server.

### 5.3 Logo

Can use same image upload endpoint with `usage: "logo"` and enforce logo-specific rules (PNG/SVG, size, dimensions). Return single URL (and optional `alt`).

---

## 6. Error responses

Use a consistent JSON shape for errors:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Image exceeds max size for hero (800 KB).",
    "details": [
      { "field": "file", "message": "File size 1.2 MB exceeds 800 KB." }
    ]
  }
}
```

**Suggested HTTP status codes:** 400 validation, 401 unauthorized, 403 forbidden, 404 not found, 413 payload too large (for uploads), 500 server error.

---

## 7. Summary checklist for backend

- [ ] Expose REST (or GraphQL) API with base URL and version.
- [ ] Implement **GET** endpoints for all content (settings, home, circuits, destinations, experiences, journal, about, sustainability, plan-your-safari, legal).
- [ ] Implement **write** endpoints (create/update/delete) for each resource; protect with auth.
- [ ] **Media upload:** POST endpoint(s) for image and video; validate type, size, dimensions per CMS_SECTIONS.md; return CDN URLs.
- [ ] **Image processing:** Generate WebP and responsive widths; store in object storage; serve via CDN.
- [ ] **Video processing:** Accept MP4; optionally generate WebM (VP9); store both; return both URLs; serve via CDN.
- [ ] Enforce **slug** uniqueness per resource; validate and sanitize **rich text** (HTML).
- [ ] **Language:** All content is English; API can accept `locale` for future i18n.
- [ ] Document **media limits** (formats, sizes, dimensions) in CMS admin UI so editors see constraints; surface validation errors from API in the UI.
- [ ] Use **JSON** responses and consistent **error format**; optional **pagination** for lists (destinations, experiences, journal posts).

This spec, together with [CMS_SECTIONS.md](./CMS_SECTIONS.md), gives backend engineers everything needed to design and implement the CMS APIs and media pipeline for high performance on both backend and frontend.
