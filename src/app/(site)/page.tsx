"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { publicApi, type HomeContent } from "@/lib/public-api";

const AnimatedTanzaniaMap = dynamic(
  () => import("@/components/AnimatedTanzaniaMap").then((m) => ({ default: m.AnimatedTanzaniaMap })),
  { ssr: false }
);

const STATIC_HERO_SLIDES = [
  { src: "/tembo.mp4", alt: "Elephants of Tanzania" },
  { src: "/beach.mp4", alt: "Zanzibar coastline" },
  { src: "/safari.mp4", alt: "Tanzania safari" },
  { src: "/wanyama.mp4", alt: "Tanzania wildlife" },
];

const STATIC_HOME: Required<HomeContent> = {
  heroEyebrow: "Tourism • Investment • Opportunity",
  heroHeadline: "Beyond Routes.\nBeyond Maps.",
  heroSubhead:
    "TANTREK 360 unites curated safari experiences with business consultancy and investment facilitation. From entry to expansion in Tanzania — under one trusted platform.",
  heroCtaPrimary: "Plan Your Trip",
  heroCtaPrimaryHref: "/plan-your-safari",
  heroCtaSecondary: "Explore Our Services",
  heroCtaSecondaryHref: "/experiences",
  mapHeading: "Tanzania, in 360°",
  mapVideoUrl: "",
  mapVideoWebM: "",
  sanctuariesEyebrow: "Our Destinations",
  sanctuariesTitle: "Tanzania of Wonder & Opportunity",
  sanctuariesBody:
    "From the Serengeti and Ngorongoro to Ruaha, Julius Nyerere, and Katavi — we open Tanzania's iconic wilderness alongside real access to its emerging markets.",
  ourStoryQuote: "We operate with unwavering honesty and integrity.",
  ourStoryBody:
    "Every engagement is built on transparency, accountability, and trust. Our commitment is to act in our clients' best interests — delivering reliable guidance, ethical solutions, and long-term partnerships grounded in credibility and professional excellence.\n\nTANTREK 360 is not just a travel company. We are a 360° integrated ecosystem connecting business, tourism, and investment under one trusted platform — built for investors, diaspora, entrepreneurs, and global professionals who want more than sightseeing.",
  ourStoryBgImage: "/tour8.webp",
  finalCtaHeadline: "Your journey into Tanzania's opportunities starts here.",
  finalCtaSubcopy:
    "Tell us your goals — travel, investment, or both. We'll design a 360° experience that turns curiosity into clarity, and clarity into action.",
  finalCtaButtonLabel: "Speak to an Expert",
  finalCtaButtonHref: "/plan-your-safari",
};

const SLIDE_DURATION_MS = 7000;

const WHY_CHOOSE_US = [
  {
    title: "360° Integrated Ecosystem",
    copy: "Connecting business, tourism, and investment under one trusted platform.",
    icon: "globe",
  },
  {
    title: "Multi-Sector Expertise",
    copy: "Serving tourism, finance, legal, staffing, and investment sectors.",
    icon: "layers",
  },
  {
    title: "Structured Growth Systems",
    copy: "From setup to scaling — frameworks designed for long-term success.",
    icon: "trending",
  },
  {
    title: "End-to-End Support",
    copy: "From entry to expansion in Tanzania — we walk every step with you.",
    icon: "shield",
  },
];

const JOURNEY_STEPS = [
  {
    step: "01",
    title: "Consultation",
    body: "We listen first. Understand your goals — travel, investment, or both — and the outcomes you want.",
  },
  {
    step: "02",
    title: "Custom Tour Design",
    body: "Bespoke itineraries blending wilderness, culture, and curated business exposure tailored to your sector.",
  },
  {
    step: "03",
    title: "Guided Experience",
    body: "Safari plus business immersion — verified partners, site visits, and conversations that matter.",
  },
  {
    step: "04",
    title: "Post-Tour Support",
    body: "Entity setup, compliance, partnerships, and ongoing facilitation long after your trip ends.",
  },
];

const IMPACT_STATS = [
  { value: "Tsh 25M+", label: "Investment & Revenue Impact" },
  { value: "10+", label: "Years Combined Expertise" },
  { value: "40+", label: "Active Partnerships" },
];

const AUDIENCE = ["Investors", "Diaspora", "Entrepreneurs", "Corporate Explorers", "Discerning Travelers"];

const SERVICES = [
  {
    title: "Investment Safari Tours",
    href: "/experiences/luxury-fly-in",
    image: "/tour1.webp",
    bullets: ["Visit real business sites", "Meet local partners & experts", "Tourism, real estate, SMEs"],
  },
  {
    title: "Cultural Immersion Experiences",
    href: "/experiences/honeymoon",
    image: "/tour2.webp",
    bullets: ["Authentic community engagement", "Living heritage of Tanzania", "Beyond the tourist trail"],
  },
  {
    title: "Bush & Beach Luxury Safaris",
    href: "/experiences/photographic",
    image: "/tour3.webp",
    bullets: ["Iconic parks + Zanzibar coast", "Premium camps & lodges", "Privacy, comfort, wild access"],
  },
  {
    title: "Diaspora Opportunity Tours",
    href: "/experiences/conservation",
    image: "/tour4.webp",
    bullets: ["Reconnect & reinvest", "Curated sector exposure", "Long-term roots, new ventures"],
  },
];

const TESTIMONIALS = [
  {
    quote:
      "TANTREK 360 didn't just take us on safari — they introduced us to the right people, walked us through the real markets, and stayed with us long after we flew home. That is rare.",
    name: "Daniel A.",
    trip: "Investment Safari — 10 days",
    initials: "DA",
  },
  {
    quote:
      "As diaspora returning after 18 years, we needed more than a holiday. We needed direction. The team turned our trip into a launchpad — real partners, real opportunities, real support.",
    name: "Esther & Bernard K.",
    trip: "Diaspora Opportunity Tour",
    initials: "EK",
  },
  {
    quote:
      "Curated, professional, and unhurried. The Bush & Beach itinerary balanced Ruaha's wildness with Zanzibar's calm — and the business briefings were sharp and honest.",
    name: "Maria V.",
    trip: "Bush & Beach Luxury",
    initials: "MV",
  },
];

export default function HomePage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [heroPhase, setHeroPhase] = useState<"slideshow" | "map">("slideshow");
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const heroVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [home, setHome] = useState<Required<HomeContent>>(STATIC_HOME);
  const [heroSlides, setHeroSlides] = useState(STATIC_HERO_SLIDES);

  useEffect(() => {
    Promise.allSettled([
      publicApi.getHomeContent(),
      publicApi.getHeroSlides(),
    ]).then(([homeRes, slidesRes]) => {
      if (homeRes.status === "fulfilled" && homeRes.value) {
        setHome({ ...STATIC_HOME, ...homeRes.value });
      }
      if (slidesRes.status === "fulfilled" && slidesRes.value?.length) {
        const active = slidesRes.value
          .filter((s) => s.isActive !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        if (active.length > 0) {
          setHeroSlides(active.map((s) => ({ src: s.src, alt: s.alt ?? "" })));
        }
      }
    });
  }, []);

  const goTo = useCallback((index: number) => {
    setTestimonialIndex(() => {
      if (index < 0) return TESTIMONIALS.length - 1;
      if (index >= TESTIMONIALS.length) return 0;
      return index;
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo(testimonialIndex + 1), 6000);
    return () => clearInterval(t);
  }, [testimonialIndex, goTo]);

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

  return (
    <>
      {/* Hero — cinematic videos with navy overlay + orange CTA */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-tantrek-navy-deep">
          {heroSlides.map((slide, i) => (
            <motion.div
              key={slide.src}
              initial={false}
              animate={{
                opacity: heroSlideIndex === i ? 1 : 0,
                zIndex: heroSlideIndex === i ? 1 : 0,
                pointerEvents: heroSlideIndex === i ? "auto" : "none",
              }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <video
                ref={(el) => { heroVideoRefs.current[i] = el; }}
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
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-hero-overlay pointer-events-none z-[2]" aria-hidden />
          {/* Subtle orange glow accent in upper-right */}
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 80% 25%, rgba(255,122,0,0.18), transparent 70%)",
            }}
            aria-hidden
          />
        </div>

        <AnimatedTanzaniaMap isActive={heroPhase === "map"} onComplete={onMapComplete} />

        {heroPhase === "slideshow" && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 px-4 sm:px-6 text-center max-w-5xl mx-auto pb-20"
          >
            {home.heroEyebrow && (
              <p className="font-body text-tantrek-orange text-[11px] sm:text-xs font-semibold tracking-[0.32em] uppercase mb-6">
                {home.heroEyebrow}
              </p>
            )}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.04] font-bold tracking-tight">
              {heroLines[0]}
              {heroLines[1] && (
                <>
                  <br />
                  <span className="text-tantrek-orange">{heroLines[1]}</span>
                </>
              )}
            </h1>
            {home.heroSubhead && (
              <p className="mt-7 text-base sm:text-lg text-white/85 max-w-2xl mx-auto font-body font-normal leading-relaxed">
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
                  href={home.heroCtaSecondaryHref || "/experiences"}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-tantrek-navy-deep hover:border-white w-full sm:w-auto"
                >
                  {home.heroCtaSecondary}
                </Link>
              )}
            </div>

            {/* Quick trust strip */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-white/65 text-[11px] uppercase tracking-[0.22em] font-medium">
              <span>Tourism</span>
              <span className="w-1 h-1 rounded-full bg-tantrek-orange" aria-hidden />
              <span>Investment</span>
              <span className="w-1 h-1 rounded-full bg-tantrek-orange" aria-hidden />
              <span>End-to-end Support</span>
            </div>
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

      {/* Impact stats strip */}
      <section className="relative z-20 bg-white border-b border-tantrek-border py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {IMPACT_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="tantrek-stat-card px-6 py-7 text-center"
            >
              <div className="font-display text-4xl sm:text-5xl text-tantrek-navy leading-none font-bold">
                {stat.value}
              </div>
              <div className="mt-3 font-body text-[12px] tracking-[0.18em] uppercase text-tantrek-text-muted font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white luxury-section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 lg:mb-16 space-y-4">
            <p className="font-body text-tantrek-orange text-[11px] font-bold tracking-[0.32em] uppercase">
              Why Choose Us
            </p>
            <div className="luxury-gold-line mx-auto" aria-hidden />
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight max-w-4xl mx-auto">
              We Operate with Unwavering{" "}
              <span className="text-tantrek-orange">Honesty &amp; Integrity</span>
            </h2>
            <p className="text-tantrek-text-muted max-w-3xl mx-auto leading-relaxed text-base">
              Every engagement is built on transparency, accountability, and trust. We act in our
              clients&apos; best interests — delivering reliable guidance, ethical solutions, and
              long-term partnerships grounded in credibility and professional excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {WHY_CHOOSE_US.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="luxury-pillar-card p-7 lg:p-8 text-center space-y-5"
              >
                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-tantrek-orange/10 text-tantrek-orange">
                    {item.icon === "globe" && (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <circle cx="12" cy="12" r="9" strokeWidth={1.7} />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
                      </svg>
                    )}
                    {item.icon === "layers" && (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5" />
                      </svg>
                    )}
                    {item.icon === "trending" && (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 17l6-6 4 4 8-8M17 7h4v4" />
                      </svg>
                    )}
                    {item.icon === "shield" && (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12l2 2 4-4" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="space-y-2.5">
                  <h3 className="font-display text-tantrek-navy text-base font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-tantrek-text-muted text-sm leading-relaxed">
                    {item.copy}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 360° Success Journey */}
      <section className="bg-tantrek-surface luxury-section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 lg:mb-16 space-y-4">
            <p className="font-body text-tantrek-orange text-[11px] font-bold tracking-[0.32em] uppercase">
              Our Process
            </p>
            <div className="luxury-gold-line mx-auto" aria-hidden />
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight">
              The 360° <span className="text-tantrek-orange">Success Journey</span>
            </h2>
            <p className="text-tantrek-text-muted max-w-2xl mx-auto leading-relaxed">
              Our integrated approach guides you through every stage of our Safari &amp; Opportunity Tours service.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-tantrek-orange/0 via-tantrek-orange/45 to-tantrek-orange/0" aria-hidden />
            {JOURNEY_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-white border border-tantrek-border rounded-2xl p-7 lg:p-8 h-full transition-all duration-300 hover:border-tantrek-orange/40 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
                  <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-tantrek-orange text-white font-display text-lg font-bold shadow-[0_8px_22px_rgba(255,122,0,0.32)] mx-auto mb-6">
                    {step.step}
                  </div>
                  <h3 className="font-display text-lg lg:text-xl text-tantrek-navy text-center mb-3 font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-tantrek-text-muted text-sm leading-relaxed text-center">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="bg-white luxury-section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-body text-tantrek-orange text-[11px] font-bold tracking-[0.32em] uppercase mb-4">
                Problems We Solve
              </p>
              <div className="luxury-gold-line mb-6" aria-hidden />
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight">
                Explore Tanzania.<br />
                <span className="text-tantrek-orange">Discover Opportunities.</span><br />
                Invest with Confidence.
              </h2>
              <p className="mt-6 text-tantrek-text-muted text-base leading-relaxed">
                TANTREK 360 combines tourism, business consultancy, and investment facilitation — offering
                real access to Tanzania&apos;s opportunities, not just sightseeing.
              </p>
              <p className="mt-4 font-display italic text-tantrek-navy text-lg font-medium">
                &ldquo;Your journey into Tanzania&apos;s opportunities starts here.&rdquo;
              </p>
              <Button href="/plan-your-safari" variant="primary" className="mt-8">
                Speak to an Expert
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-10"
            >
              <div>
                <p className="font-body text-tantrek-navy text-[11px] font-bold tracking-[0.28em] uppercase mb-4">
                  Designed for
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {AUDIENCE.map((label) => (
                    <span
                      key={label}
                      className="px-4 py-2 rounded-full bg-tantrek-surface border border-tantrek-border text-tantrek-navy text-xs font-medium tracking-wide"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-body text-tantrek-navy text-[11px] font-bold tracking-[0.28em] uppercase mb-3">
                  What we deliver
                </p>
                {[
                  "Safari + Business Opportunity Exploration",
                  "Local Expertise with Global Standards",
                  "End-to-End Support (Travel → Investment → Setup)",
                ].map((line) => (
                  <div key={line} className="flex items-start gap-3 text-tantrek-text">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tantrek-orange/15 text-tantrek-orange">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm leading-relaxed">{line}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-tantrek-surface luxury-section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-14">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-body text-tantrek-orange text-[11px] font-bold tracking-[0.32em] uppercase mb-4"
            >
              Safari &amp; Opportunity Tours
            </motion.p>
            <div className="luxury-gold-line mx-auto mb-6" aria-hidden />
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight"
            >
              Curated journeys for those who want{" "}
              <span className="text-tantrek-orange">more than sightseeing</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="mt-5 text-tantrek-text-muted max-w-2xl mx-auto leading-relaxed"
            >
              Designed for investors, entrepreneurs, discerning tourists, and global professionals — every
              experience blends Tanzania&apos;s natural wonder with real-world opportunity.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={service.href} className="tantrek-service-card group block h-full">
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tantrek-navy-deep/45 to-transparent" aria-hidden />
                  </div>
                  <div className="p-7 lg:p-8 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="h-0.5 w-10 bg-tantrek-orange group-hover:w-14 transition-all duration-300 rounded-full" aria-hidden />
                      <h3 className="font-display text-xl lg:text-2xl text-tantrek-navy group-hover:text-tantrek-orange transition-colors font-semibold">
                        {service.title}
                      </h3>
                    </div>
                    <ul className="space-y-2.5">
                      {service.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-tantrek-text-muted text-sm leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-tantrek-orange shrink-0" aria-hidden />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex items-center gap-2 font-body text-tantrek-orange text-xs font-semibold tracking-wider uppercase pt-1">
                      Discover service
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrity quote — dark navy section (one of two dark surfaces) */}
      <section className="section-bg-our-story relative luxury-section-padding overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${home.ourStoryBgImage || "/tour8.webp"})` }}
          aria-hidden
        />
        <div className="absolute inset-0 our-story-overlay" aria-hidden />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="font-body text-xs sm:text-sm font-semibold tracking-[0.32em] uppercase text-tantrek-orange">
              Our Standard
            </p>
            {home.ourStoryQuote && (
              <p className="font-display mt-7 text-2xl sm:text-3xl lg:text-4xl text-white leading-snug font-medium">
                &ldquo;{home.ourStoryQuote}&rdquo;
              </p>
            )}
            <div className="luxury-gold-line-wide mx-auto mt-6" aria-hidden />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mt-10 lg:mt-12 px-0 sm:px-4"
          >
            <div className="border-l-2 border-tantrek-orange/60 pl-6 sm:pl-8 py-1 text-white/90 text-base sm:text-lg leading-relaxed space-y-5">
              {home.ourStoryBody.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-12 text-center"
          >
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/45 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white hover:text-tantrek-navy-deep hover:border-white"
            >
              About TANTREK 360
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Where We Go — Tanzania circuits with sky-blue accent */}
      <section className="bg-white luxury-section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-body text-tantrek-orange text-[11px] font-bold tracking-[0.32em] uppercase mb-4"
            >
              Where We Operate
            </motion.p>
            <div className="luxury-gold-line mx-auto mb-6" aria-hidden />
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight"
            >
              Tanzania in <span className="text-tantrek-orange">360°</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-tantrek-text-muted text-base mt-4 max-w-xl mx-auto"
            >
              Three circuits, one standard of excellence — wilderness and opportunity, end to end.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: "Northern Circuit", desc: "Serengeti, Ngorongoro, Tarangire, Lake Manyara.", href: "/destinations/northern", bg: "/tour6.webp" },
              { title: "Southern Circuit", desc: "Julius Nyerere, Ruaha — the soul of wilderness.", href: "/destinations/southern", bg: "/tour7.webp" },
              { title: "Western Circuit", desc: "Katavi — Africa's last true frontier.", href: "/destinations/western", bg: "/wild.jpg" },
            ].map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={item.href}
                  className="luxury-circuit-card group p-7 lg:p-9 h-full min-h-[300px] flex flex-col justify-end transition-all duration-500"
                  style={{ backgroundImage: `url(${item.bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
                >
                  <span className="relative z-10">
                    <div className="h-0.5 w-10 bg-tantrek-orange mb-5 group-hover:w-16 transition-all duration-300 rounded-full" aria-hidden />
                    <h3 className="font-display text-xl lg:text-2xl text-white font-semibold tracking-tight group-hover:text-tantrek-orange transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-white/90 text-sm font-body leading-relaxed">
                      {item.desc}
                    </p>
                    <span className="inline-flex items-center gap-1.5 mt-5 font-body text-white text-[11px] font-bold tracking-[0.22em] uppercase group-hover:gap-3 transition-all">
                      Discover <span aria-hidden>→</span>
                    </span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-14 text-center"
          >
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 font-body text-tantrek-navy text-sm font-semibold tracking-wide hover:text-tantrek-orange transition-colors"
            >
              Explore all destinations
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-tantrek-surface luxury-section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="font-body text-tantrek-orange text-[11px] font-bold tracking-[0.32em] uppercase mb-3">
              In their words
            </p>
            <div className="luxury-gold-line mx-auto mb-6" aria-hidden />
            <h2 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold">
              Traveler &amp; investor stories
            </h2>
          </motion.div>

          <div className="relative min-h-[300px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full"
              >
                <div className="luxury-testimonial-card p-8 sm:p-10 lg:p-12 text-center">
                  <div className="flex justify-center mb-6">
                    <span className="text-tantrek-orange" aria-hidden>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className="inline-block w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </span>
                  </div>
                  <blockquote className="font-display text-lg sm:text-xl lg:text-2xl text-tantrek-text leading-relaxed font-medium">
                    &ldquo;{TESTIMONIALS[testimonialIndex].quote}&rdquo;
                  </blockquote>
                  <footer className="mt-8 flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tantrek-navy text-white font-display text-sm font-semibold">
                      {TESTIMONIALS[testimonialIndex].initials}
                    </div>
                    <p className="mt-3 font-body font-semibold text-tantrek-navy">
                      {TESTIMONIALS[testimonialIndex].name}
                    </p>
                    <p className="mt-1 font-body text-sm text-tantrek-text-muted">
                      {TESTIMONIALS[testimonialIndex].trip}
                    </p>
                  </footer>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-4 mt-10">
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
                {TESTIMONIALS.map((_, i) => (
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
        </div>
      </section>

      {/* Final CTA — navy section */}
      <section className="section-bg-frontier relative luxury-section-padding overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: "url(/tour8.webp)" }}
          aria-hidden
        />
        <div className="absolute inset-0 frontier-overlay" aria-hidden />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-body text-tantrek-orange text-[11px] font-bold tracking-[0.32em] uppercase mb-6"
          >
            Begin your 360° journey
          </motion.p>
          <div className="luxury-gold-line mx-auto mb-8" aria-hidden />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-[1.15]"
          >
            {home.finalCtaHeadline}
          </motion.h2>
          {home.finalCtaSubcopy && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="mt-7 text-white/85 font-body text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
            >
              {home.finalCtaSubcopy}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {home.finalCtaButtonLabel && (
              <Link
                href={home.finalCtaButtonHref || "/plan-your-safari"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-tantrek-orange px-8 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,122,0,0.4)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5 w-full sm:w-auto"
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
          </motion.div>
        </div>
      </section>
    </>
  );
}
