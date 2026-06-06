"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { publicApi, type AboutContent as AboutContentType } from "@/lib/public-api";

// ─── Static defaults (current live content) ─────────────────────────────────
const DEFAULT_TESTIMONIALS = [
  {
    quote:
      "TANTREK 360 turned a familiarisation trip into a real foothold in Tanzania — verified partners, honest market briefings, and a team that stayed in touch long after we flew home.",
    name: "The Henderson Family",
    location: "London, UK",
  },
  {
    quote:
      "I came looking for opportunities. I left with relationships, a clear sector strategy, and a partner on the ground I trust to keep the momentum going.",
    name: "James Sterling",
    location: "New York, USA",
  },
  {
    quote:
      "Wilderness, culture, and business — woven together with such craft that it never once felt scripted. Every guide and every introduction was deliberate.",
    name: "Elena Moretti",
    location: "Milan, Italy",
  },
  {
    quote:
      "What sets Tantrek apart is integrity. Decisions are made in our interest. That alone is worth flying across the world for.",
    name: "Dr. Richard Vance",
    location: "Dubai, UAE",
  },
];

const DEFAULT_TEAM = [
  { name: "Emmanuel K.", role: "Head of Field Operations", imageUrl: "https://ui-avatars.com/api/?name=Emmanuel+K&size=400&background=003B8E&color=FFFFFF&bold=true", alt: "Emmanuel K., Head of Field Operations" },
  { name: "Sarah M.", role: "Client Experience Director", imageUrl: "https://ui-avatars.com/api/?name=Sarah+M&size=400&background=003B8E&color=FFFFFF&bold=true", alt: "Sarah M., Client Experience Director" },
  { name: "Dr. Lucas J.", role: "Investment Advisor", imageUrl: "https://ui-avatars.com/api/?name=Lucas+J&size=400&background=003B8E&color=FFFFFF&bold=true", alt: "Dr. Lucas J., Investment Advisor" },
  { name: "Nia W.", role: "Private Concierge", imageUrl: "https://ui-avatars.com/api/?name=Nia+W&size=400&background=003B8E&color=FFFFFF&bold=true", alt: "Nia W., Private Concierge" },
];

const DEFAULT_COMMITMENTS = [
  { number: "01", title: "Travel", body: "Curated safari and cultural journeys — Tanzania's iconic parks, communities, and coast, delivered with precision and warmth." },
  { number: "02", title: "Trade", body: "Real exposure to Tanzanian markets — tourism, real estate, SMEs, and beyond. Verified partners, honest briefings, considered introductions." },
  { number: "03", title: "Trust", body: "End-to-end facilitation, from entity setup and compliance to ongoing partnership support — long after the safari ends." },
];

const DEFAULTS = {
  heroEyebrow: "About Tantrek",
  heroImage: "/tour8.webp",
  // Headline rendered as "<main> <accent>" — accent shown in orange italic.
  heroHeadlineMain: "Travel, trade, and",
  heroHeadlineAccent: "trust.",
  heroSubheadline:
    "A small Tanzanian house of safari designers, country specialists, and business advisors — guiding travellers, investors, and returning diaspora through Tanzania end-to-end.",
  foundationEyebrow: "Our Foundation",
  foundationHeadlineMain: "Built on unwavering",
  foundationHeadlineAccent: "honesty & integrity.",
  storyBody:
    "Tantrek was founded on a simple conviction: that travel into Tanzania should also be travel into Tanzania's real economy. Wilderness and opportunity are inseparable here — and both deserve to be opened ethically.\n\nEvery engagement is built on transparency, accountability, and trust. We act in our clients' best interests — delivering reliable guidance, ethical solutions, and long-term partnerships grounded in credibility and quiet professional excellence.",
  foundationTags: ["Tourism", "Safaris", "Investment"],
  foundationImage: "/tour2.webp",
  commitmentsEyebrow: "What We Do",
  commitmentsHeadlineMain: "Three commitments,",
  commitmentsHeadlineAccent: "one journey.",
  commitmentsIntro: "Each part of what we do supports the other. That's the 360°.",
  teamEyebrow: "The Team",
  teamHeadlineMain: "The people behind",
  teamHeadlineAccent: "the 360°.",
  teamIntro:
    "Field operators, business advisors, and concierges — combining deep Tanzania experience with global professional standards. Owner-led, Tanzania-based.",
  teamNote: "Portrait placeholders — to be replaced with team photography.",
  founderQuote:
    "Tanzania is not just a destination — it is an opportunity. Our mission at Tantrek is to open it honestly: as wilderness worth protecting, as culture worth learning from, and as a market worth investing in. Every journey we curate should leave both the traveller and the land richer for the encounter.",
  founderName: "Tantrek Founders",
  founderTitle: "Vision & Leadership",
  ctaEyebrow: "Begin a Conversation",
  ctaHeadlineMain: "Impact, community, and",
  ctaHeadlineAccent: "the long view.",
  ctaBody:
    "Our work is built on long-term partnerships with Tanzanian communities, conservation partners, and ethical operators. Talk to us about what you have in mind.",
};

/** Render a headline that may be a single CMS string OR the default main+accent. */
function Headline({ cms, main, accent }: { cms?: string; main: string; accent: string }) {
  if (cms) return <>{cms}</>;
  return (
    <>
      {main}{" "}
      <span className="font-serif italic font-normal text-tantrek-orange">{accent}</span>
    </>
  );
}

export function AboutContent() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [c, setC] = useState<AboutContentType>({});

  // CMS hydration — merge over defaults.
  useEffect(() => {
    publicApi.getAbout().then((data) => {
      if (data) setC(data);
    });
  }, []);

  const testimonials = c.testimonials?.length ? c.testimonials : DEFAULT_TESTIMONIALS;
  const team = c.team?.length ? c.team : DEFAULT_TEAM;
  const commitments = c.commitments?.length ? c.commitments : DEFAULT_COMMITMENTS;

  const goTo = useCallback(
    (index: number) => {
      const len = testimonials.length;
      if (index < 0) setTestimonialIndex(len - 1);
      else if (index >= len) setTestimonialIndex(0);
      else setTestimonialIndex(index);
    },
    [testimonials.length]
  );

  useEffect(() => {
    const t = setInterval(() => goTo(testimonialIndex + 1), 7000);
    return () => clearInterval(t);
  }, [testimonialIndex, goTo]);

  return (
    <>
      {/* 1 · Cinematic hero */}
      <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src={c.heroImage || DEFAULTS.heroImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-hero-overlay" aria-hidden />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 78% 28%, rgba(255,122,0,0.15), transparent 70%)",
            }}
            aria-hidden
          />
        </div>
        <div className="relative z-10 px-4 text-center max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="editorial-eyebrow text-tantrek-orange mb-6 justify-center"
          >
            {c.heroEyebrow || DEFAULTS.heroEyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-bold leading-[1.04] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[84px] mb-7"
          >
            <Headline cms={c.heroHeadline} main={DEFAULTS.heroHeadlineMain} accent={DEFAULTS.heroHeadlineAccent} />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/90 text-base sm:text-lg lg:text-xl font-body leading-relaxed max-w-2xl mx-auto"
          >
            {c.heroSubheadline || DEFAULTS.heroSubheadline}
          </motion.p>
        </div>
      </section>

      {/* 2 · Foundation */}
      <section className="bg-white editorial-section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 order-2 lg:order-1"
            >
              <p className="editorial-eyebrow text-tantrek-orange mb-6">
                {c.foundationEyebrow || DEFAULTS.foundationEyebrow}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight">
                <Headline cms={c.foundationHeadline} main={DEFAULTS.foundationHeadlineMain} accent={DEFAULTS.foundationHeadlineAccent} />
              </h2>
              <div className="mt-8 space-y-5 font-body text-tantrek-text-muted text-base lg:text-lg leading-relaxed">
                {(c.storyBody || DEFAULTS.storyBody).split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {(c.foundationTags?.length ? c.foundationTags : DEFAULTS.foundationTags).map((s) => (
                  <span
                    key={s}
                    className="px-4 py-2 rounded-full bg-tantrek-surface border border-tantrek-border text-tantrek-navy text-xs font-semibold tracking-wide"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-5 order-1 lg:order-2"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(0,43,91,0.18)]">
                <Image
                  src={c.foundationImage || DEFAULTS.foundationImage}
                  alt="Tantrek in the field"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tantrek-navy-deep/45 via-transparent to-transparent" aria-hidden />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3 · Travel · Trade · Trust */}
      <section className="bg-tantrek-surface luxury-section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
            <div className="lg:col-span-5">
              <p className="editorial-eyebrow text-tantrek-orange mb-6">
                {c.commitmentsEyebrow || DEFAULTS.commitmentsEyebrow}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight">
                <Headline cms={c.commitmentsHeadline} main={DEFAULTS.commitmentsHeadlineMain} accent={DEFAULTS.commitmentsHeadlineAccent} />
              </h2>
              <p className="mt-5 text-tantrek-text-muted text-base lg:text-lg leading-relaxed max-w-md">
                {c.commitmentsIntro || DEFAULTS.commitmentsIntro}
              </p>
            </div>
            <div className="lg:col-span-7 space-y-9">
              {commitments.map((cm, i) => (
                <motion.div
                  key={cm.number ?? cm.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="editorial-reason"
                >
                  <span className="reason-number">{cm.number ?? String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-xl lg:text-2xl text-tantrek-navy font-semibold mb-2">
                    {cm.title}
                  </h3>
                  <p className="text-tantrek-text-muted text-base leading-relaxed max-w-2xl">
                    {cm.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Reflections — testimonials */}
      <section className="relative overflow-hidden bg-tantrek-navy-deep editorial-section-padding px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 opacity-22">
          <Image src="/tour5.webp" alt="" fill className="object-cover blur-sm scale-110" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-tantrek-navy-deep/78" aria-hidden />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex flex-col gap-6 mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="editorial-eyebrow text-tantrek-orange mb-5">Reflections</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight">
                In their{" "}
                <span className="font-serif italic font-normal text-tantrek-orange">words.</span>
              </h2>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => goTo(testimonialIndex - 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-all hover:bg-tantrek-orange hover:border-tantrek-orange"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                type="button"
                onClick={() => goTo(testimonialIndex + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-all hover:bg-tantrek-orange hover:border-tantrek-orange"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div className="relative min-h-[260px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl"
              >
                <blockquote className="font-serif italic text-2xl sm:text-3xl lg:text-[34px] text-white leading-snug">
                  &ldquo;{testimonials[testimonialIndex]?.quote}&rdquo;
                </blockquote>
                <footer className="mt-8">
                  <p className="font-display text-lg text-white font-semibold">
                    {testimonials[testimonialIndex]?.name}
                  </p>
                  {testimonials[testimonialIndex]?.location && (
                    <p className="text-tantrek-orange text-xs font-body font-bold tracking-[0.22em] uppercase mt-1">
                      {testimonials[testimonialIndex]?.location}
                    </p>
                  )}
                </footer>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 h-px w-full max-w-md bg-white/15 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute left-0 top-0 h-full bg-tantrek-orange"
              initial={false}
              animate={{ width: `${((testimonialIndex + 1) / testimonials.length) * 100}%` }}
              transition={{ type: "tween", duration: 0.3 }}
            />
          </div>
        </div>
      </section>

      {/* 5 · Team */}
      <section className="bg-white luxury-section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14 lg:mb-16">
            <p className="editorial-eyebrow text-tantrek-orange mb-5">{c.teamEyebrow || DEFAULTS.teamEyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight">
              <Headline cms={c.teamHeadline} main={DEFAULTS.teamHeadlineMain} accent={DEFAULTS.teamHeadlineAccent} />
            </h2>
            <p className="mt-5 text-tantrek-text-muted text-base lg:text-lg leading-relaxed">
              {c.teamIntro || DEFAULTS.teamIntro}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative size-28 overflow-hidden rounded-full ring-4 ring-tantrek-orange/15 mb-4 md:size-36 shadow-card">
                  <Image src={member.imageUrl} alt={member.alt ?? member.name} fill className="object-cover" sizes="144px" />
                </div>
                <h4 className="font-display text-lg font-semibold text-tantrek-navy">{member.name}</h4>
                <p className="text-tantrek-text-muted text-sm font-body mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
          {(c.teamNote ?? DEFAULTS.teamNote) && (
            <p className="mt-12 text-center text-tantrek-text-soft text-xs italic font-body">
              {c.teamNote ?? DEFAULTS.teamNote}
            </p>
          )}
        </div>
      </section>

      {/* 6 · Founder quote */}
      <section className="bg-tantrek-surface editorial-section-padding px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="editorial-eyebrow text-tantrek-orange mb-8 justify-center text-center mx-auto block w-fit">
            From the Founders
          </p>
          <blockquote className="editorial-pullquote text-2xl sm:text-3xl lg:text-[36px] text-tantrek-navy-deep">
            {c.founderQuote || DEFAULTS.founderQuote}
          </blockquote>
          <footer className="mt-10 text-center">
            <cite className="font-display text-tantrek-navy text-lg lg:text-xl not-italic font-bold">
              {c.founderName || DEFAULTS.founderName}
            </cite>
            <p className="text-tantrek-text-muted text-[11px] font-body tracking-[0.24em] uppercase mt-1">
              {c.founderTitle || DEFAULTS.founderTitle}
            </p>
            <div className="mt-5 mx-auto w-16 h-0.5 rounded-full bg-tantrek-orange" />
          </footer>
        </div>
      </section>

      {/* 7 · Concierge CTA */}
      <section className="section-bg-frontier relative editorial-section-padding overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url(/tour8.webp)" }}
          aria-hidden
        />
        <div className="absolute inset-0 frontier-overlay" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <p className="editorial-eyebrow text-tantrek-orange mb-6 justify-center">
            {c.ctaEyebrow || DEFAULTS.ctaEyebrow}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-[1.12]">
            <Headline cms={c.ctaHeadline} main={DEFAULTS.ctaHeadlineMain} accent={DEFAULTS.ctaHeadlineAccent} />
          </h2>
          <p className="mt-6 text-white/85 font-body text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {c.ctaBody || DEFAULTS.ctaBody}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/plan-your-safari"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-tantrek-orange px-9 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,122,0,0.4)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Speak with a Safari Designer
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/sustainability"
              className="inline-flex items-center gap-2 font-body text-white/85 text-sm tracking-wide hover:text-tantrek-orange transition-colors"
            >
              Our impact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
