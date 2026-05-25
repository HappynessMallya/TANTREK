"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const ABOUT_TESTIMONIALS = [
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

const TEAM = [
  {
    name: "Emmanuel K.",
    role: "Head of Field Operations",
    imageUrl:
      "https://ui-avatars.com/api/?name=Emmanuel+K&size=400&background=003B8E&color=FFFFFF&bold=true",
    alt: "Emmanuel K., Head of Field Operations",
  },
  {
    name: "Sarah M.",
    role: "Client Experience Director",
    imageUrl:
      "https://ui-avatars.com/api/?name=Sarah+M&size=400&background=003B8E&color=FFFFFF&bold=true",
    alt: "Sarah M., Client Experience Director",
  },
  {
    name: "Dr. Lucas J.",
    role: "Investment Advisor",
    imageUrl:
      "https://ui-avatars.com/api/?name=Lucas+J&size=400&background=003B8E&color=FFFFFF&bold=true",
    alt: "Dr. Lucas J., Investment Advisor",
  },
  {
    name: "Nia W.",
    role: "Private Concierge",
    imageUrl:
      "https://ui-avatars.com/api/?name=Nia+W&size=400&background=003B8E&color=FFFFFF&bold=true",
    alt: "Nia W., Private Concierge",
  },
];

const FOUNDER_QUOTE =
  "Tanzania is not just a destination — it is an opportunity. Our mission at Tantrek is to open it honestly: as wilderness worth protecting, as culture worth learning from, and as a market worth investing in. Every journey we curate should leave both the traveller and the land richer for the encounter.";

const COMMITMENTS = [
  {
    number: "01",
    title: "Travel",
    body:
      "Curated safari and cultural journeys — Tanzania's iconic parks, communities, and coast, delivered with precision and warmth.",
  },
  {
    number: "02",
    title: "Trade",
    body:
      "Real exposure to Tanzanian markets — tourism, real estate, SMEs, and beyond. Verified partners, honest briefings, considered introductions.",
  },
  {
    number: "03",
    title: "Trust",
    body:
      "End-to-end facilitation, from entity setup and compliance to ongoing partnership support — long after the safari ends.",
  },
];

export function AboutContent() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    if (index < 0) setTestimonialIndex(ABOUT_TESTIMONIALS.length - 1);
    else if (index >= ABOUT_TESTIMONIALS.length) setTestimonialIndex(0);
    else setTestimonialIndex(index);
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo(testimonialIndex + 1), 7000);
    return () => clearInterval(t);
  }, [testimonialIndex, goTo]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          1 · Cinematic hero
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/tour8.webp"
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
            About Tantrek
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-bold leading-[1.04] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[84px] mb-7"
          >
            Travel, trade, and{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              trust.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/90 text-base sm:text-lg lg:text-xl font-body leading-relaxed max-w-2xl mx-auto"
          >
            A small Tanzanian house of safari designers, country specialists,
            and business advisors — guiding travellers, investors, and
            returning diaspora through Tanzania end-to-end.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2 · Foundation — editorial 2-column, white-dominant
          ═══════════════════════════════════════════════════════════════════ */}
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
                Our Foundation
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight">
                Built on unwavering{" "}
                <span className="font-serif italic font-normal text-tantrek-orange">
                  honesty &amp; integrity.
                </span>
              </h2>
              <div className="mt-8 space-y-5 font-body text-tantrek-text-muted text-base lg:text-lg leading-relaxed">
                <p>
                  Tantrek was founded on a simple conviction: that travel into
                  Tanzania should also be travel into Tanzania&rsquo;s real
                  economy. Wilderness and opportunity are inseparable here —
                  and both deserve to be opened ethically.
                </p>
                <p>
                  Every engagement is built on transparency, accountability,
                  and trust. We act in our clients&rsquo; best interests —
                  delivering reliable guidance, ethical solutions, and
                  long-term partnerships grounded in credibility and quiet
                  professional excellence.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {["Tourism", "Safaris", "Investment"].map((s) => (
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
                  src="/tour2.webp"
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

      {/* ═══════════════════════════════════════════════════════════════════
          3 · Travel · Trade · Trust — editorial numbered (not card grid)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-tantrek-surface luxury-section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
            <div className="lg:col-span-5">
              <p className="editorial-eyebrow text-tantrek-orange mb-6">
                What We Do
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight">
                Three commitments,{" "}
                <span className="font-serif italic font-normal text-tantrek-orange">
                  one journey.
                </span>
              </h2>
              <p className="mt-5 text-tantrek-text-muted text-base lg:text-lg leading-relaxed max-w-md">
                Each part of what we do supports the other. That&rsquo;s the
                360°.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-9">
              {COMMITMENTS.map((c, i) => (
                <motion.div
                  key={c.number}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="editorial-reason"
                >
                  <span className="reason-number">{c.number}</span>
                  <h3 className="font-display text-xl lg:text-2xl text-tantrek-navy font-semibold mb-2">
                    {c.title}
                  </h3>
                  <p className="text-tantrek-text-muted text-base leading-relaxed max-w-2xl">
                    {c.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4 · Reflections — editorial pull-quote testimonials (navy)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-tantrek-navy-deep editorial-section-padding px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 opacity-22">
          <Image
            src="/tour5.webp"
            alt=""
            fill
            className="object-cover blur-sm scale-110"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-tantrek-navy-deep/78" aria-hidden />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex flex-col gap-6 mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="editorial-eyebrow text-tantrek-orange mb-5">
                Reflections
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight">
                In their{" "}
                <span className="font-serif italic font-normal text-tantrek-orange">
                  words.
                </span>
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
                  &ldquo;{ABOUT_TESTIMONIALS[testimonialIndex].quote}&rdquo;
                </blockquote>
                <footer className="mt-8">
                  <p className="font-display text-lg text-white font-semibold">
                    {ABOUT_TESTIMONIALS[testimonialIndex].name}
                  </p>
                  <p className="text-tantrek-orange text-xs font-body font-bold tracking-[0.22em] uppercase mt-1">
                    {ABOUT_TESTIMONIALS[testimonialIndex].location}
                  </p>
                </footer>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 h-px w-full max-w-md bg-white/15 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute left-0 top-0 h-full bg-tantrek-orange"
              initial={false}
              animate={{
                width: `${((testimonialIndex + 1) / ABOUT_TESTIMONIALS.length) * 100}%`,
              }}
              transition={{ type: "tween", duration: 0.3 }}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5 · Team — refined, editorial framing
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white luxury-section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14 lg:mb-16">
            <p className="editorial-eyebrow text-tantrek-orange mb-5">
              The Team
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight">
              The people behind{" "}
              <span className="font-serif italic font-normal text-tantrek-orange">
                the 360°.
              </span>
            </h2>
            <p className="mt-5 text-tantrek-text-muted text-base lg:text-lg leading-relaxed">
              Field operators, business advisors, and concierges — combining
              deep Tanzania experience with global professional standards.
              Owner-led, Tanzania-based.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative size-28 overflow-hidden rounded-full ring-4 ring-tantrek-orange/15 mb-4 md:size-36 shadow-card">
                  <Image
                    src={member.imageUrl}
                    alt={member.alt}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                </div>
                <h4 className="font-display text-lg font-semibold text-tantrek-navy">
                  {member.name}
                </h4>
                <p className="text-tantrek-text-muted text-sm font-body mt-1">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
          <p className="mt-12 text-center text-tantrek-text-soft text-xs italic font-body">
            Portrait placeholders — to be replaced with team photography.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6 · Founder quote — editorial pull-quote
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-tantrek-surface editorial-section-padding px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="editorial-eyebrow text-tantrek-orange mb-8 justify-center text-center mx-auto block w-fit">
            From the Founders
          </p>
          <blockquote className="editorial-pullquote text-2xl sm:text-3xl lg:text-[36px] text-tantrek-navy-deep">
            {FOUNDER_QUOTE}
          </blockquote>
          <footer className="mt-10 text-center">
            <cite className="font-display text-tantrek-navy text-lg lg:text-xl not-italic font-bold">
              Tantrek Founders
            </cite>
            <p className="text-tantrek-text-muted text-[11px] font-body tracking-[0.24em] uppercase mt-1">
              Vision &amp; Leadership
            </p>
            <div className="mt-5 mx-auto w-16 h-0.5 rounded-full bg-tantrek-orange" />
          </footer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          7 · Concierge CTA — matches site language
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="section-bg-frontier relative editorial-section-padding overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url(/tour8.webp)" }}
          aria-hidden
        />
        <div className="absolute inset-0 frontier-overlay" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <p className="editorial-eyebrow text-tantrek-orange mb-6 justify-center">
            Begin a Conversation
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-[1.12]">
            Impact, community, and{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              the long view.
            </span>
          </h2>
          <p className="mt-6 text-white/85 font-body text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Our work is built on long-term partnerships with Tanzanian
            communities, conservation partners, and ethical operators.
            Talk to us about what you have in mind.
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
