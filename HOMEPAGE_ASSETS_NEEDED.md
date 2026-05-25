# Homepage — Assets To Source

The homepage redesign uses existing `/public/tour*.webp` images as visual
placeholders so layouts render during development. For the redesign to land
at luxury-safari quality, the client should source and drop in the
following images. Filenames are suggestions; the swap is a one-line edit
in `src/app/(site)/page.tsx`.

---

## Hero (Section 1)

Existing hero videos work well. Optional upgrades:

- `/hero-serengeti-dawn.mp4` — sweeping aerial of Serengeti at first light
- `/hero-mahale-chimps.mp4` — Mahale chimps in the canopy
- `/hero-zanzibar-dhow.mp4` — traditional dhow at sunset off Zanzibar

Captions are already wired per-slide (`STATIC_HERO_SLIDES`).

---

## Signature Safari Experiences (Section 3)

Asymmetric 4-tile magazine grid. Feature tile (left) is large; three
smaller tiles stack on the right.

| Slot | Filename | Subject |
|---|---|---|
| Feature (large) | `/signature-flyin.jpg` | Light aircraft on a bush airstrip, golden hour |
| Stack 1 | `/signature-honeymoon.jpg` | Couple at a candlelit bush dinner under stars |
| Stack 2 | `/signature-photography.jpg` | Photographer's bean-bag setup, golden-hour leopard |
| Stack 3 | `/signature-diaspora.jpg` | Authentic community / conservation moment, real interaction |

---

## Featured Destinations (Section 4)

Tanzania's three circuits — each tile is a full-bleed editorial image.

| Circuit | Filename | Subject |
|---|---|---|
| Northern | `/circuit-northern-serengeti.jpg` | Wide Serengeti plain with migration line in distance |
| Southern | `/circuit-southern-ruaha.jpg` | Ruaha baobab landscape at dusk |
| Western | `/circuit-western-katavi.jpg` | Katavi hippo pod or Mahale lakeshore |

---

## Why Travel With Tantrek (Section 5)

Editorial portrait tile on the left.

- `/why-tantrek-field.jpg` — editorial portrait of a Tantrek guide or
  founder in the field (vehicle, binoculars, golden hour); 4:5 aspect.
  Quote overlay reads: *"The best safari is the one you'd never have
  planned alone."* — replace this caption in code if a real attributed
  quote is provided.

---

## Luxury Accommodation Showcase (Section 6)

One feature lodge + two stacked. Names in code are placeholder examples
(Singita Faru Faru / Jabali Ridge / Chumbe Island) — replace with actual
partner camps once partnerships are confirmed.

| Slot | Filename | Subject |
|---|---|---|
| Feature lodge | `/lodge-feature.jpg` | Hero camp shot — open-fronted suite, golden-hour terrace |
| Stack 1 | `/lodge-2.jpg` | Camp set against landscape (kopje, riverbank, etc.) |
| Stack 2 | `/lodge-3.jpg` | Coastal or island bungalow, turquoise water |

**Action item for client:** confirm the 3 lodges to feature so we can
write accurate copy in `ACCOMMODATIONS` (currently uses placeholder
names + descriptions).

---

## Conservation & Heritage (Section 9)

Uses the CMS-driven `ourStoryBgImage` field (currently defaults to
`/tour8.webp`). Recommended replacement:

- `/conservation-hero.jpg` — wide community + landscape moment that
  signals partnership rather than spectacle (e.g., guides + village
  scene at the edge of a conservancy)

---

## Concierge CTA (Section 10)

Uses `/tour8.webp` as background placeholder.

- `/cta-final-landscape.jpg` — a hero golden-hour Tanzania landscape;
  intentionally quiet (no animals or people) so the CTA copy sits forward

---

## Optional copy items the client should also provide

- **Real testimonials** — three are placeholder voices in `TESTIMONIALS`.
  Replace with attributed traveler quotes once consented.
- **Real lodge names + 1-line blurbs** — see Section 6 note above.
- **Founder quote** — to replace the placeholder "The best safari is the
  one you'd never have planned alone." in Section 5.
- **Impact stats** — `IMPACT_STATS` shows `12+ years`, `40+ partners`,
  `300+ journeys`. Confirm actual numbers.

---

# Other pages — assets added in this pass

## Plan-Your-Safari (concierge reframe)

- `/plan-designer-portrait.jpg` — editorial portrait of a Tantrek
  safari designer at work in the field (vehicle, binoculars, or in
  conversation with a guest). Currently uses `/tour6.webp` as
  background and an Unsplash portrait for the designer avatar.
- **Real safari designer name + bio** — the card currently reads "A
  small Tanzanian team / Owner-led · Tanzania-based" as a generic
  placeholder. Replace with a real person once confirmed.

## Nav mega-menu

Pulls images automatically from `src/data/destinations.ts` (per-park
`imageUrl`) and `src/data/experiences.ts` (per-journey `imageUrl`).
These currently point to Unsplash. To make the menu fully
brand-owned, replace each `imageUrl` field with locally-hosted
photography.

---

# Interactive Tanzania Map (new — /destinations page)

The map is hand-drawn in SVG and intentionally stylized — it reads as
Tanzania but is not survey-accurate. Two follow-up tasks that need
client input:

## Park coordinates

Approximated by region in `src/components/InteractiveTanzaniaMap.tsx`
(`PARK_COORDS`). They cluster correctly (Northern in the top-centre,
Southern around the centre-east, Katavi in the west) but a guide could
nudge them to be a touch more accurate without changing the visual.

If you want to switch to a real geographic basemap (so park positions
are lat/lng-correct), I'd recommend swapping the SVG outline for a
simplified GeoJSON of Tanzania's border and converting park lat/lng
through a small projection helper. Not done in this pass — it's a
moderate piece of work and the stylized version reads fine.

## Outline path

The outline is in `TANZANIA_OUTLINE_PATH` (same file). To replace with
a real border, drop in a single SVG path string from any GeoJSON of
Tanzania run through `svgo` — same viewBox (`0 0 600 620`) keeps the
park coordinates valid.
