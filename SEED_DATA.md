# SEED_DATA — current TANTREK 360 content to seed the database

This is the **exact content the website shows today**. Seed every value here so the public site is unchanged after cutover and the admin dashboard opens pre-filled. Companion to **[BACKEND_HANDOFF.md](./BACKEND_HANDOFF.md)** (§7).

**Conventions used below:** field names match the `*Content` interfaces in [src/lib/public-api.ts](./src/lib/public-api.ts) and the admin form types. Image values are the **current defaults** — local `/public/*` files and the live Unsplash URLs — which remain until an admin uploads replacements via `/media/*`. Local files (`/tembo.mp4`, `/tour1.webp`, `/land.jpg`, …) live in [public/](./public/); on the backend, either keep them served by the frontend's `/public` (relative URLs) or upload them to MinIO during seeding and store the resulting URLs. **Relative `/...` URLs are fine to seed as-is** — the frontend resolves them against its own origin.

Brand name: **TANTREK 360 Safaris**. Tagline: **Beyond Routes. Beyond Maps.**

---

## Settings (singleton) — `/settings`

```json
{
  "siteTitle": "TANTREK 360 Safaris | Beyond Routes. Beyond Maps.",
  "siteTitleTemplate": "%s | TANTREK 360 Safaris",
  "siteDescription": "TANTREK 360 unites curated safari experiences with business and investment facilitation across Tanzania. End-to-end support for investors, diaspora, entrepreneurs, and global professionals.",
  "keywords": [
    "TANTREK 360",
    "Tanzania safari",
    "investment safari Tanzania",
    "business tours Tanzania",
    "diaspora opportunity tours",
    "bush and beach Tanzania",
    "luxury safari Tanzania",
    "Tanzania investment facilitation"
  ],
  "ogImage": "/icon-512.png",
  "ogTitle": "TANTREK 360 Safaris",
  "ogDescription": "Curated safari experiences for investors, entrepreneurs, and global professionals — combining tourism with real access to Tanzania's opportunities.",
  "logo": "/logo.png",
  "logoFooter": "/logo-footer.png",
  "logoAlt": "TANTREK 360 Safaris",
  "contactEmail": "info@tantrek360safaris.com",
  "whatsappNumber": "+34 637 04 86 15",
  "whatsappNumberRaw": "34637048615",
  "whatsappUrl": "https://wa.me/34637048615",
  "locations": "Tanzania • Spain",
  "copyrightText": "© {year} TANTREK 360 Safaris. All rights reserved."
}
```

> The contact channels are used in many places (footer, homepage CTA, Plan-Your-Safari form, WhatsApp float). WhatsApp number raw = `34637048615`; email = `info@tantrek360safaris.com`. Locations line = **"Tanzania • Spain"**.

---

## Navigation — `/nav`

Top-level nav (mega-menus for Destinations & Journeys are built from circuits/experiences):
```json
{
  "items": [
    { "label": "Destinations", "type": "destinations" },
    { "label": "Journeys", "type": "journeys" },
    { "label": "Journal", "href": "/safari-journal" },
    { "label": "About", "href": "/about" },
    { "label": "Impact", "href": "/sustainability" }
  ],
  "ctaLabel": "Begin Your Journey",
  "ctaHref": "/plan-your-safari"
}
```

---

## Footer — `/footer`

```json
{
  "brandTagline": "A 360° integrated ecosystem of travel, business, and investment in Tanzania.",
  "brandDescription": "Connecting investors, diaspora, entrepreneurs, and global professionals to Tanzania's wilderness — and its real opportunities.",
  "brandSubline": "Tourism • Safaris • Investment",
  "destinationSections": [
    { "heading": "Northern Tanzania", "links": [
      { "label": "Serengeti", "href": "/destinations/northern" },
      { "label": "Ngorongoro", "href": "/destinations/northern" },
      { "label": "Tarangire", "href": "/destinations/northern" },
      { "label": "Lake Manyara", "href": "/destinations/northern" }
    ]},
    { "heading": "Southern Tanzania", "links": [
      { "label": "Julius Nyerere", "href": "/destinations/southern" },
      { "label": "Ruaha", "href": "/destinations/southern" }
    ]},
    { "heading": "Western Tanzania", "links": [
      { "label": "Katavi", "href": "/destinations/western" }
    ]}
  ],
  "servicesLinks": [
    { "label": "Investment Safari Tours", "href": "/experiences/luxury-fly-in" },
    { "label": "Cultural Immersion", "href": "/experiences/honeymoon" },
    { "label": "Bush & Beach Luxury", "href": "/experiences/photographic" },
    { "label": "Diaspora Opportunity Tours", "href": "/experiences/conservation" },
    { "label": "Corporate Tours", "href": "/experiences/corporate" }
  ],
  "companyLinks": [
    { "label": "About TANTREK 360", "href": "/about" },
    { "label": "Why Choose Us", "href": "/about" },
    { "label": "Our Impact", "href": "/sustainability" },
    { "label": "Speak to an Expert", "href": "/plan-your-safari" },
    { "label": "Insights", "href": "/safari-journal" }
  ],
  "getInTouch": {
    "location": "Tanzania • Spain",
    "whatsappLabel": "+34 637 04 86 15",
    "whatsappUrl": "https://wa.me/34637048615",
    "email": "info@tantrek360safaris.com",
    "ctaLabel": "Speak to an Expert",
    "ctaHref": "/plan-your-safari"
  },
  "newsletter": {
    "heading": "Stay informed",
    "copy": "Tanzania investment insights and curated journeys delivered to your inbox.",
    "placeholder": "Your email",
    "buttonLabel": "Subscribe"
  },
  "legalLinks": [
    { "label": "Privacy Policy", "href": "/privacy-policy" },
    { "label": "Terms", "href": "/terms" },
    { "label": "Cookie Policy", "href": "/cookies" }
  ]
}
```

---

## Homepage — `/home` (`content` blob)

### Fields already in the public API contract (`HomeContent`)
```json
{
  "heroEyebrow": "Curated Safaris · Investment · Opportunity",
  "heroHeadline": "Beyond Routes.\nBeyond Maps.",
  "heroSubhead": "TANTREK 360 designs private journeys through Tanzania's most extraordinary wilderness — and quietly opens doors to its emerging opportunity.",
  "heroCtaPrimary": "Begin Your Journey",
  "heroCtaPrimaryHref": "/plan-your-safari",
  "heroCtaSecondary": "Explore Tanzania",
  "heroCtaSecondaryHref": "/destinations",
  "mapHeading": "Tanzania, in 360°",
  "mapVideoUrl": "",
  "mapVideoWebM": "",
  "sanctuariesEyebrow": "Where We Travel",
  "sanctuariesTitle": "Three circuits. One Tanzania.",
  "sanctuariesBody": "From the Serengeti's open plains to Ruaha's wild south and Katavi's untouched west — every region carries its own rhythm, its own season, its own silence.",
  "ourStoryQuote": "We move quietly through wild places — with honesty, with patience, with care.",
  "ourStoryBody": "Tantrek is rooted in Tanzania. We work with the guides who grew up tracking these landscapes, the camps that put conservation before convenience, and the communities whose welcome makes a journey real.\n\nWe are also more than a safari company. Through TANTREK 360, we open doors to Tanzania's emerging opportunity — tourism, real estate, and ethical enterprise — for the investor, the diaspora, and the curious entrepreneur. Wild places. Real partnerships. Long horizons.",
  "ourStoryBgImage": "/tour8.webp",
  "finalCtaHeadline": "Begin your African story.",
  "finalCtaSubcopy": "Every journey is shaped slowly — through conversation, instinct, and the careful work of those who know the land. Tell us how you'd like to travel; we'll design the rest.",
  "finalCtaButtonLabel": "Speak with a Safari Designer",
  "finalCtaButtonHref": "/plan-your-safari"
}
```

### Hero slides — `/hero` (carousel; videos in `/public`)
```json
[
  { "order": 1, "src": "/tembo.mp4",   "alt": "Tarangire elephants at dawn",      "label": "Tarangire · First Light",    "isActive": true },
  { "order": 2, "src": "/beach.mp4",   "alt": "Zanzibar coastline at sunset",     "label": "Zanzibar · Indian Ocean",    "isActive": true },
  { "order": 3, "src": "/safari.mp4",  "alt": "Serengeti plains",                 "label": "Serengeti · Endless Plains", "isActive": true },
  { "order": 4, "src": "/wanyama.mp4", "alt": "Ruaha wildlife",                   "label": "Ruaha · Wild Frontier",      "isActive": true }
]
```

### Homepage section copy not yet API-backed (seed into `content` so it's editable)

**Brand statement (Section 2):**
- eyebrow: `The Tantrek Posture`
- pullquote: `We design journeys for travellers who care how a place is left behind — not only how it looks at sunset.`
- body 1: `Tantrek is a small Tanzanian house of safari designers, guides, and country specialists. We build private itineraries — one conversation at a time — for people who want depth, not checklist travel.`
- body 2: `Through TANTREK 360, the same care extends beyond the bush — to the investors, the returning diaspora, and the entrepreneurs who want a quieter, better-introduced way into Tanzania.`

**Signature journeys (Section 3)** — eyebrow `Signature Journeys`, heading `Four ways to travel Tantrek.`, intro `Each is a posture, not a package. We design the rest around the way you want to be in the wild.`
```json
[
  { "slug": "luxury-fly-in", "eyebrow": "Signature · Aviation", "title": "Luxury Fly-in Safaris", "blurb": "Light aircraft, remote airstrips, private guiding. From the Serengeti to Katavi without ever touching tarmac.", "href": "/experiences/luxury-fly-in", "image": "/tour1.webp" },
  { "slug": "honeymoon", "eyebrow": "For Two", "title": "Honeymoon Safaris", "blurb": "Private vehicles, bush dinners under starlight, and the silence of remote camps.", "href": "/experiences/honeymoon", "image": "/tour2.webp" },
  { "slug": "photographic", "eyebrow": "For the Lens", "title": "Photographic Expeditions", "blurb": "Light, positioning, patience. Guided by photographers, in low-density wilderness.", "href": "/experiences/photographic", "image": "/tour3.webp" },
  { "slug": "conservation", "eyebrow": "Roots & Return", "title": "Diaspora Opportunity Journeys", "blurb": "Reconnect with the land. Meet the people. Explore the work being done — and what could be next.", "href": "/experiences/conservation", "image": "/tour4.webp" }
]
```

**Featured circuits (Section 4):**
```json
[
  { "title": "The Northern Circuit", "pullQuote": "The Serengeti carries its own weather.", "body": "Serengeti, Ngorongoro, Tarangire, Lake Manyara — the classic Tanzania, where the migration writes the calendar.", "href": "/destinations/northern", "image": "/tour6.webp", "meta": "Best · Jun – Oct  ·  Migration river crossings" },
  { "title": "The Southern Circuit", "pullQuote": "Wild beyond reckoning.", "body": "Ruaha and Julius Nyerere — vast, less travelled, with predator densities that quietly rival the north.", "href": "/destinations/southern", "image": "/tour7.webp", "meta": "Best · Jul – Nov  ·  Big-cat density" },
  { "title": "The Western Circuit", "pullQuote": "Africa's last true frontier.", "body": "Katavi and Mahale — remote, demanding, unforgettable. Chimpanzees, hippo pods, and a horizon that feels invented.", "href": "/destinations/western", "image": "/wild.jpg", "meta": "Best · Aug – Oct  ·  Mahale chimpanzees" }
]
```

**Why travel with us (Section 5)** — eyebrow `Why Travel With Us`, heading `Four quiet differences that matter.`
```json
[
  { "number": "01", "title": "Quietly Personal", "body": "Every itinerary is shaped by conversation — not a catalogue. We listen first, design second, and never rush either." },
  { "number": "02", "title": "Rooted in Tanzania", "body": "Our guides grew up in these landscapes. Our camp partners put conservation before convenience. The country is home, not a destination." },
  { "number": "03", "title": "Beyond the Safari", "body": "Through TANTREK 360, we open quiet access to Tanzania's emerging opportunity — for investors, diaspora, and entrepreneurs who want more than a holiday." },
  { "number": "04", "title": "After You Land Back", "body": "The relationship doesn't end at the airport. Partnerships, setup, follow-through — we stay close long after the trip is over." }
]
```

**Accommodations (Section 6)** — eyebrow `Where You'll Stay`, heading `A small, careful collection of Tanzania's finest camps.`, intro `We work with the lodges and camps we'd stay in ourselves — owner-run, quietly run, and chosen for the way they leave a place better than they found it.`
```json
[
  { "name": "Singita Faru Faru", "region": "Grumeti, Serengeti", "blurb": "Open-fronted suites overlooking a waterhole that the migration crosses each year.", "image": "/lodge.jpg" },
  { "name": "Jabali Ridge", "region": "Ruaha National Park", "blurb": "Eight stone-and-thatch suites set against a kopje, looking out across the south.", "image": "/tour5.webp" },
  { "name": "Chumbe Island", "region": "Zanzibar", "blurb": "Solar-powered eco-bungalows on a private coral island — barefoot luxury, gentle on the reef.", "image": "/tour8.webp" }
]
```

**Seasonal highlights (Section 7)** — eyebrow `The Tanzania Calendar`, heading `When to come, and what you'll find.`, intro `Tanzania doesn't have one season — it has many. Each window opens onto a different country. Here's how we read the calendar.`
```json
[
  { "months": "Jan – Mar", "title": "Calving Season", "body": "Wildebeest birth on the southern Serengeti plains. Predator action peaks; skies are dramatic and clear." },
  { "months": "Apr – May", "title": "Green Season", "body": "Lush, quiet, photographic. Some camps close — those that stay open offer the best value of the year." },
  { "months": "Jun – Oct", "title": "Dry & Migration", "body": "Mara river crossings, predator densities high across the south, classic safari weather." },
  { "months": "Nov – Dec", "title": "Short Rains", "body": "Brief afternoon showers, returning birdlife, soft light. A favourite season for those in the know." }
]
```

**Homepage testimonials (Section 8)** — eyebrow `In Their Words`, heading `Stories from the field.`
```json
[
  { "quote": "Tantrek didn't sell us a trip. They asked questions, listened, and then quietly built ten days we'll talk about for the rest of our lives.", "name": "Daniel A.", "trip": "Investment Safari · 10 days", "initials": "DA" },
  { "quote": "Returning to Tanzania after eighteen years away, we needed more than a holiday. The team turned it into something closer to a homecoming — and a beginning.", "name": "Esther & Bernard K.", "trip": "Diaspora Opportunity Journey", "initials": "EK" },
  { "quote": "Ruaha at dawn. Zanzibar at dusk. The pacing was perfect. The guides, exceptional. Nothing felt scripted — and that's the highest praise we can give.", "name": "Maria V.", "trip": "Bush & Beach · 12 days", "initials": "MV" }
]
```

**Impact stats (Section 8):**
```json
[
  { "value": "12+",  "label": "Years guiding Tanzania" },
  { "value": "40+",  "label": "Camp & lodge partners" },
  { "value": "300+", "label": "Bespoke journeys designed" }
]
```

**Conservation & heritage (Section 9)** — eyebrow `Conservation & Heritage` (uses `ourStoryQuote`/`ourStoryBody`/`ourStoryBgImage` above) plus two side notes:
- `Where it goes` → `A portion of every Tantrek journey supports community-led conservancies and the next generation of Tanzanian guides.`
- `Who we work with` → `Camps and operators chosen for their conservation record, fair employment, and quiet excellence in the field.`

**Final CTA (Section 10)** — eyebrow `Begin Your 360° Journey` (uses `finalCta*` above), secondary link `Or chat on WhatsApp` → `https://wa.me/34637048615`, reassurance: `Every enquiry is read by a Tantrek safari designer — never an auto-responder. Most replies arrive within 24 hours.`

---

## About — `/about` (`AboutContent` blob)

```json
{
  "heroEyebrow": "About Tantrek",
  "heroHeadline": "Travel, trade, and trust.",
  "heroSubheadline": "A small Tanzanian house of safari designers, country specialists, and business advisors — guiding travellers, investors, and returning diaspora through Tanzania end-to-end.",
  "heroImage": "/tour8.webp",
  "foundationEyebrow": "Our Foundation",
  "foundationHeadline": "Built on unwavering honesty & integrity.",
  "storyBody": "Tantrek was founded on a simple conviction: that travel into Tanzania should also be travel into Tanzania's real economy. Wilderness and opportunity are inseparable here — and both deserve to be opened ethically.\n\nEvery engagement is built on transparency, accountability, and trust. We act in our clients' best interests — delivering reliable guidance, ethical solutions, and long-term partnerships grounded in credibility and quiet professional excellence.",
  "foundationTags": ["Tourism", "Safaris", "Investment"],
  "foundationImage": "/tour2.webp",
  "commitmentsEyebrow": "What We Do",
  "commitmentsHeadline": "Three commitments, one journey.",
  "commitmentsIntro": "Each part of what we do supports the other. That's the 360°.",
  "commitments": [
    { "number": "01", "title": "Travel", "body": "Curated safari and cultural journeys — Tanzania's iconic parks, communities, and coast, delivered with precision and warmth." },
    { "number": "02", "title": "Trade", "body": "Real exposure to Tanzanian markets — tourism, real estate, SMEs, and beyond. Verified partners, honest briefings, considered introductions." },
    { "number": "03", "title": "Trust", "body": "End-to-end facilitation, from entity setup and compliance to ongoing partnership support — long after the safari ends." }
  ],
  "teamEyebrow": "The Team",
  "teamHeadline": "The people behind the 360°.",
  "teamIntro": "Field operators, business advisors, and concierges — combining deep Tanzania experience with global professional standards. Owner-led, Tanzania-based.",
  "team": [
    { "name": "Emmanuel K.", "role": "Head of Field Operations", "imageUrl": "https://ui-avatars.com/api/?name=Emmanuel+K&size=400&background=003B8E&color=FFFFFF&bold=true", "alt": "Emmanuel K., Head of Field Operations" },
    { "name": "Sarah M.", "role": "Client Experience Director", "imageUrl": "https://ui-avatars.com/api/?name=Sarah+M&size=400&background=003B8E&color=FFFFFF&bold=true", "alt": "Sarah M., Client Experience Director" },
    { "name": "Dr. Lucas J.", "role": "Investment Advisor", "imageUrl": "https://ui-avatars.com/api/?name=Lucas+J&size=400&background=003B8E&color=FFFFFF&bold=true", "alt": "Dr. Lucas J., Investment Advisor" },
    { "name": "Nia W.", "role": "Private Concierge", "imageUrl": "https://ui-avatars.com/api/?name=Nia+W&size=400&background=003B8E&color=FFFFFF&bold=true", "alt": "Nia W., Private Concierge" }
  ],
  "teamNote": "Portrait placeholders — to be replaced with team photography.",
  "founderQuote": "Tanzania is not just a destination — it is an opportunity. Our mission at Tantrek is to open it honestly: as wilderness worth protecting, as culture worth learning from, and as a market worth investing in. Every journey we curate should leave both the traveller and the land richer for the encounter.",
  "founderName": "Tantrek Founders",
  "founderTitle": "Vision & Leadership",
  "ctaEyebrow": "Begin a Conversation",
  "ctaHeadline": "Impact, community, and the long view.",
  "ctaBody": "Our work is built on long-term partnerships with Tanzanian communities, conservation partners, and ethical operators. Talk to us about what you have in mind."
}
```

**About-page testimonials** (separate carousel):
```json
[
  { "quote": "TANTREK 360 turned a familiarisation trip into a real foothold in Tanzania — verified partners, honest market briefings, and a team that stayed in touch long after we flew home.", "name": "The Henderson Family", "location": "London, UK" },
  { "quote": "I came looking for opportunities. I left with relationships, a clear sector strategy, and a partner on the ground I trust to keep the momentum going.", "name": "James Sterling", "location": "New York, USA" },
  { "quote": "Wilderness, culture, and business — woven together with such craft that it never once felt scripted. Every guide and every introduction was deliberate.", "name": "Elena Moretti", "location": "Milan, Italy" },
  { "quote": "What sets Tantrek apart is integrity. Decisions are made in our interest. That alone is worth flying across the world for.", "name": "Dr. Richard Vance", "location": "Dubai, UAE" }
]
```

---

## Sustainability — `/sustainability` (`SustainabilityContent` blob)

```json
{
  "heroEyebrow": "Conservation & Community",
  "heroImage": "/land.jpg",
  "headline": "Travel that leaves a place better than it found it.",
  "subheadline": "Low-density tourism, fair employment, conservation partnerships — the unglamorous work that makes a wild place stay wild.",
  "commitmentsEyebrow": "Our Commitments",
  "commitmentsHeadline": "Three commitments to the wild.",
  "fieldQuote": "The land remembers who walked here, and how quietly.",
  "pillars": [
    { "number": "01", "title": "Low-Density Tourism", "body": "We believe true luxury is restraint. By limiting visitor numbers, we preserve the silence of the bush and minimise our footprint on fragile ecosystems.", "cta": "Where we travel quietly", "href": "/destinations/southern" },
    { "number": "02", "title": "Conservation Partnerships", "body": "Direct funding for anti-poaching units and wildlife corridors. Every Tantrek journey contributes to local conservation trusts and habitat protection.", "cta": "How we choose partners", "href": "/experiences/conservation" },
    { "number": "03", "title": "Community Collaboration", "body": "True conservation begins with people. We support education, sustainable livelihoods, and vocational training in the communities around the parks we visit.", "cta": "Read about our work", "href": "/about" }
  ],
  "statsEyebrow": "The Numbers Behind It",
  "statsHeadline": "What this work looks like, in figures.",
  "stats": [
    { "value": "120k+", "label": "Acres protected" },
    { "value": "100%",  "label": "Solar at partner camps" },
    { "value": "450+",  "label": "Scholarships funded" },
    { "value": "Zero",  "label": "Single-use plastics" }
  ],
  "statsNote": "Figures are aggregated across Tantrek and our partner camps and conservancies. We'd rather show fewer, honest numbers than many impressive ones.",
  "ctaEyebrow": "Travel With Purpose",
  "ctaHeadline": "Join the next chapter of responsible exploration.",
  "ctaBody": "Every Tantrek journey supports the places it visits — and the people who keep those places wild. Begin a conversation with a safari designer to find out how."
}
```

---

## Plan Your Safari — `/plan-your-safari` (`PlanContent` blob)

The form sends inquiries **via WhatsApp** today (number `34637048615`) and can also `POST /inquiries`. Seed the page copy + the form field options so they're editable.

```json
{
  "whatsappNumber": "34637048615",
  "responseNote": "Response within 24–48 hours",
  "formSteps": [
    {
      "id": "interests", "title": "Goals & interests",
      "fields": [
        { "name": "experience", "label": "Primary service", "type": "select",
          "options": ["Investment Safari Tour", "Cultural Immersion", "Bush & Beach Luxury", "Diaspora Opportunity Tour", "Corporate Tour", "Mixed / Flexible"] },
        { "name": "circuits", "label": "Regions of interest", "type": "multiselect",
          "options": ["Northern (Serengeti, Ngorongoro)", "Southern (Ruaha, Julius Nyerere)", "Western (Katavi)"] }
      ]
    },
    {
      "id": "dates", "title": "When & how long",
      "fields": [
        { "name": "travel_month", "label": "Preferred travel month(s)", "type": "select",
          "options": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Flexible"] },
        { "name": "nights", "label": "Number of nights", "type": "select",
          "options": ["3–5", "6–8", "9–12", "13+"] }
      ]
    },
    {
      "id": "budget", "title": "Budget",
      "fields": [
        { "name": "budget", "label": "Budget range per person (USD)", "type": "select",
          "options": ["$5,000 – $8,000", "$8,000 – $12,000", "$12,000 – $18,000", "$18,000 – $25,000", "$25,000+", "Prefer to discuss"] }
      ]
    },
    {
      "id": "contact", "title": "Your details",
      "fields": [
        { "name": "name", "label": "Full name", "type": "text" },
        { "name": "email", "label": "Email address", "type": "email" },
        { "name": "phone", "label": "Phone (with country code)", "type": "tel" },
        { "name": "notes", "label": "Your vision", "type": "textarea" }
      ]
    }
  ]
}
```

---

## Destinations — `/destinations` & `/circuits`

**Circuits:** `northern` → "Northern Circuit", `southern` → "Southern Circuit", `western` → "Western Circuit".

**7 destinations** — seed verbatim from **[src/data/destinations.ts](./src/data/destinations.ts)**. Field mapping → DB:
`slug, name, circuit, tagline, metaDescription (→ seoDescription/metaDescription), highlights[], bestTime, luxuryCamps[], migrationNote?, ecosystem?, avgTemp?, imageUrl (→ heroImage), internalLinks[]`.

Slugs: `serengeti`, `ngorongoro`, `tarangire`, `lake-manyara` (northern); `julius-nyerere`, `ruaha` (southern); `katavi` (western). Each carries full tagline/meta/highlights/bestTime/luxuryCamps as in the file — **copy all fields exactly**.

---

## Experiences — `/experiences`

**5 experiences** — seed verbatim from **[src/data/experiences.ts](./src/data/experiences.ts)**:
`slug, name, eyebrow, tagline, metaDescription (→ seoDescription), body, highlights[], cta, internalLinks[], imageUrl (→ heroImage)`.

Slugs: `luxury-fly-in`, `honeymoon`, `photographic`, `conservation`, `corporate`. Copy all fields exactly (including the `eyebrow` and full `body` paragraphs).

---

## Safari Journal — `/journal`

**Categories** (`/journal/categories`):
```json
[
  { "slug": "safari-planning",      "label": "Safari Planning" },
  { "slug": "wildlife-encounters",  "label": "Wildlife Encounters" },
  { "slug": "destination-guides",   "label": "Destination Guides" },
  { "slug": "conservation-stories", "label": "Conservation Stories" },
  { "slug": "travel-inspiration",   "label": "Travel Inspiration" }
]
```

**6 posts** — seed from **[src/data/safariJournal.ts](./src/data/safariJournal.ts)**: `slug, title, excerpt, category, image (→ featuredImage), imageAlt, readTime`. Mark `published: true`, set `publishedAt`. (Posts currently have title/excerpt/category/image only; `body` is empty — leave body blank or seed the excerpt as a placeholder; admins will author full bodies.) Slugs: `best-time-to-visit-serengeti`, `hidden-safari-routes-ruaha`, `remote-wilderness-katavi`, `great-migration-calendar`, `lion-pride-dynamics`, `community-conservation-tanzania`.

**Journal index page** (`/journal/page`): seed `title` = "Safari Journal" (or current heading) and an `intro` — confirm exact copy with the frontend team (`src/app/(site)/safari-journal/page.tsx`).

---

## Legal pages — `/legal/:key`

Three pages: `privacy` (Privacy Policy), `terms` (Terms), `cookies` (Cookie Policy). Seed `title`, `metaDescription`, and `body` (HTML) from the current page components:
- [src/app/(site)/privacy-policy/page.tsx](./src/app/(site)/privacy-policy/page.tsx)
- [src/app/(site)/terms/page.tsx](./src/app/(site)/terms/page.tsx)
- [src/app/(site)/cookies/page.tsx](./src/app/(site)/cookies/page.tsx)

(Transcribe their body copy into the `body` field as HTML so admins can edit it.)

---

## Image asset inventory (current defaults)

Local files in [public/](./public/) used as current defaults (seed these URLs; upload to MinIO during seeding if you want them served from object storage):

`logo.png`, `logo-footer.png`, `icon-512.png`, `favicon-source.png` · hero videos `tembo.mp4`, `beach.mp4`, `safari.mp4`, `wanyama.mp4`, `wild.mp4`, `map.mp4` · imagery `tour1–8.webp`, `land.jpg`, `lodge.jpg`, `safari.jpg`, `wild.jpg`, `wildmaker.png`, `green-bg-logo.png`, `green-head.png`, `map.png`, `footer-image.png`.

Some sections also reference **Unsplash** URLs (destinations, journal images, sustainability) — seed those exactly as they appear in the data files. All of these remain the defaults until an admin replaces them through the media library.
