# TANTREK 360 Safaris — Backend Handoff (NestJS CMS API)

**Audience:** Backend engineers building the CMS API that powers the TANTREK 360 Safaris website and its admin dashboard.

**Status of the frontend:** **Complete and already wired to this API.** The public site (Next.js 14 App Router) and the admin dashboard (`/cms/*`) are built. They consume a **fixed, already-coded API contract**. Your job is to implement a backend that fulfils that contract exactly — not to redesign it. If you change a path, field name, or response envelope, the frontend breaks.

**This is a premium product.** Apply production best practices throughout: validation, RBAC, transactions, indexing, structured logging, rate limiting, idempotency where relevant, and clean migrations. Treat correctness of the **content contract** and the **seed data** as the two highest-priority deliverables.

> **The single most important requirement:** The database must be **seeded with the exact content the website shows today** — every word, every contact detail, every section of every page, and the current images as defaults. See **[SEED_DATA.md](./SEED_DATA.md)**. When an admin opens the dashboard for the first time, every field must already be populated with the live content (pulled from your API), so they *edit* existing content rather than starting from blank. The current images remain the defaults until an admin uploads replacements.

**Authoritative contract files (read these first, they are the source of truth):**
- [src/lib/cms-api.ts](./src/lib/cms-api.ts) — the **admin/write** client (every endpoint, method, payload, and TypeScript type the dashboard sends/expects).
- [src/lib/public-api.ts](./src/lib/public-api.ts) — the **public/read** client (the shapes the public website consumes, plus the fallback behaviour).

This document references the older drafts [CMS_BACKEND_API_SPEC.md](./CMS_BACKEND_API_SPEC.md) and [CMS_SECTIONS.md](./CMS_SECTIONS.md). **Where they conflict with `cms-api.ts` / `public-api.ts`, the two client files win** — they are the running code.

---

## 1. Required stack

| Concern | Technology | Notes |
|--------|-----------|-------|
| API framework | **NestJS** (Node 20, TypeScript) | Mandatory. Modular structure, DTO validation with `class-validator`, global `ValidationPipe`. |
| Database | **PostgreSQL 16** | Use TypeORM or Prisma — your choice. Migrations required (no `synchronize: true` in prod). |
| Object storage | **MinIO** (S3-compatible) | All images and videos. Buckets stored on MinIO; DB stores only metadata + object keys. **Never store binaries in Postgres.** |
| Queue / async | **Redis 7 + BullMQ** | Media transcode / image variant jobs. |
| Media processing | **ffmpeg** (video) + **sharp** (images) | Already installed in the provided `Dockerfile`. |
| Reverse proxy / TLS | **Traefik** (external `proxy-network`) | Provided compose uses Let's Encrypt cert resolver. |
| Containerisation | **Docker / docker-compose** | The compose + Dockerfile you supplied are the baseline (Section 9). |

**Domains (production, all behind Cloudflare + Traefik):**

| Host | Purpose |
|------|---------|
| `tantrek360safaris.com` / `www.tantrek360safaris.com` | Public website (Next.js) |
| `api.tantrek360safaris.com` | This CMS API (Nest) — content base is `https://api.tantrek360safaris.com/api/v1` |
| `minio.tantrek360safaris.com` | MinIO (object storage / media) |

The `docker-compose.yml`, `Dockerfile`, and MinIO/Traefik operational docs are the deployment baseline. A clean, TANTREK-branded compose + Dockerfile + env reference is in **[INFRA.md](./INFRA.md)** — use that. Keep `minio.tantrek360safaris.com` as **DNS-only (grey cloud)** in Cloudflare for large uploads (see INFRA.md).

---

## 2. Global conventions — match these exactly

### 2.1 Base URL and global prefix

The frontend builds every request as `` `${NEXT_PUBLIC_CMS_API_URL}${path}` `` where `path` is e.g. `/home`, `/auth/login`, `/destinations`.

- Set the Nest **global prefix to `api/v1`**: `app.setGlobalPrefix('api/v1')`.
- The frontend env will be `NEXT_PUBLIC_CMS_API_URL=https://api.tantrek360safaris.com/api/v1`.
- Traefik's `PathPrefix(\`/api\`)` rule already matches `/api/v1/...`, so no Traefik change is needed beyond the hostname.
- Keep `GET /api/v1/health` returning `{ status, timestamp, uptime, version }` (the dashboard pings it). The Docker healthcheck currently hits `/api/health` — align it to your actual prefix (`/api/v1/health`).

### 2.2 Response envelope (critical — the clients depend on this)

The clients (`handleRes` in `cms-api.ts`, `get`/`getList` in `public-api.ts`) accept several shapes. Pick **one consistent convention** and use it everywhere:

- **Single resource:** return either the bare object **or** `{ "data": { ... } }`. The client unwraps `data` if present.
- **Static page content** (`/home`, `/about`, `/sustainability`, `/plan-your-safari`): return `{ "content": { ...fields } }`. The client unwraps `.content`. **Writes** arrive as `PATCH /home` with body `{ "content": { ...changedFields } }` — see `updateHome` etc.
- **Paginated lists** (`/destinations`, `/experiences`, `/journal/posts`, `/media`, `/inquiries`): return the **`PaginatedList`** shape:
  ```json
  { "items": [ ... ], "total": 0, "page": 1, "limit": 20, "totalPages": 0 }
  ```
  (The admin client reads `items/total/page/limit/totalPages`. The public client is more lenient and also accepts `{ data: { items } }` / `{ data: [] }` / bare `[]`, but **standardise on `PaginatedList`**.)
- **Simple collections** the admin reads as bare arrays: `/hero`, `/hero/all`, `/circuits`, `/journal/categories` → return a **bare JSON array** (or `{ data: [...] }`).

### 2.3 Errors

Return JSON with the message under `error` or `message` (the client reads both):
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Human readable" } }
```
or simply `{ "message": "..." }`. Use correct HTTP codes: `400` validation, `401` unauthorized, `403` forbidden, `404` not found, `409` conflict (duplicate slug), `413` payload too large, `500` server.

**`401` is special:** the admin client auto-logs-out and redirects to `/cms/login` on any `401`. Only return `401` for genuinely invalid/expired tokens.

### 2.4 Other conventions
- **JSON** everywhere except media upload (multipart). Timestamps **ISO 8601**.
- **Slugs:** lowercase, `[a-z0-9-]`, unique per resource type. Public URLs use slugs; updates/deletes are addressed **by slug** for destinations/experiences/journal (see client).
- **Locale:** English only for now; structure so i18n can be added later.
- **CORS:** allow the public site origin and the admin origin (e.g. `https://www.tantrek360safaris.com`, `https://tantrek360safaris.com`). Allow `Authorization`, `Content-Type`. Credentials not required (frontend uses Bearer tokens, not cookies — see §3).

---

## 3. Authentication & authorization

The admin client authenticates with a **Bearer JWT** (not cookies). See `cms-api.ts`:

- `POST /auth/login` `{ email, password }` → `{ access_token` *(or* `token)*, user: { id, name, email, role } }`. The client accepts either `access_token` or `token`; **return `access_token`**.
- `POST /auth/register` `{ name, email, password }` → `{ id, name, email, role }` (gate this — admin-only or disable in prod).
- `GET /auth/me` → `{ id, name, email, role }`.
- Every protected request carries header `Authorization: Bearer <jwt>`. The token is held in the browser (Zustand store → sessionStorage).

**Rules:**
- **Public (no auth):** all content `GET`s consumed by the public site (`/home`, `/destinations`, `/experiences`, `/journal/*`, `/about`, `/sustainability`, `/plan-your-safari`, `/hero`, `/settings`, `/nav`, `/footer`, `/legal/*`, `/circuits`) **and** `POST /inquiries` (the contact form).
- **Protected (JWT, role `admin`/`editor`):** all create/update/delete, all `/media` upload + delete, listing/reading/updating `/inquiries`, and `/hero/all`.
- Seed an initial admin from env (`ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD`, `ADMIN_SEED_ROLE`) — already present in the compose. Hash passwords with bcrypt/argon2. Implement a Nest `AdminAuthGuard`.

> If you also expose cookie-based admin auth (`ADMIN_COOKIE_*`), it's optional: **this frontend uses Bearer JWT**, so the JWT path is the one the dashboard exercises.

---

## 4. Data model

Suggested entities (adapt naming to your ORM). Use UUID primary keys, `createdAt`/`updatedAt`, soft-delete where deletes are user-facing (destinations, experiences, posts, media).

| Entity | Key fields | Notes |
|--------|-----------|-------|
| `users` | id, name, email (unique), passwordHash, role | role ∈ `admin`,`editor`. |
| `settings` | id (singleton), siteTitle, siteDescription, keywords[], ogImage, logo, logoAlt, contactEmail, whatsappNumber, social {…}, schema {…} | One row. See SEED_DATA §Settings. |
| `nav` | items jsonb | `{ items: [{label, href}] }`. Or derive from circuits/experiences — but the dashboard edits it, so store it. |
| `footer` | content jsonb | Destination groups, services links, company links, contact block, newsletter copy. |
| `hero_slides` | id, mediaId?, src, srcWebM?, alt, label?, order, isActive | Ordered carousel. `GET /hero` = active only; `GET /hero/all` = all. |
| `media_assets` | id, type (`image`/`video`), objectKey, bucket, url, thumbnailUrl?, mediumUrl?, largeUrl?, urlWebM?, mimeType, altText?, usage?, width?, height?, size?, duration?, status (`ready`/`processing`) | MinIO-backed. See §6. |
| `circuits` | id, slug, name, heroTitle?, heroIntro?, heroImageUrl? | northern / southern / western. |
| `destinations` | id, slug, name, circuitId, tagline, shortDescription?, fullDescription?, metaDescription, highlights[], bestTime?, luxuryCamps[], migrationNote?, ecosystem?, avgTemp?, mapLat?, mapLng?, wildlife?, heroImageId?, featured, seoTitle?, seoDescription? | See SEED_DATA + `src/data/destinations.ts`. |
| `destination_gallery` | id, destinationId, mediaId, sortOrder | join. |
| `experiences` | id, slug, name, eyebrow?, tagline, metaDescription, body, highlights[], cta, durationDays?, priceRange?, heroImageId?, featured, seoTitle?, seoDescription? | See `src/data/experiences.ts`. |
| `experience_gallery` | id, experienceId, mediaId, sortOrder | join. |
| `journal_categories` | id, slug, label | 5 seeded categories. |
| `journal_posts` | id, slug, title, excerpt, categoryId, featuredImageId?, body?, author?, readTime?, published, publishedAt, seoTitle?, metaDescription? | See `src/data/safariJournal.ts`. |
| `pages` | slug (PK), content jsonb, updatedAt | Rows: `home`, `about`, `sustainability`, `plan-your-safari`. Flexible JSON matches the flat field names the frontend spreads. |
| `legal_pages` | key (PK: `privacy`/`terms`/`cookies`), title, metaDescription, body (HTML), updatedAt | |
| `inquiries` | id, name, email, phone?, message?, travelDates?, guests?, status (`new`/`read`/`replied`), createdAt | Contact-form submissions. |

**Internal links** in destinations/experiences are part of the seed content; store as a JSON column (`internalLinks: [{label, href}]`) — the dashboard/site render them.

---

## 5. Endpoint contract

Every path below is **relative to `/api/v1`**. Methods, params, and bodies are taken verbatim from the client files. Implement all of them.

### Auth & health
| Method | Path | Auth | Body / Query | Returns |
|--------|------|------|--------------|---------|
| GET | `/health` | public | — | `{ status, timestamp, uptime, version }` |
| POST | `/auth/login` | public | `{ email, password }` | `{ access_token, user }` |
| POST | `/auth/register` | admin | `{ name, email, password }` | `{ id, name, email, role }` |
| GET | `/auth/me` | JWT | — | `{ id, name, email, role }` |

### Settings / Nav / Footer
| GET | `/settings` | public | — | settings object |
| PATCH | `/settings` | JWT | partial settings | updated |
| GET | `/nav` | public | — | `{ items: [{label, href}] }` |
| PUT | `/nav` | JWT | `{ items }` | updated |
| GET | `/footer` | public | — | footer object |
| PUT | `/footer` | JWT | footer object | updated |

### Hero slides
| GET | `/hero` | public | — | `HeroSlide[]` (active, ordered) |
| GET | `/hero/all` | JWT | — | `HeroSlide[]` (all) |
| POST | `/hero` | JWT | `HeroSlideInput` | `HeroSlide` |
| PATCH | `/hero/:id` | JWT | partial `HeroSlideInput` | `HeroSlide` |
| PATCH | `/hero/reorder` | JWT | `{ slides: [{id, order}] }` | ok |
| DELETE | `/hero/:id` | JWT | — | 204 |

`HeroSlide`: `{ id, src, srcWebM?, alt, label?, order, isActive, media?:{id,url,type} }`. `HeroSlideInput`: `{ mediaId?, src?, srcWebM?, alt, label?, order?, isActive? }`.

### Media — see §6 for behaviour
| GET | `/media` | JWT | `?type=image\|video&page&limit` | `PaginatedList<MediaItem>` |
| GET | `/media/:id` | JWT | — | `MediaItem` |
| POST | `/media/images` | JWT | multipart: `file`, `altText?`, `usage?` | `MediaItem` |
| POST | `/media/videos` | JWT | multipart: `file`, `usage`(`hero`\|`map`) | `MediaItem` |
| DELETE | `/media/:id` | JWT | — | 204 (also removes objects from MinIO) |

`MediaItem`: `{ id, url, thumbnailUrl?, mediumUrl?, largeUrl?, urlWebM?, type, mimeType?, altText?, usage?, width?, height?, size?, duration?, status?, createdAt? }`.

### Circuits
| GET | `/circuits` | public | — | `Circuit[]` |
| GET | `/circuits/:slug` | public | — | `CircuitDetail` (with `destinations[]`) |
| POST | `/circuits` | JWT | `CircuitInput` | `Circuit` |
| PATCH | `/circuits/:slug` | JWT | partial | `Circuit` |
| DELETE | `/circuits/:slug` | JWT | — | 204 |

### Destinations
| GET | `/destinations` | public | `?circuit&featured&page&limit` | `PaginatedList<DestinationSummary>` |
| GET | `/destinations/:slug` | public | — | `DestinationDetail` |
| POST | `/destinations` | JWT | destination body | `DestinationDetail` |
| PATCH | `/destinations/:slug` | JWT | partial | `DestinationDetail` |
| DELETE | `/destinations/:slug` | JWT | — | 204 |
| POST | `/destinations/:slug/gallery` | JWT | `{ mediaId, sortOrder? }` | ok |
| DELETE | `/destinations/:slug/gallery/:galleryId` | JWT | — | 204 |

### Experiences (same shape as destinations)
| GET | `/experiences` | public | `?featured&page&limit` | `PaginatedList<ExperienceSummary>` |
| GET | `/experiences/:slug` | public | — | `ExperienceDetail` |
| POST / PATCH `/:slug` / DELETE `/:slug` | JWT | … | … |
| POST | `/experiences/:slug/gallery` | JWT | `{ mediaId, sortOrder? }` | ok |
| DELETE | `/experiences/:slug/gallery/:galleryId` | JWT | — | 204 |

### Journal
| GET | `/journal/page` | public | — | `{ title, intro, heroImageId? }` |
| PATCH | `/journal/page` | JWT | `{ title?, intro? }` | ok |
| GET | `/journal/categories` | public | — | `[{ id, slug, label }]` |
| POST | `/journal/categories` | JWT | `{ label, slug? }` | category |
| DELETE | `/journal/categories/:id` | JWT | — | 204 |
| GET | `/journal/posts` | public | `?page&limit&category&all` | `PaginatedList<JournalPostSummary>` |
| GET | `/journal/posts/:slug` | public | — | `JournalPostDetail` |
| POST | `/journal/posts` | JWT | post body | `JournalPostDetail` |
| PATCH | `/journal/posts/:slug` | JWT | partial | `JournalPostDetail` |
| DELETE | `/journal/posts/:slug` | JWT | — | 204 |

`?all=true` returns drafts too (admin listing). Public list returns only `published`.

### Static pages
| GET | `/home` | public | — | `{ content: HomeContent }` |
| PATCH | `/home` | JWT | `{ content: {...} }` | ok |
| GET/PATCH | `/about` | public/JWT | `{ content }` | `AboutContent` |
| GET/PATCH | `/sustainability` | public/JWT | `{ content }` | `SustainabilityContent` |
| GET/PATCH | `/plan-your-safari` | public/JWT | `{ content }` | `PlanContent` |

Field names for these content blobs are defined by the `HomeContent`/`AboutContent`/`SustainabilityContent`/`PlanContent` interfaces in `public-api.ts` and the admin form types — **use those exact keys**. Full seed values are in SEED_DATA.

### Legal
| GET | `/legal/:key` | public | `key`∈`privacy`,`terms`,`cookies` | `{ title, metaDescription, body }` (HTML) |
| PATCH | `/legal/:key` | JWT | partial | ok |

### Inquiries (contact form)
| POST | `/inquiries` | **public** | `{ name, email, phone?, message, travelDates?, groupSize?, budget? }` | `{ success: true }` |
| GET | `/inquiries` | JWT | `?page&limit&status` | `PaginatedList<Inquiry>` |
| GET | `/inquiries/:id` | JWT | — | `Inquiry` |
| PATCH | `/inquiries/:id/status` | JWT | `{ status }` | ok |
| DELETE | `/inquiries/:id` | JWT | — | 204 |

> Note: the public `submitInquiry` sends `groupSize`/`budget`; the admin `Inquiry` type reads `guests`/`travelDates`. Accept the public field names on write, store them, and map to the admin read shape. Consider also emailing `contactEmail` / forwarding to WhatsApp on new inquiries (nice-to-have).

---

## 6. Media pipeline (MinIO)

The frontend uploads via **multipart** (`POST /media/images`, `POST /media/videos`) and expects back a `MediaItem` whose **`url` is a stable, directly-renderable URL**. Critically: the site and CMS **persist `url` strings** into content (e.g. `heroImage.url`, `ourStoryBgImage`, slide `src`). Therefore:

### 6.1 Serve STABLE URLs — do not persist expiring presigned URLs
The published content stores the returned `url`. If you hand back a short-lived presigned GET URL, images break after the TTL (this exact bug is documented in your media docs — "poster stopped working after deploy"). **Two acceptable strategies — pick one and be consistent:**

1. **Public-read bucket + CDN host (recommended for this frontend).** Make CMS media objects publicly readable and return a permanent URL like `https://minio.tantrek360safaris.com/<bucket>/<objectKey>`. Put a CDN / long `Cache-Control` in front (Traefik/Cloudflare). Simple, fast, matches how the frontend renders media in `<img>`, `<video>`, and CSS `background-image`.
2. **Stable API redirect.** Return `url = https://api.tantrek360safaris.com/api/v1/media/:id/raw`, and implement `/media/:id/raw` as a 302 redirect to a freshly-signed short-lived MinIO GET URL. The stored string never expires; the signature is generated per request.

Either way, **`MediaItem.url` must remain valid indefinitely** for already-saved content. Add the MinIO public host to the frontend's `next.config.mjs` `images.remotePatterns` (coordinate with frontend).

### 6.2 Upload flow (server-side, multipart)
1. Receive `file` (+ `altText`/`usage`). Validate type & size (§6.4).
2. Stream to MinIO under a deterministic key, e.g. `cms/<uuid>-<safe-filename>`.
3. Create `media_assets` row; return `MediaItem` with stable `url`.
4. If `MEDIA_AUTO_TRANSCODE=true`, enqueue a BullMQ job and return `status: "processing"`; otherwise `status: "ready"`. The `MediaItem` type carries `status` and the dashboard can poll `GET /media/:id`.

> The provided MinIO docs also describe a **presign → browser PUT → complete → poll** flow for very large videos. That is an **optional enhancement** for huge CEO-style clips and is **not** what the current frontend calls. Implement the multipart endpoints first (that's the contract); add presign later if large uploads need it. If you add it, store only the media **id** in content and resolve URLs fresh — never the presigned string.

### 6.3 Async variants (BullMQ + Redis)
- **Images (sharp):** generate WebP renditions → populate `thumbnailUrl`, `mediumUrl`, `largeUrl` (e.g. w400/w800/w1600, no upscale).
- **Video (ffmpeg):** 720p H.264 + AAC (`+faststart`), JPEG poster (~1s). Store both; on completion set `status: "ready"`.
- Worker concurrency 1, long lock duration for big files. Normalise storage errors to stable `ERR_STORAGE_*` / `ERR_TRANSCODE_*` strings.

### 6.4 Validation (enforce server-side; see CMS_SECTIONS.md for the premium media rules)
- **Images:** JPEG/PNG/WebP (SVG only for logo). Size caps by `usage` (hero ~800KB JPEG / 500KB WebP, card ~450KB, logo ~200KB). Auto-resize above max width (e.g. 1920px).
- **Video:** MP4 (H.264). `MAX_VIDEO_SIZE_MB` (default 500). Reject > 1920×1080; recommend 1080p/720p.
- Surface clear validation errors so the dashboard can show them.

### 6.5 Bucket CORS
Presigned **PUT** uploads (if used) require **bucket CORS** allowing the site origin (`GET,PUT,HEAD,OPTIONS`). For the multipart path the file goes through Nest so CORS on the API (not the bucket) is what matters. Full CORS + Traefik timeout guidance is in the media docs you supplied.

---

## 7. Seed data & the fallback model (highest priority)

The website currently renders from **hardcoded static content** inside the React components, with the API layered on top:

```ts
// homepage pattern (src/app/(site)/page.tsx)
const [home, setHome] = useState(STATIC_HOME);          // baked-in current copy
useEffect(() => {
  publicApi.getHomeContent().then(v => v && setHome({ ...STATIC_HOME, ...v })); // API overrides
});
```

Likewise `public-api.ts` returns `null` on any error and **every page falls back to its static content**. This is the safety net during cutover.

**Your seed must reproduce that static content in the database**, so that:
1. **Public site:** once `NEXT_PUBLIC_CMS_API_URL` is set, the API returns the *same* content the site shows today — visitors see no change.
2. **Admin dashboard:** opening any editor (e.g. `/cms/home`) loads the current content into the form (the dashboard does `getHome().then(d => setForm({ ...EMPTY, ...d }))`). The admin edits **real existing copy**, never blanks.
3. **Images:** seed the current image references (local `/public/*` files and the current Unsplash URLs) as the default `url` values. They keep working until an admin uploads a replacement via `/media/*`, at which point the new MinIO `url` is saved.

**Where the current content lives (your seed source):**
- Global / contact / footer / nav / homepage / about / sustainability / plan / legal copy → fully transcribed in **[SEED_DATA.md](./SEED_DATA.md)**.
- Destinations (7) → [src/data/destinations.ts](./src/data/destinations.ts) (+ circuits map).
- Experiences (5) → [src/data/experiences.ts](./src/data/experiences.ts).
- Journal categories (5) + posts (6) → [src/data/safariJournal.ts](./src/data/safariJournal.ts).
- Homepage section copy not yet in the API (signature experiences, featured circuits, "why travel", accommodations, seasons, testimonials, impact stats) → transcribed in SEED_DATA so nothing is lost when these sections become CMS-managed.

**Implementation:** ship an idempotent seeder (Nest command / migration) that upserts this content on first boot. The compose mounts `seed.json` into the image (`COPY seed.json ./seed.json`) — you can drive the seeder from that file. Re-running must not duplicate rows (upsert by slug/key).

---

## 8. Admin dashboard expectations

The dashboard already exists under `src/app/cms/*` and calls `cmsApi`. For it to behave well:
- **Every editor must load existing values** (see §7.2). After seeding, no form should be empty.
- **Section-level saves:** the homepage editor saves each section independently via `PATCH /home { content: { ...onlySomeFields } }`. Your `PATCH` must **merge** into the stored JSON (partial update), not replace the whole blob. Same for `/about`, `/sustainability`, `/plan-your-safari`, `/settings`.
- **Media library** (`/cms/media`) lists via `GET /media?type=...&page=...` and uploads via the multipart endpoints; return `PaginatedList<MediaItem>`.
- **List → edit by slug:** destinations/experiences/journal editors fetch by slug and PATCH by slug; "new" creates via POST.
- Return updated resources from POST/PATCH so the UI can reflect saved state.

---

## 9. Infrastructure

Full TANTREK-branded `docker-compose.yml`, `Dockerfile`, and `.env` reference are in **[INFRA.md](./INFRA.md)**. Services: `api` (Nest, Traefik-routed at `api.tantrek360safaris.com`), `minio` + `minio-init` (bucket bootstrap, `minio.tantrek360safaris.com`), `postgres`, `redis`. Key points:
- MinIO internal alias **`tantrek-minio-s3`** (hyphens only — minio-js rejects underscored hosts). `MINIO_ENDPOINT` (internal, Nest → `statObject`/upload) must point at this alias; `MINIO_PUBLIC_ENDPOINT=minio.tantrek360safaris.com` is the **browser-reachable** host. Both target the **same** MinIO + bucket.
- Postgres init SQL mounted at `docker/postgres/init.sql`; data persisted in named volumes.
- Healthcheck path must match the global prefix (`/api/v1/health`).
- `minio.tantrek360safaris.com` is **DNS-only (grey cloud)** in Cloudflare so large video uploads aren't capped by the CF proxy; raise Traefik responding/idle timeouts on the MinIO router (guidance in INFRA.md and the supplied media docs).

### Environment variables (Nest API)
Already in the compose; the API must read:
`NODE_ENV`, `DB_*`, `REDIS_HOST/PORT`, `ADMIN_SEED_EMAIL/PASSWORD/ROLE`, `MINIO_ENDPOINT/PORT/USE_SSL`, `MINIO_PUBLIC_ENDPOINT/PORT/USE_SSL`, `MINIO_ACCESS_KEY/SECRET_KEY/BUCKET`, `MEDIA_NAMESPACE`, `MEDIA_PRESIGN_PUT_TTL_SEC`, `MEDIA_PRESIGN_GET_TTL_SEC`, `MAX_VIDEO_SIZE_MB`, `MEDIA_AUTO_TRANSCODE`, `CORS_ORIGIN`, plus a **`JWT_SECRET`** + token TTL you must add for auth.

---

## 10. Best-practices checklist (premium quality bar)

- [ ] NestJS modular architecture; global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`); DTOs with `class-validator`.
- [ ] Migrations checked in; **no auto-sync** in production. Indexes on every `slug`, `email`, FK, and `inquiries.status`/`createdAt`.
- [ ] RBAC guard (`admin`/`editor`); passwords hashed (argon2/bcrypt); JWT with sane expiry; refresh strategy if needed.
- [ ] Transactions for multi-row writes (e.g. hero reorder, gallery ops).
- [ ] Rate-limit `POST /inquiries` and `POST /auth/login` (anti-abuse, anti-brute-force).
- [ ] Sanitize rich-text/HTML (journal body, legal body) to prevent stored XSS.
- [ ] Structured logging (pino/winston) + request IDs; `/health` covers DB + Redis + MinIO reachability.
- [ ] Consistent response envelope & error shape (§2).
- [ ] Media: never proxy large blobs through Nest for reads; stable URLs; long cache headers; async variants.
- [ ] Idempotent seeder; current copy + images seeded exactly (§7).
- [ ] CORS restricted to known origins; secrets only via env; OpenAPI/Swagger published for the team.
- [ ] Pagination defaults sane (`limit` default 20; public clients request up to 50).

---

## 11. Acceptance criteria (definition of done)

1. With `NEXT_PUBLIC_CMS_API_URL` pointed at the API, **the public site renders identically to today** (seed = current content & images).
2. Logging into `/cms` and opening **every** editor shows **pre-filled current content** (no blank forms).
3. Editing any field/section and saving **persists** and is reflected on the public site within the 30s ISR window.
4. Uploading a new image/video in `/cms/media` stores it in MinIO and returns a **stable URL**; assigning it to a section and saving makes it appear on the site and **keeps working** after a redeploy / past any presign TTL.
5. Deleting media removes both the DB row and the MinIO objects.
6. Contact form (`POST /inquiries`) creates an inquiry visible in `/cms/inquiries`.
7. All endpoints in §5 implemented with the documented shapes; `401` only on real auth failure.
8. Runs under the provided Docker/Traefik/MinIO/Postgres/Redis stack with TLS.

---

**Start here:** read `src/lib/cms-api.ts` and `src/lib/public-api.ts` end-to-end, then `SEED_DATA.md`. Build the schema, implement the contract, seed the content, wire MinIO with stable URLs. Ping the frontend team for the exact production origins and to register the MinIO host in `next.config.mjs`.
