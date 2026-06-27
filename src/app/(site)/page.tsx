"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { publicApi } from "@/lib/public-api";

const AnimatedTanzaniaMap = dynamic(
  () => import("@/components/AnimatedTanzaniaMap").then((m) => ({ default: m.AnimatedTanzaniaMap })),
  { ssr: false }
);

// ─── Hero carousel ────────────────────────────────────────────────────────────
// Each slide carries an editorial caption so the visitor is always anchored
// in a real Tanzania place — not a generic "safari" abstraction.
const STATIC_HERO_SLIDES: { src: string; alt: string; caption: string }[] = [
  { src: "/tembo.mp4", alt: "Tarangire elephants at dawn", caption: "Tarangire · First Light" },
  { src: "/beach.mp4", alt: "Zanzibar coastline at sunset", caption: "Zanzibar · Indian Ocean" },
  { src: "/safari.mp4", alt: "Serengeti plains", caption: "Serengeti · Endless Plains" },
  { src: "/wanyama.mp4", alt: "Ruaha wildlife", caption: "Ruaha · Wild Frontier" },
];

const STATIC_HOME = {
  heroEyebrow: "Curated Safaris · Investment · Opportunity",
  heroHeadline: "Beyond Routes.\nBeyond Maps.",
  heroSubhead:
    "TANTREK 360 designs private journeys through Tanzania's most extraordinary wilderness — and quietly opens doors to its emerging opportunity.",
  heroCtaPrimary: "Begin Your Journey",
  heroCtaPrimaryHref: "/plan-your-safari",
  heroCtaSecondary: "Explore Tanzania",
  heroCtaSecondaryHref: "/destinations",
  mapHeading: "Tanzania, in 360°",
  mapVideoUrl: "",
  mapVideoWebM: "",
  sanctuariesEyebrow: "Where We Travel",
  sanctuariesTitle: "Three circuits. One Tanzania.",
  sanctuariesBody:
    "From the Serengeti's open plains to Ruaha's wild south and Katavi's untouched west — every region carries its own rhythm, its own season, its own silence.",
  ourStoryQuote: "We move quietly through wild places — with honesty, with patience, with care.",
  ourStoryBody:
    "Tantrek is rooted in Tanzania. We work with the guides who grew up tracking these landscapes, the camps that put conservation before convenience, and the communities whose welcome makes a journey real.\n\nWe are also more than a safari company. Through TANTREK 360, we open doors to Tanzania's emerging opportunity — tourism, real estate, and ethical enterprise — for the investor, the diaspora, and the curious entrepreneur. Wild places. Real partnerships. Long horizons.",
  ourStoryBgImage: "/tour8.webp",
  finalCtaHeadline: "Begin your African story.",
  finalCtaSubcopy:
    "Every journey is shaped slowly — through conversation, instinct, and the careful work of those who know the land. Tell us how you'd like to travel; we'll design the rest.",
  finalCtaButtonLabel: "Speak with a Safari Designer",
  finalCtaButtonHref: "/plan-your-safari",
};

const SLIDE_DURATION_MS = 7000;

// Hero slides can be video or image — detect by extension so the carousel
// renders the right element for each.
const isVideoSrc = (src: string) => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(src);

// ─── Section 3: Signature Safari Experiences ──────────────────────────────────
// Asymmetric magazine layout — one large feature + three stacked. Each is a
// distinct emotional posture, not a "tour type" with bullet points.
type SignatureExperience = {
  slug: string;
  eyebrow: string;
  title: string;
  blurb: string;
  href: string;
  image: string; // PLACEHOLDER — see ASSETS.md
};

const SIGNATURE_EXPERIENCES: SignatureExperience[] = [
  {
    slug: "luxury-fly-in",
    eyebrow: "Signature · Aviation",
    title: "Luxury Fly-in Safaris",
    blurb:
      "Light aircraft, remote airstrips, private guiding. From the Serengeti to Katavi without ever touching tarmac.",
    href: "/experiences/luxury-fly-in",
    image: "/tour1.webp", // PLACEHOLDER: replace with cinematic shot of a Cessna over the Selous
  },
  {
    slug: "honeymoon",
    eyebrow: "For Two",
    title: "Honeymoon Safaris",
    blurb: "Private vehicles, bush dinners under starlight, and the silence of remote camps.",
    href: "/experiences/honeymoon",
    image: "/tour2.webp", // PLACEHOLDER: replace with a couple at a candlelit bush dinner
  },
  {
    slug: "photographic",
    eyebrow: "For the Lens",
    title: "Photographic Expeditions",
    blurb: "Light, positioning, patience. Guided by photographers, in low-density wilderness.",
    href: "/experiences/photographic",
    image: "/tour3.webp", // PLACEHOLDER: replace with golden-hour wildlife close-up
  },
  {
    slug: "conservation",
    eyebrow: "Roots & Return",
    title: "Diaspora Opportunity Journeys",
    blurb: "Reconnect with the land. Meet the people. Explore the work being done — and what could be next.",
    href: "/experiences/conservation",
    image: "/tour4.webp", // PLACEHOLDER: replace with community / conservation moment
  },
];

// ─── Section 4: Featured Destinations ─────────────────────────────────────────
type FeaturedCircuit = {
  title: string;
  pullQuote: string;
  body: string;
  href: string;
  image: string;
  meta: string;
};

const FEATURED_CIRCUITS: FeaturedCircuit[] = [
  {
    title: "The Northern Circuit",
    pullQuote: "The Serengeti carries its own weather.",
    body: "Serengeti, Ngorongoro, Tarangire, Lake Manyara — the classic Tanzania, where the migration writes the calendar.",
    href: "/destinations/northern",
    image: "/tour6.webp", // PLACEHOLDER: replace with Serengeti sweeping plain
    meta: "Best · Jun – Oct  ·  Migration river crossings",
  },
  {
    title: "The Southern Circuit",
    pullQuote: "Wild beyond reckoning.",
    body: "Ruaha and Julius Nyerere — vast, less travelled, with predator densities that quietly rival the north.",
    href: "/destinations/southern",
    image: "/tour7.webp", // PLACEHOLDER: replace with Ruaha baobab landscape
    meta: "Best · Jul – Nov  ·  Big-cat density",
  },
  {
    title: "The Western Circuit",
    pullQuote: "Africa's last true frontier.",
    body: "Katavi and Mahale — remote, demanding, unforgettable. Chimpanzees, hippo pods, and a horizon that feels invented.",
    href: "/destinations/western",
    image: "/wild.jpg", // PLACEHOLDER: replace with Katavi or Mahale hero shot
    meta: "Best · Aug – Oct  ·  Mahale chimpanzees",
  },
];

// ─── Section 5: Why Travel With Tantrek (editorial numbered) ─────────────────
type Reason = { number: string; title: string; body: string };

const REASONS: Reason[] = [
  {
    number: "01",
    title: "Quietly Personal",
    body:
      "Every itinerary is shaped by conversation — not a catalogue. We listen first, design second, and never rush either.",
  },
  {
    number: "02",
    title: "Rooted in Tanzania",
    body:
      "Our guides grew up in these landscapes. Our camp partners put conservation before convenience. The country is home, not a destination.",
  },
  {
    number: "03",
    title: "Beyond the Safari",
    body:
      "Through TANTREK 360, we open quiet access to Tanzania's emerging opportunity — for investors, diaspora, and entrepreneurs who want more than a holiday.",
  },
  {
    number: "04",
    title: "After You Land Back",
    body:
      "The relationship doesn't end at the airport. Partnerships, setup, follow-through — we stay close long after the trip is over.",
  },
];

// ─── Section 6: Luxury Accommodation Showcase ────────────────────────────────
type Lodge = {
  name: string;
  region: string;
  blurb: string;
  image: string;
};

const ACCOMMODATIONS: Lodge[] = [
  {
    name: "Singita Faru Faru",
    region: "Grumeti, Serengeti",
    blurb: "Open-fronted suites overlooking a waterhole that the migration crosses each year.",
    image: "/lodge.jpg", // PLACEHOLDER: replace with feature lodge hero (golden hour, lit terrace)
  },
  {
    name: "Jabali Ridge",
    region: "Ruaha National Park",
    blurb: "Eight stone-and-thatch suites set against a kopje, looking out across the south.",
    image: "/tour5.webp", // PLACEHOLDER: replace with kopje-set camp at dusk
  },
  {
    name: "Chumbe Island",
    region: "Zanzibar",
    blurb: "Solar-powered eco-bungalows on a private coral island — barefoot luxury, gentle on the reef.",
    image: "/tour8.webp", // PLACEHOLDER: replace with island bungalow over turquoise water
  },
];

// ─── Section 7: Seasonal Safari Highlights (timeline) ────────────────────────
type Season = { months: string; title: string; body: string };

const SEASONS: Season[] = [
  {
    months: "Jan – Mar",
    title: "Calving Season",
    body: "Wildebeest birth on the southern Serengeti plains. Predator action peaks; skies are dramatic and clear.",
  },
  {
    months: "Apr – May",
    title: "Green Season",
    body: "Lush, quiet, photographic. Some camps close — those that stay open offer the best value of the year.",
  },
  {
    months: "Jun – Oct",
    title: "Dry & Migration",
    body: "Mara river crossings, predator densities high across the south, classic safari weather.",
  },
  {
    months: "Nov – Dec",
    title: "Short Rains",
    body: "Brief afternoon showers, returning birdlife, soft light. A favourite season for those in the know.",
  },
];

// ─── Section 8: Traveler Stories ─────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:
      "Tantrek didn't sell us a trip. They asked questions, listened, and then quietly built ten days we'll talk about for the rest of our lives.",
    name: "Daniel A.",
    trip: "Investment Safari · 10 days",
    initials: "DA",
  },
  {
    quote:
      "Returning to Tanzania after eighteen years away, we needed more than a holiday. The team turned it into something closer to a homecoming — and a beginning.",
    name: "Esther & Bernard K.",
    trip: "Diaspora Opportunity Journey",
    initials: "EK",
  },
  {
    quote:
      "Ruaha at dawn. Zanzibar at dusk. The pacing was perfect. The guides, exceptional. Nothing felt scripted — and that's the highest praise we can give.",
    name: "Maria V.",
    trip: "Bush & Beach · 12 days",
    initials: "MV",
  },
];

const IMPACT_STATS = [
  { value: "12+", label: "Years guiding Tanzania" },
  { value: "40+", label: "Camp & lodge partners" },
  { value: "300+", label: "Bespoke journeys designed" },
];

// ─── Editable lower-section content (defaults; CMS overrides via /home) ──────
// Shape mirrors the backend `/home` content blob: nested section objects with
// eyebrow/heading/intro/items. Defaults keep the homepage unchanged until the
// CMS returns values.
const DEFAULT_SECTIONS = {
  brandStatement: {
    eyebrow: "The Tantrek Posture",
    pullquote:
      "We design journeys for travellers who care how a place is left behind — not only how it looks at sunset.",
    body1:
      "Tantrek is a small Tanzanian house of safari designers, guides, and country specialists. We build private itineraries — one conversation at a time — for people who want depth, not checklist travel.",
    body2:
      "Through TANTREK 360, the same care extends beyond the bush — to the investors, the returning diaspora, and the entrepreneurs who want a quieter, better-introduced way into Tanzania.",
  },
  signatureJourneys: {
    eyebrow: "Signature Journeys",
    intro: "Each is a posture, not a package. We design the rest around the way you want to be in the wild.",
    items: SIGNATURE_EXPERIENCES as Array<{
      slug?: string; eyebrow?: string; title: string; blurb?: string; href?: string; image?: string;
    }>,
  },
  featuredCircuits: FEATURED_CIRCUITS as Array<{
    title: string; pullQuote?: string; body?: string; href?: string; image?: string; meta?: string;
  }>,
  whyTravel: {
    eyebrow: "Why Travel With Us",
    items: REASONS as Array<{ number?: string; title: string; body: string }>,
  },
  accommodations: {
    eyebrow: "Where You’ll Stay",
    intro:
      "We work with the lodges and camps we’d stay in ourselves — owner-run, quietly run, and chosen for the way they leave a place better than they found it.",
    items: ACCOMMODATIONS as Array<{ name: string; region?: string; blurb?: string; image?: string }>,
  },
  seasons: {
    eyebrow: "The Tanzania Calendar",
    intro:
      "Tanzania doesn’t have one season — it has many. Each window opens onto a different country. Here’s how we read the calendar.",
    items: SEASONS as Array<{ months?: string; title: string; body: string }>,
  },
  testimonials: {
    eyebrow: "In Their Words",
    items: TESTIMONIALS as Array<{ quote: string; name: string; trip?: string; initials?: string }>,
  },
  impactStats: IMPACT_STATS as Array<{ value: string; label: string }>,
  conservation: {
    eyebrow: "Conservation & Heritage",
    whereItGoes:
      "A portion of every Tantrek journey supports community-led conservancies and the next generation of Tanzanian guides.",
    whoWeWorkWith:
      "Camps and operators chosen for their conservation record, fair employment, and quiet excellence in the field.",
  },
};
type Sections = typeof DEFAULT_SECTIONS;

// ─── Reusable: editorial eyebrow + rule ──────────────────────────────────────
function Eyebrow({ children, tone = "orange" }: { children: React.ReactNode; tone?: "orange" | "white" }) {
  return (
    <span
      className={`editorial-eyebrow ${
        tone === "white" ? "text-white/80" : "text-tantrek-orange"
      }`}
    >
      {children}
    </span>
  );
}

export default function HomePage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [heroPhase, setHeroPhase] = useState<"slideshow" | "map">("slideshow");
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const heroVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [home, setHome] = useState(STATIC_HOME);
  const [sections, setSections] = useState<Sections>(DEFAULT_SECTIONS);
  const [heroSlides, setHeroSlides] =
    useState<{ src: string; alt: string; caption: string }[]>(STATIC_HERO_SLIDES);

  // Subtle parallax for the hero — the report calls out a lack of layered
  // storytelling; this gives the hero a quiet sense of depth.
  const { scrollY } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 600], [0, 80]);

  // ── CMS hydration ──────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.allSettled([
      publicApi.getHomeContent(),
      publicApi.getHeroSlides(),
    ]).then(([homeRes, slidesRes]) => {
      if (homeRes.status === "fulfilled" && homeRes.value) {
        const d = homeRes.value;
        setHome({ ...STATIC_HOME, ...d });
        // Merge nested section objects; keep default items when the API omits them.
        const mergeSection = <T extends { items?: unknown[] }>(prev: T, next?: Partial<T>): T => ({
          ...prev,
          ...(next ?? {}),
          items: (next?.items?.length ? next.items : prev.items) as T["items"],
        });
        setSections((prev) => ({
          brandStatement: { ...prev.brandStatement, ...(d.brandStatement ?? {}) },
          signatureJourneys: mergeSection(prev.signatureJourneys, d.signatureJourneys),
          featuredCircuits: d.featuredCircuits?.length ? d.featuredCircuits : prev.featuredCircuits,
          whyTravel: mergeSection(prev.whyTravel, d.whyTravel),
          accommodations: mergeSection(prev.accommodations, d.accommodations),
          seasons: mergeSection(prev.seasons, d.seasons),
          testimonials: mergeSection(prev.testimonials, d.testimonials),
          impactStats: d.impactStats?.length ? d.impactStats : prev.impactStats,
          conservation: { ...prev.conservation, ...(d.conservation ?? {}) },
        }));
      }
      if (slidesRes.status === "fulfilled" && slidesRes.value?.length) {
        const active = slidesRes.value
          .filter((s) => s.isActive !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        if (active.length > 0) {
          setHeroSlides(
            active.map((s, i) => ({
              src: s.src,
              alt: s.alt ?? "",
              // CMS slides have no captions yet; fall back to the static caption at the same index.
              caption: STATIC_HERO_SLIDES[i % STATIC_HERO_SLIDES.length].caption,
            }))
          );
        }
      }
    });
  }, []);

  // ── Testimonial rotation ───────────────────────────────────────────────────
  const testimonialCount = sections.testimonials.items.length;
  const goTo = useCallback((index: number) => {
    setTestimonialIndex(() => {
      if (index < 0) return testimonialCount - 1;
      if (index >= testimonialCount) return 0;
      return index;
    });
  }, [testimonialCount]);

  useEffect(() => {
    const t = setInterval(() => goTo(testimonialIndex + 1), 7000);
    return () => clearInterval(t);
  }, [testimonialIndex, goTo]);

  // ── Hero phase rotation (slideshow → map → slideshow) ──────────────────────
  useEffect(() => {
    if (heroPhase === "map") return;
    const t = setInterval(() => {
      setHeroSlideIndex((prev) => {
        if (prev >= heroSlides.length - 1) {
          setHeroPhase("map");
          return 0;
        }
        return prev + 1;
      });
    }, SLIDE_DURATION_MS);
    return () => clearInterval(t);
  }, [heroPhase, heroSlideIndex, heroSlides.length]);

  const onMapComplete = useCallback(() => {
    setHeroPhase("slideshow");
    setHeroSlideIndex(0);
  }, []);

  useEffect(() => {
    if (heroPhase !== "slideshow") return;
    heroVideoRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === heroSlideIndex) el.play().catch(() => {});
      else el.pause();
    });
  }, [heroPhase, heroSlideIndex]);

  const heroLines = home.heroHeadline.split("\n");
  const heroPrimaryLine = heroLines[0];
  const heroAccentLine = heroLines[1];

  // CMS-overridable section content (defaults to the built-in copy above).
  // Brand-statement and seasonal sections were retired from the homepage to
  // keep it a concise "trailer" — that content now lives on /about and
  // /plan-your-safari respectively. Conservation is kept only for the one-line
  // note grafted into the final CTA (full story lives on /sustainability).
  const conservation = sections.conservation;
  const signatureExperiences = sections.signatureJourneys.items;
  const featuredCircuits = sections.featuredCircuits;
  const reasons = sections.whyTravel.items;
  const accommodations = sections.accommodations.items;
  const testimonials = sections.testimonials.items;
  const impactStats = sections.impactStats;

  return (
    <>
      {/* ═════════════════════════════════════════════════════════════════════
          1 · CINEMATIC HERO
          Full-screen video carousel that transitions into an animated map of
          Tanzania, then loops. The serif italic on the accent word gives the
          first impression an editorial weight rather than a startup banner.
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden pt-20">
        <motion.div style={{ y: heroParallaxY }} className="absolute inset-0 bg-tantrek-navy-deep">
          {heroSlides.map((slide, i) => (
            <motion.div
              key={slide.src}
              initial={false}
              animate={{
                opacity: heroSlideIndex === i ? 1 : 0,
                scale: heroSlideIndex === i ? 1 : 1.04,
                zIndex: heroSlideIndex === i ? 1 : 0,
                pointerEvents: heroSlideIndex === i ? "auto" : "none",
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {isVideoSrc(slide.src) ? (
                <video
                  ref={(el) => {
                    heroVideoRefs.current[i] = el;
                  }}
                  src={slide.src}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  disableRemotePlayback
                  className="absolute inset-0 w-full h-full object-cover"
                  aria-label={slide.alt}
                  aria-hidden={heroSlideIndex !== i}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  aria-hidden={heroSlideIndex !== i}
                />
              )}
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-hero-overlay pointer-events-none z-[2]" aria-hidden />
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 80% 25%, rgba(255,122,0,0.18), transparent 70%)",
            }}
            aria-hidden
          />
        </motion.div>

        <AnimatedTanzaniaMap isActive={heroPhase === "map"} onComplete={onMapComplete} />

        {heroPhase === "slideshow" && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative z-10 px-4 sm:px-6 text-center max-w-5xl mx-auto pb-24"
          >
            {/* Frame caption — sits inline above the eyebrow, rotates with each slide */}
            <div className="flex justify-center mb-6">
              <AnimatePresence mode="wait">
                <motion.span
                  key={heroSlides[heroSlideIndex]?.caption}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.45 }}
                  className="hero-frame-caption font-body"
                >
                  {heroSlides[heroSlideIndex]?.caption}
                </motion.span>
              </AnimatePresence>
            </div>

            {home.heroEyebrow && (
              <p className="font-body text-tantrek-orange text-[11px] sm:text-xs font-semibold tracking-[0.34em] uppercase mb-7">
                {home.heroEyebrow}
              </p>
            )}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[88px] text-white leading-[1.02] font-bold tracking-tight">
              {heroPrimaryLine}
              {heroAccentLine && (
                <>
                  <br />
                  <span className="font-serif italic font-normal text-tantrek-orange">
                    {heroAccentLine}
                  </span>
                </>
              )}
            </h1>
            {home.heroSubhead && (
              <p className="mt-8 text-base sm:text-lg text-white/85 max-w-2xl mx-auto font-body font-normal leading-relaxed">
                {home.heroSubhead}
              </p>
            )}

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {home.heroCtaPrimary && (
                <Link
                  href={home.heroCtaPrimaryHref || "/plan-your-safari"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-tantrek-orange px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_12px_30px_rgba(255,122,0,0.4)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5 w-full sm:w-auto"
                >
                  {home.heroCtaPrimary}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
              {home.heroCtaSecondary && (
                <Link
                  href={home.heroCtaSecondaryHref || "/destinations"}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-tantrek-navy-deep hover:border-white w-full sm:w-auto"
                >
                  {home.heroCtaSecondary}
                </Link>
              )}
            </div>

            {/* Tertiary discovery option — quiet, sub-CTA */}
            <Link
              href="/design-your-journey"
              className="mt-6 inline-flex items-center gap-1.5 font-body text-white/65 text-xs sm:text-sm tracking-wide hover:text-tantrek-orange transition-colors"
            >
              <span className="opacity-70">or</span> sketch a draft journey first{" "}
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        )}

        {heroPhase === "slideshow" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70"
          >
            <span className="block w-6 h-10 border-2 border-white/40 rounded-full mx-auto" />
            <span className="block text-[10px] tracking-[0.3em] mt-2 uppercase">Scroll</span>
          </motion.div>
        )}
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          2 · SIGNATURE SAFARI EXPERIENCES
          Asymmetric magazine grid — one large feature tile on the left, three
          stacked smaller tiles on the right. Replaces the equal 2x2 grid the
          report flagged as "template-driven."
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="bg-tantrek-surface luxury-section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-10 lg:mb-12"
          >
            <Eyebrow>{sections.signatureJourneys.eyebrow}</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight mt-5">
              Four ways to travel{" "}
              <span className="font-serif italic font-normal text-tantrek-orange">
                Tantrek.
              </span>
            </h2>
            <p className="mt-4 text-tantrek-text-muted text-base lg:text-lg leading-relaxed">
              {sections.signatureJourneys.intro}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7">
            {/* Feature tile — left, full-height */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7"
            >
              <Link
                href={signatureExperiences[0].href ?? "/experiences"}
                className="signature-feature group block h-full min-h-[480px]"
              >
                <div
                  className="signature-image"
                  style={{ backgroundImage: `url(${signatureExperiences[0].image})` }}
                  aria-hidden
                />
                <div className="relative z-10 h-full flex flex-col justify-end p-7 sm:p-8 lg:p-10">
                  <p className="font-body text-tantrek-orange text-[11px] font-semibold tracking-[0.30em] uppercase mb-3">
                    {signatureExperiences[0].eyebrow}
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl lg:text-[34px] text-white font-semibold leading-tight max-w-lg">
                    {signatureExperiences[0].title}
                  </h3>
                  <p className="mt-3 text-white/80 text-sm lg:text-base max-w-md leading-relaxed">
                    {signatureExperiences[0].blurb}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-white text-[11px] font-bold tracking-[0.24em] uppercase group-hover:gap-4 transition-all">
                    Discover the journey <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Three stacked tiles — right column */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-7">
              {signatureExperiences.slice(1).map((exp, i) => (
                <motion.div
                  key={exp.slug}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                  className="flex-1"
                >
                  <Link
                    href={exp.href ?? "/experiences"}
                    className="signature-stack group block h-full min-h-[170px]"
                  >
                    <div
                      className="signature-image"
                      style={{ backgroundImage: `url(${exp.image})` }}
                      aria-hidden
                    />
                    <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-7">
                      <p className="font-body text-tantrek-orange text-[10px] font-semibold tracking-[0.28em] uppercase mb-2">
                        {exp.eyebrow}
                      </p>
                      <h3 className="font-display text-lg lg:text-xl text-white font-semibold leading-tight">
                        {exp.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-10 lg:mt-12 text-center">
            <Link
              href="/experiences"
              className="inline-flex items-center gap-2 font-body text-tantrek-navy text-sm font-semibold tracking-wide hover:text-tantrek-orange transition-colors"
            >
              All signature journeys
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          4 · FEATURED DESTINATIONS — Tanzania's three circuits
          Editorial trio with per-region pull-quote and best-season metadata.
          Pulls heading/body from CMS (sanctuariesEyebrow, sanctuariesTitle,
          sanctuariesBody) so the brand voice stays editable.
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white editorial-section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-10 lg:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              {home.sanctuariesEyebrow && <Eyebrow>{home.sanctuariesEyebrow}</Eyebrow>}
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight mt-5">
                {home.sanctuariesTitle}
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-5 text-tantrek-text-muted text-base lg:text-lg leading-relaxed"
            >
              {home.sanctuariesBody}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
            {featuredCircuits.map((circuit, i) => (
              <motion.div
                key={circuit.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
              >
                <Link
                  href={circuit.href ?? "/destinations"}
                  className="editorial-destination group block h-full min-h-[400px]"
                  style={{
                    backgroundImage: `url(${circuit.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="relative z-10 h-full flex flex-col justify-between p-7 lg:p-8">
                    <p className="font-body text-white/80 text-[10px] font-semibold tracking-[0.28em] uppercase">
                      {circuit.meta}
                    </p>
                    <div>
                      <p className="font-serif italic text-white/95 text-base lg:text-lg leading-snug max-w-xs">
                        “{circuit.pullQuote}”
                      </p>
                      <div className="luxury-gold-line my-4" aria-hidden />
                      <h3 className="font-display text-xl lg:text-2xl text-white font-semibold tracking-tight">
                        {circuit.title}
                      </h3>
                      <span className="mt-5 inline-flex items-center gap-2 text-white text-[11px] font-bold tracking-[0.22em] uppercase group-hover:gap-4 transition-all">
                        Discover <span aria-hidden>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 lg:mt-12 text-center">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 font-body text-tantrek-navy text-sm font-semibold tracking-wide hover:text-tantrek-orange transition-colors"
            >
              All destinations
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          5 · WHY TRAVEL WITH TANTREK
          Editorial 2-column. Imagery on left, four numbered editorial items
          on right — explicitly avoids the equal 2x4 card grid the report
          called out as template-feel.
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="bg-tantrek-surface luxury-section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 lg:sticky lg:top-28"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl shadow-[0_24px_60px_rgba(0,43,91,0.18)]">
                <Image
                  src="/tour6.webp" /* PLACEHOLDER: replace with editorial portrait of a Tantrek guide or founder in the field */
                  alt="In the field with a Tantrek safari designer"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tantrek-navy-deep/40 via-transparent to-transparent" aria-hidden />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="font-body text-[10px] tracking-[0.28em] uppercase text-tantrek-orange font-semibold mb-2">
                    In the field
                  </p>
                  <p className="font-serif italic text-lg lg:text-xl leading-snug">
                    “The best safari is the one you&rsquo;d never have planned alone.”
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-7"
            >
              <Eyebrow>{sections.whyTravel.eyebrow}</Eyebrow>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight mt-5 mb-8">
                Four quiet differences{" "}
                <span className="font-serif italic font-normal text-tantrek-orange">
                  that matter.
                </span>
              </h2>

              <div className="space-y-7">
                {reasons.map((r, i) => (
                  <motion.div
                    key={r.number}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="editorial-reason"
                  >
                    <span className="reason-number">{r.number}</span>
                    <h3 className="font-display text-lg lg:text-xl text-tantrek-navy font-semibold mb-2">
                      {r.title}
                    </h3>
                    <p className="text-tantrek-text-muted text-base leading-relaxed max-w-2xl">
                      {r.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          6 · LUXURY ACCOMMODATION SHOWCASE
          Editorial spotlight on the camps we partner with. Magazine-style
          asymmetric layout — one feature lodge tile + two stacked.
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white editorial-section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-10 lg:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <Eyebrow>{sections.accommodations.eyebrow}</Eyebrow>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight mt-5">
                A small, careful collection of{" "}
                <span className="font-serif italic font-normal text-tantrek-orange">
                  Tanzania&rsquo;s finest camps.
                </span>
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-5 text-tantrek-text-muted text-base lg:text-lg leading-relaxed"
            >
              {sections.accommodations.intro}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7"
            >
              <div className="accommodation-tile group h-full min-h-[440px]">
                <div
                  className="accommodation-image"
                  style={{ backgroundImage: `url(${accommodations[0].image})` }}
                  aria-hidden
                />
                <div className="relative z-10 h-full flex flex-col justify-end p-7 lg:p-8">
                  <p className="font-body text-tantrek-orange text-[11px] font-semibold tracking-[0.28em] uppercase mb-3">
                    {accommodations[0].region}
                  </p>
                  <h3 className="font-display text-2xl lg:text-3xl text-white font-semibold leading-tight">
                    {accommodations[0].name}
                  </h3>
                  <p className="mt-3 text-white/80 text-sm lg:text-base leading-relaxed max-w-md">
                    {accommodations[0].blurb}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-7">
              {accommodations.slice(1).map((lodge, i) => (
                <motion.div
                  key={lodge.name}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                  className="flex-1"
                >
                  <div className="accommodation-tile group h-full min-h-[210px]">
                    <div
                      className="accommodation-image"
                      style={{ backgroundImage: `url(${lodge.image})` }}
                      aria-hidden
                    />
                    <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-7">
                      <p className="font-body text-tantrek-orange text-[10px] font-semibold tracking-[0.26em] uppercase mb-2">
                        {lodge.region}
                      </p>
                      <h3 className="font-display text-lg lg:text-xl text-white font-semibold">
                        {lodge.name}
                      </h3>
                      <p className="mt-2 text-white/80 text-sm leading-relaxed">
                        {lodge.blurb}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          6 · TRAVELER STORIES + INTEGRATED IMPACT STATS
          Editorial pull-quote treatment, with the impact stats anchored
          quietly below — establishing trust without a separate stat strip.
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="bg-tantrek-surface py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <Eyebrow>{sections.testimonials.eyebrow}</Eyebrow>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-tantrek-navy font-bold leading-tight mt-4">
              Stories from{" "}
              <span className="font-serif italic font-normal text-tantrek-orange">
                the field.
              </span>
            </h2>
          </motion.div>

          <div className="relative min-h-[240px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full"
              >
                <div className="text-center px-2 sm:px-8">
                  <blockquote className="editorial-pullquote text-xl sm:text-2xl lg:text-[26px] max-w-3xl mx-auto">
                    {testimonials[testimonialIndex].quote}
                  </blockquote>
                  <footer className="mt-7 flex flex-col items-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-tantrek-navy text-white font-display text-sm font-semibold">
                      {testimonials[testimonialIndex].initials}
                    </div>
                    <p className="mt-2.5 font-body font-semibold text-tantrek-navy text-sm">
                      {testimonials[testimonialIndex].name}
                    </p>
                    <p className="mt-0.5 font-body text-xs text-tantrek-text-muted">
                      {testimonials[testimonialIndex].trip}
                    </p>
                  </footer>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={() => goTo(testimonialIndex - 1)}
                className="p-2.5 rounded-full border border-tantrek-border text-tantrek-navy transition-all hover:bg-tantrek-orange hover:text-white hover:border-tantrek-orange"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTestimonialIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === testimonialIndex ? "w-8 bg-tantrek-orange" : "w-2 bg-tantrek-text-soft hover:bg-tantrek-text-muted"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => goTo(testimonialIndex + 1)}
                className="p-2.5 rounded-full border border-tantrek-border text-tantrek-navy transition-all hover:bg-tantrek-orange hover:text-white hover:border-tantrek-orange"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Impact stats — quietly anchored below testimonials */}
          <div className="mt-10 lg:mt-12 pt-7 border-t border-tantrek-border grid grid-cols-1 sm:grid-cols-3 gap-6">
            {impactStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-serif text-3xl lg:text-4xl text-tantrek-navy font-medium leading-none">
                  {stat.value}
                </div>
                <div className="mt-3 font-body text-[11px] tracking-[0.22em] uppercase text-tantrek-text-muted font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          7 · CONCIERGE CTA
          Reframed from transactional ("Speak to an Expert") to concierge
          ("Speak with a Safari Designer"). Preserves all final CTA CMS
          fields. Uses concierge-cta-card glass treatment.
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="section-bg-frontier relative editorial-section-padding overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45"
          style={{ backgroundImage: "url(/tour8.webp)" /* PLACEHOLDER: replace with a hero golden-hour Tanzania landscape */ }}
          aria-hidden
        />
        <div className="absolute inset-0 frontier-overlay" aria-hidden />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="concierge-cta-card p-8 sm:p-12 lg:p-14 text-center"
          >
            <Eyebrow tone="white">Begin Your 360° Journey</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-[1.12] mt-6">
              {home.finalCtaHeadline.split(".").map((part, i, arr) =>
                part.trim() ? (
                  <span key={i}>
                    {i === arr.length - 2 ? (
                      <span className="font-serif italic font-normal text-tantrek-orange">
                        {part}.
                      </span>
                    ) : (
                      <>{part}.</>
                    )}
                  </span>
                ) : null
              )}
            </h2>
            {home.finalCtaSubcopy && (
              <p className="mt-7 text-white/85 font-body text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                {home.finalCtaSubcopy}
              </p>
            )}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
              {home.finalCtaButtonLabel && (
                <Link
                  href={home.finalCtaButtonHref || "/plan-your-safari"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-tantrek-orange px-9 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,122,0,0.4)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5 w-full sm:w-auto"
                >
                  {home.finalCtaButtonLabel}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
              <a
                href="https://wa.me/34637048615"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-body text-white/85 text-sm tracking-wide hover:text-tantrek-orange transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.683-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607z" />
                </svg>
                Or chat on WhatsApp
              </a>
            </div>

            <p className="mt-10 text-white/55 text-xs tracking-wide max-w-md mx-auto">
              Every enquiry is read by a Tantrek safari designer — never an
              auto-responder. Most replies arrive within 24 hours.
            </p>

            {/* Conservation note — grafted from the retired Conservation section so
                the value is preserved without a full standalone block. */}
            <p className="mt-5 text-white/55 text-xs tracking-wide max-w-md mx-auto">
              {conservation.whereItGoes}{" "}
              <Link
                href="/sustainability"
                className="text-tantrek-orange/90 font-semibold hover:text-tantrek-orange transition-colors underline underline-offset-4 decoration-tantrek-orange/40"
              >
                Our conservation work
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
