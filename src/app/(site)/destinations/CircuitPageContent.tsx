"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Circuit } from "@/data/destinations";
import { getDestinationsByCircuit } from "@/data/destinations";

type CircuitPageContentProps = {
  circuit: Circuit;
  eyebrow: string;
  title: string;
  intro: string;
  ctaText: string;
};

// Pull a trailing word like "Tanzania" or "Circuit" out of the page title so
// the hero can render it as a serif italic accent (editorial luxury).
function splitTitle(title: string): { main: string; accent: string | null } {
  const trailing = title.match(/^(.*?)\s+(Tanzania|Circuit)$/);
  if (trailing) return { main: trailing[1], accent: trailing[2] };
  return { main: title, accent: null };
}

export function CircuitPageContent({
  circuit,
  eyebrow,
  title,
  intro,
  ctaText,
}: CircuitPageContentProps) {
  const parks = getDestinationsByCircuit(circuit);
  const heroImage =
    parks[0]?.imageUrl ??
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80";
  const { main: titleMain, accent: titleAccent } = splitTitle(title);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          1 · Cinematic hero
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[72vh] min-h-[460px] w-full overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
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
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="editorial-eyebrow text-tantrek-orange mb-5"
          >
            {eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-5xl font-bold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl max-w-4xl"
          >
            {titleMain}
            {titleAccent && (
              <>
                {" "}
                <span className="font-serif italic font-normal text-tantrek-orange">
                  {titleAccent}
                </span>
              </>
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-2xl font-body text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed"
          >
            {intro}
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2 · Parks in this circuit — editorial grid
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white editorial-section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 lg:mb-14">
            <div className="max-w-2xl">
              <p className="editorial-eyebrow text-tantrek-orange mb-5">
                Parks in this circuit
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold leading-tight">
                Each carries its own{" "}
                <span className="font-serif italic font-normal text-tantrek-orange">
                  weather and rhythm.
                </span>
              </h2>
            </div>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 font-body text-tantrek-navy text-sm font-semibold tracking-wide hover:text-tantrek-orange transition-colors"
            >
              All Tanzania destinations <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {parks.map((park, i) => (
              <motion.div
                key={park.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={`/destinations/${park.slug}`}
                  className="editorial-destination group block h-full min-h-[360px]"
                  style={{
                    backgroundImage: `url(${park.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="relative z-10 h-full flex flex-col justify-end p-7">
                    <h3 className="font-display text-xl lg:text-2xl text-white font-semibold leading-tight">
                      {park.name}
                    </h3>
                    <p className="mt-2 text-white/85 text-sm leading-relaxed line-clamp-2">
                      {park.tagline}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-white text-[11px] font-bold tracking-[0.22em] uppercase group-hover:gap-3 transition-all">
                      Discover <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3 · Concierge CTA — navy, matches the rest of the site
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="section-bg-frontier relative editorial-section-padding overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden
        />
        <div className="absolute inset-0 frontier-overlay" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <p className="editorial-eyebrow text-tantrek-orange mb-6 justify-center">
            Begin Your Journey
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-[1.12]">
            {ctaText.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              {ctaText.split(" ").slice(-1).join(" ")}
            </span>
          </h2>
          <p className="mt-6 text-white/85 font-body text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Every journey begins with a conversation. Tell us how you&rsquo;d
            like to travel — and a Tantrek safari designer will reply within
            24 hours.
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
            <a
              href="https://wa.me/34637048615"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-white/85 text-sm tracking-wide hover:text-tantrek-orange transition-colors"
            >
              Or message on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
