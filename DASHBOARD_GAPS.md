# Dashboard & Frontend Wiring Gaps

Audit of the TANTREK 360 CMS dashboard (`src/app/cms/*`) and the public site, against the API contract in `src/lib/cms-api.ts` / `src/lib/public-api.ts`. Status as of this audit.

There are **three** kinds of gap. Gap A is the one that makes the CMS feel "broken" — editors that save successfully but change nothing on the live site.

---

## Gap A — Public pages that do NOT consume the API (highest priority)

A CMS edit only appears on the site if the public page fetches from the API. These pages render hardcoded content and ignore the CMS entirely:

| Public page / component | File | CMS editor exists? | Wired to API? |
|---|---|---|---|
| Footer (every page) | `src/components/Footer.tsx` | partial (Settings) | ❌ → **wiring in progress** |
| Nav / mega-menu (every page) | `src/components/Nav.tsx` | ❌ | ❌ → **wiring in progress** |
| About | `src/app/(site)/about/AboutContent.tsx` | ✅ | ❌ → **wiring in progress** |
| Sustainability | `src/app/(site)/sustainability/SustainabilityContent.tsx` | ✅ | ❌ → **wiring in progress** |
| Plan Your Safari | `src/app/(site)/plan-your-safari/page.tsx` | ✅ | ❌ → **wiring in progress** |
| Legal: privacy / terms / cookies | `src/app/(site)/{privacy-policy,terms,cookies}/page.tsx` | ✅ | ❌ → **wiring in progress** |
| Circuit pages (northern/southern/western) | `src/app/(site)/destinations/{northern,southern,western}/page.tsx` + `CircuitPageContent.tsx` | ❌ | ❌ → **wiring in progress** |

**Already correctly wired (build the backend against these with confidence):** Home, Destinations (list + detail), Experiences (list + detail), Safari Journal (list + detail).

---

## Gap B — Admin editors that don't exist yet

`cms-api.ts` exposes these. Status updated as editors are built:

| Capability | API methods | Editor page |
|---|---|---|
| **Hero slides** (add / reorder / activate / upload video+image) | `getHeroSlides`, `getAllHeroSlides`, `createHeroSlide`, `updateHeroSlide`, `reorderHeroSlides`, `deleteHeroSlide` | ✅ **built** — `/cms/hero` (upload, reorder, activate, delete) |
| **Circuits** (heroTitle / heroIntro / heroImage for each circuit) | `getCircuits`, `createCircuit`, `updateCircuit`, `deleteCircuit` | ✅ **built** — `/cms/circuits` (incl. "create defaults") |
| **Footer link columns** (Destinations / Services / Company groups + brand + newsletter) | `getFooter`, `updateFooter` | ✅ **built** — `/cms/footer` |
| **Navigation** top-level items | `getNav`, `updateNav` | ⏸ deferred — top-level nav is structural (mega-menu types are hardcoded); the mega-menu *content* is already API-driven from destinations/experiences. Build only if labels/order need to be editable. |
| **Homepage sections** below the fold | (needs `/home` content fields) | ❌ none — see Gap D |

## Gap C — Field-name mismatches — ✅ resolved against the backend

Reconciled the editors against the real backend (`TANTREK-BACK`: Prisma schema + DTOs + serializers, which emit camelCase and expect camelCase on write):

| Editor | Fixed |
|---|---|
| **Destinations** (`/cms/destinations/[slug]`) | Now sends DTO field names: `shortDescription`, `fullDescription`, `wildlife` (single text, not a list), `heroImageUrl`, `seoTitle`, `metaDescription`, `mapLat`/`mapLng` as **numbers**, `migrationNote`, `featured`, `internalLinks`. Loads from the serializer (`heroImage.url`, `circuit.slug`). Removed the unsupported free-text `gallery` array (gallery is a separate `mediaId` endpoint). |
| **Experiences** (`/cms/experiences/[slug]`) | Now sends `durationDays` (number), `priceRange`, `heroImageUrl`, `seoTitle`, `metaDescription`; dropped `short_description`, `destinations_included`, free-text `gallery` (not in the DTO). |
| **About** (`/cms/about`) | Rewritten to the `AboutContent` shape the public page consumes: hero, foundation (+tags/image), **commitments[]**, **team[]**, **testimonials[]**, founder, CTA — all via repeater editors. (`pages` is a flexible JSON blob, so this is a pure frontend alignment.) |

**Backend confirmation used:** `prisma/schema.prisma`, `destinations.dto.ts` / `experiences.dto.ts` (`CreateXDto`), `content/serializers.ts` (dual-emits admin + public field names), `pages.service.ts` (shallow-merge of content patches → section-by-section saves are safe).

Note: a NestJS `ValidationPipe` with `forbidNonWhitelisted` would have **400'd** the old payloads (`short_description`, `imageUrl`, `gallery`, …). They now match the DTO whitelist exactly.

## Gap D — Homepage sections — ✅ now editable

The `/cms/home` editor previously covered only hero copy, CTAs, map, sanctuaries, our-story, final CTA. These sections are **now wired (public reads them) and editable in `/cms/home`** via repeater editors, defaulting to the built-in copy until the CMS has data:

- Brand statement (§2) ✅ · Signature Journeys (§3) ✅ · Featured Circuits (§4) ✅ · Why Travel With Us (§5) ✅ · Accommodations (§6) ✅ · Seasonal calendar (§7) ✅ · Testimonials (§8) ✅ · Impact stats (§8) ✅ · Conservation side-notes (§9) ✅

New `/home` content fields (backend should accept/seed these): `brandEyebrow`, `brandPullquote`, `brandBody1`, `brandBody2`, `signatureJourneys[]`, `featuredCircuits[]`, `reasons[]`, `accommodations[]`, `seasons[]`, `testimonials[]`, `impactStats[]`, `conservationNote1Title/Body`, `conservationNote2Title/Body`. See the `HomeContent` interface in `src/lib/public-api.ts` for exact shapes.

> Section **headings** with the orange italic accent word (e.g. "Four ways to travel *Tantrek.*") remain styled in code; only their item arrays + intro/brand/notes copy are CMS-driven. Wiring accent-split headings is a future refinement.

---

## Recommended order of work

1. **Gap A** — wire the static public pages to the API. ✅ **Done.**
2. **Gap B** — build the missing admin editors (Hero slides, Circuits, Footer links). ✅ **Done** (Nav deferred).
3. **Gap D** — `/home` content fields + editors for the remaining homepage sections. ✅ **Done.**
4. **Gap C** — lock field names so destination/about saves round-trip correctly. ✅ **Done** — reconciled against `TANTREK-BACK` DTOs/schema.

---

**All four gaps (A–D) are now closed.** The frontend dashboard is complete and matches the backend contract. Remaining frontend follow-ups are refinements, not gaps: accent-split section headings on the homepage stay code-styled, and destination/experience **gallery** management needs a media-picker UI (the backend exposes it via `mediaId` endpoints).

> All wiring preserves the current static content as the fallback (same pattern as the homepage: `useState(STATIC)` + override on successful fetch). With `NEXT_PUBLIC_CMS_API_URL` unset, pages render exactly as today — zero visual change until the backend exists and the CMS has data.
