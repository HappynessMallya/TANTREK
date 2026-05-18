"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

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
      "What sets TANTREK apart is integrity. Decisions are made in our interest. That alone is worth flying across the world for.",
    name: "Dr. Richard Vance",
    location: "Dubai, UAE",
  },
];

const TEAM = [
  {
    name: "Emmanuel K.",
    role: "Head of Field Operations",
    imageUrl: "https://ui-avatars.com/api/?name=Emmanuel+K&size=400&background=003B8E&color=FFFFFF&bold=true",
    alt: "Emmanuel K., Head of Field Operations",
  },
  {
    name: "Sarah M.",
    role: "Client Experience Director",
    imageUrl: "https://ui-avatars.com/api/?name=Sarah+M&size=400&background=003B8E&color=FFFFFF&bold=true",
    alt: "Sarah M., Client Experience Director",
  },
  {
    name: "Dr. Lucas J.",
    role: "Investment Advisor",
    imageUrl: "https://ui-avatars.com/api/?name=Lucas+J&size=400&background=003B8E&color=FFFFFF&bold=true",
    alt: "Dr. Lucas J., Investment Advisor",
  },
  {
    name: "Nia W.",
    role: "Private Concierge",
    imageUrl: "https://ui-avatars.com/api/?name=Nia+W&size=400&background=003B8E&color=FFFFFF&bold=true",
    alt: "Nia W., Private Concierge",
  },
];

const FOUNDER_QUOTE =
  "Tanzania is not just a destination — it is an opportunity. Our mission at TANTREK 360 is to open it honestly: as wilderness worth protecting, as culture worth learning from, and as a market worth investing in. Every journey we curate should leave both the traveler and the land richer for the encounter.";

const SECTORS = ["Tourism", "Safaris", "Investment"];

export function AboutContent() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    if (index < 0) setTestimonialIndex(ABOUT_TESTIMONIALS.length - 1);
    else if (index >= ABOUT_TESTIMONIALS.length) setTestimonialIndex(0);
    else setTestimonialIndex(index);
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo(testimonialIndex + 1), 6000);
    return () => clearInterval(t);
  }, [testimonialIndex, goTo]);

  return (
    <>
      {/* Hero — navy overlay over imagery */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden pt-20">
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
            style={{ background: "radial-gradient(ellipse 50% 40% at 80% 25%, rgba(255,122,0,0.18), transparent 70%)" }}
            aria-hidden
          />
        </div>
        <div className="relative z-10 px-4 text-center max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-tantrek-orange text-[11px] sm:text-xs font-bold tracking-[0.36em] uppercase mb-6"
          >
            About TANTREK 360
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl mb-6"
          >
            A 360° Ecosystem of{" "}
            <span className="text-tantrek-orange">Travel, Trust &amp; Trade</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/90 text-base sm:text-lg font-body leading-relaxed max-w-2xl mx-auto"
          >
            We connect business, tourism, and investment under one trusted platform — guiding investors,
            entrepreneurs, diaspora, and discerning travelers through Tanzania end-to-end.
          </motion.p>
        </div>
      </section>

      {/* Foundation — white panel overlapping hero */}
      <section className="relative z-20 px-4 pb-24 sm:px-6 lg:px-8 -mt-20">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl p-8 shadow-elevated border border-tantrek-border md:p-14">
          <div className="grid gap-10 items-center md:grid-cols-2">
            <div>
              <span className="text-tantrek-orange font-body font-bold tracking-[0.28em] text-[11px] uppercase mb-3 block">
                Our Foundation
              </span>
              <h2 className="font-display text-3xl font-bold text-tantrek-navy mb-5 md:text-4xl leading-tight">
                Built on <span className="text-tantrek-orange">unwavering honesty &amp; integrity</span>
              </h2>
              <p className="text-tantrek-text-muted leading-relaxed mb-4 text-base">
                TANTREK 360 was founded on a simple conviction: that travel into Tanzania should also be
                travel into Tanzania&apos;s real economy. Wilderness and opportunity are inseparable here —
                and both deserve to be opened ethically.
              </p>
              <p className="text-tantrek-text-muted leading-relaxed mb-6 text-base">
                Every engagement is built on transparency, accountability, and trust. We act in our
                clients&apos; best interests — delivering reliable guidance, ethical solutions, and long-term
                partnerships grounded in credibility and professional excellence.
              </p>
              <div className="flex flex-wrap gap-2">
                {SECTORS.map((s) => (
                  <span
                    key={s}
                    className="px-3.5 py-1.5 rounded-full bg-tantrek-surface border border-tantrek-border text-tantrek-navy text-xs font-semibold tracking-wide"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/5] relative shadow-card">
              <Image
                src="/tour2.webp"
                alt="TANTREK 360 in the field"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Travel, Trade, Trust */}
      <section className="bg-tantrek-surface luxury-section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-tantrek-orange font-body font-bold tracking-[0.32em] text-[11px] uppercase mb-4">
              What We Do
            </p>
            <div className="luxury-gold-line mx-auto mb-6" aria-hidden />
            <h2 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold">
              Three commitments, <span className="text-tantrek-orange">one journey</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Travel",
                body: "Curated safari and cultural journeys — Tanzania's iconic parks, communities, and coast, delivered with precision and warmth.",
              },
              {
                title: "Trade",
                body: "Real exposure to Tanzanian markets — tourism, real estate, SMEs, and beyond. Verified partners, honest briefings, considered introductions.",
              },
              {
                title: "Trust",
                body: "End-to-end facilitation, from entity setup and compliance to ongoing partnership support — long after the safari ends.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="tantrek-card p-8 lg:p-10"
              >
                <div className="font-display text-tantrek-orange text-5xl mb-4 font-bold leading-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-2xl text-tantrek-navy mb-3 font-semibold">
                  {item.title}
                </h3>
                <p className="text-tantrek-text-muted leading-relaxed text-sm">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reflections / testimonials — navy section */}
      <section className="relative overflow-hidden bg-tantrek-navy-deep py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src="/tour5.webp"
            alt=""
            fill
            className="object-cover blur-sm scale-110"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-tantrek-navy-deep/75" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-tantrek-orange font-body font-bold tracking-[0.32em] text-[11px] uppercase mb-3 block">
                Reflections
              </span>
              <h2 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                Client testimonials
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
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
                className="about-testimonial-glass relative flex flex-col rounded-2xl p-8 md:p-10 lg:p-12 max-w-3xl mx-auto"
              >
                <span className="font-display text-tantrek-orange text-5xl absolute left-6 top-4 lg:text-6xl font-bold" aria-hidden>
                  &ldquo;
                </span>
                <div className="relative z-10 pt-6">
                  <p className="text-white/95 text-lg leading-relaxed mb-7 md:text-xl font-body">
                    {ABOUT_TESTIMONIALS[testimonialIndex].quote}
                  </p>
                  <h4 className="font-display text-xl font-bold text-white">
                    {ABOUT_TESTIMONIALS[testimonialIndex].name}
                  </h4>
                  <p className="text-tantrek-orange text-xs font-body font-bold tracking-[0.22em] uppercase mt-1">
                    {ABOUT_TESTIMONIALS[testimonialIndex].location}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mx-auto mt-8 h-px w-full max-w-2xl bg-white/15 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute left-0 top-0 h-full bg-tantrek-orange"
              initial={false}
              animate={{ width: `${((testimonialIndex + 1) / ABOUT_TESTIMONIALS.length) * 100}%` }}
              transition={{ type: "tween", duration: 0.3 }}
            />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white luxury-section-padding">
        <div className="max-w-6xl mx-auto text-center mb-14 px-4 sm:px-6 lg:px-8">
          <span className="text-tantrek-orange font-body font-bold tracking-[0.32em] text-[11px] uppercase mb-3 block">
            The Team
          </span>
          <div className="luxury-gold-line mx-auto mb-6" aria-hidden />
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-tantrek-navy mb-4">
            The People Behind the <span className="text-tantrek-orange">360°</span>
          </h2>
          <p className="text-tantrek-text-muted max-w-2xl mx-auto font-body">
            Field operators, business advisors, and concierges — combining deep Tanzania experience with
            global professional standards.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12 px-4 sm:px-6 lg:px-8">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative size-32 overflow-hidden rounded-full ring-4 ring-tantrek-orange/15 mb-4 md:size-40 shadow-card">
                <Image
                  src={member.imageUrl}
                  alt={member.alt}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
              <h4 className="font-display text-lg font-semibold text-tantrek-navy">{member.name}</h4>
              <p className="text-tantrek-text-muted text-sm font-body mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Founder quote — soft surface */}
      <section className="bg-tantrek-surface py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-display text-tantrek-orange text-5xl md:text-6xl leading-none font-bold" aria-hidden>
            &ldquo;
          </span>
          <blockquote className="font-display text-xl text-tantrek-text leading-relaxed mb-10 md:text-2xl lg:text-3xl font-medium mt-2">
            {FOUNDER_QUOTE}
          </blockquote>
          <footer className="flex flex-col items-center gap-2">
            <cite className="font-display text-tantrek-navy text-xl not-italic font-bold md:text-2xl">
              TANTREK 360 Founders
            </cite>
            <p className="text-tantrek-text-muted text-xs font-body tracking-[0.22em] uppercase">
              Vision &amp; Leadership
            </p>
            <div className="mt-5 w-16 h-0.5 rounded-full bg-tantrek-orange" />
          </footer>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-t border-tantrek-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-tantrek-navy mb-5 lg:text-3xl">
            Impact &amp; Community
          </h2>
          <p className="text-tantrek-text-muted leading-relaxed font-body">
            Our work is built on long-term partnerships with Tanzanian communities, conservation partners,
            and ethical operators. Travel and investment, done with integrity, leave both the land and the
            people better than we found them.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/sustainability" variant="outline">
              Our Impact
            </Button>
            <Button href="/plan-your-safari" variant="primary">
              Speak to an Expert
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
