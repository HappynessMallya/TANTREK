"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const HERO_IMAGE = "/land.jpg";

// Three commitment pillars — rendered as an editorial 2-column with imagery
// + numbered list rather than the equal 3-card grid the report flagged as
// template-feel.
const PILLARS = [
  {
    number: "01",
    title: "Low-Density Tourism",
    body:
      "We believe true luxury is restraint. By limiting visitor numbers, we preserve the silence of the bush and minimise our footprint on fragile ecosystems.",
    cta: "Where we travel quietly",
    href: "/destinations/southern",
  },
  {
    number: "02",
    title: "Conservation Partnerships",
    body:
      "Direct funding for anti-poaching units and wildlife corridors. Every Tantrek journey contributes to local conservation trusts and habitat protection.",
    cta: "How we choose partners",
    href: "/experiences/conservation",
  },
  {
    number: "03",
    title: "Community Collaboration",
    body:
      "True conservation begins with people. We support education, sustainable livelihoods, and vocational training in the communities around the parks we visit.",
    cta: "Read about our work",
    href: "/about",
  },
];

const STATS = [
  { value: "120k+", label: "Acres protected" },
  { value: "100%", label: "Solar at partner camps" },
  { value: "450+", label: "Scholarships funded" },
  { value: "Zero", label: "Single-use plastics" },
];

export function SustainabilityContent() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          1 · Cinematic hero
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[80vh] min-h-[500px] w-full overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
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
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="editorial-eyebrow text-tantrek-orange mb-5"
          >
            Conservation &amp; Community
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-bold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[88px] max-w-5xl"
          >
            Travel that leaves a{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              place better
            </span>{" "}
            than it found it.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-2xl font-body text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed"
          >
            Low-density tourism, fair employment, conservation partnerships —
            the unglamorous work that makes a wild place stay wild.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2 · Three commitments — editorial 2-column with imagery + numbered
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white luxury-section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 lg:sticky lg:top-28"
            >
              <p className="editorial-eyebrow text-tantrek-orange mb-6">
                Our Commitments
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold leading-tight mb-8">
                Three commitments to{" "}
                <span className="font-serif italic font-normal text-tantrek-orange">
                  the wild.
                </span>
              </h2>

              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(0,43,91,0.18)]">
                <Image
                  src="https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1200&q=80"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tantrek-navy-deep/50 via-transparent to-transparent" aria-hidden />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="font-body text-[10px] tracking-[0.28em] uppercase text-tantrek-orange font-semibold mb-2">
                    The Field
                  </p>
                  <p className="font-serif italic text-lg lg:text-xl leading-snug">
                    &ldquo;The land remembers who walked here, and how
                    quietly.&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-7 space-y-10"
            >
              {PILLARS.map((p, i) => (
                <motion.div
                  key={p.number}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="editorial-reason"
                >
                  <span className="reason-number">{p.number}</span>
                  <h3 className="font-display text-xl lg:text-2xl text-tantrek-navy font-semibold mb-3">
                    {p.title}
                  </h3>
                  <p className="text-tantrek-text-muted text-base leading-relaxed max-w-2xl">
                    {p.body}
                  </p>
                  <Link
                    href={p.href}
                    className="mt-4 inline-flex items-center gap-2 font-body text-tantrek-navy text-sm font-semibold tracking-wide hover:text-tantrek-orange transition-colors"
                  >
                    {p.cta} <span aria-hidden>→</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3 · Impact stats — editorial strip, restrained typography
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-tantrek-surface border-y border-tantrek-border py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 lg:mb-12">
            <p className="editorial-eyebrow text-tantrek-orange mb-5">
              The Numbers Behind It
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-tantrek-navy font-bold leading-tight">
              What this work looks like, in figures.
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border-l-2 border-tantrek-orange pl-5"
              >
                <div className="font-serif text-4xl lg:text-5xl text-tantrek-navy font-medium leading-none">
                  {stat.value}
                </div>
                <div className="mt-3 font-body text-[11px] tracking-[0.22em] uppercase text-tantrek-text-muted font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-12 text-tantrek-text-muted text-xs leading-relaxed max-w-2xl">
            Figures are aggregated across Tantrek and our partner camps and
            conservancies. We&rsquo;d rather show fewer, honest numbers than
            many impressive ones.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4 · Concierge CTA
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
            Travel With Purpose
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-[1.12]">
            Join the next chapter of{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              responsible exploration.
            </span>
          </h2>
          <p className="mt-6 text-white/85 font-body text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Every Tantrek journey supports the places it visits — and the
            people who keep those places wild. Begin a conversation with a
            safari designer to find out how.
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
              href="/experiences/conservation"
              className="inline-flex items-center gap-2 font-body text-white/85 text-sm tracking-wide hover:text-tantrek-orange transition-colors"
            >
              Our conservation journeys
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
