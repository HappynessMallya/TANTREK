"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Destination, Circuit } from "@/data/destinations";

const CIRCUIT_LABELS: Record<Circuit, string> = {
  northern: "Northern Tanzania",
  southern: "Southern Tanzania",
  western: "Western Tanzania",
};

// Pull a trailing suffix like "National Park" or "Conservation Area" out
// of the park name so the hero can render it as a serif italic accent
// (editorial luxury treatment).
function splitNameForHero(name: string): { main: string; accent: string | null } {
  if (name.endsWith(" National Park")) {
    return { main: name.replace(" National Park", ""), accent: "National Park" };
  }
  if (name.endsWith(" Conservation Area")) {
    return { main: name.replace(" Conservation Area", ""), accent: "Conservation Area" };
  }
  return { main: name, accent: null };
}

export function DestinationPageContent({
  destination: d,
  othersInCircuit,
}: {
  destination: Destination;
  othersInCircuit: Destination[];
}) {
  const circuitLabel = CIRCUIT_LABELS[d.circuit];
  const { main: titleMain, accent: titleAccent } = splitNameForHero(d.name);
  const lodgeCamps = d.luxuryCamps.slice(0, 3);

  // Fast facts — render only the ones present
  type Fact = { label: string; value: string };
  const facts: Fact[] = [
    { label: "Best time", value: d.bestTime },
    { label: "Wildlife", value: d.highlights.slice(0, 2).join("; ") },
    ...(d.ecosystem ? [{ label: "Ecosystem", value: d.ecosystem }] : []),
    ...(d.avgTemp ? [{ label: "Avg temp", value: d.avgTemp }] : []),
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          1 · Cinematic hero — dark, full-bleed image with serif accent
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src={d.imageUrl}
            alt={`${d.name} — luxury safari destination`}
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
            {circuitLabel}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {titleMain}
            {titleAccent && (
              <>
                <br />
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
            className="mt-6 max-w-2xl font-serif italic text-lg sm:text-xl lg:text-2xl text-white/90 leading-snug"
          >
            {d.tagline}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70"
        >
          <span className="block w-5 h-9 border-2 border-white/40 rounded-full mx-auto" />
          <span className="block text-[10px] tracking-[0.3em] mt-2 uppercase">Scroll</span>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2 · Fast facts strip — editorial horizontal table on white
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-tantrek-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-7">
            {facts.map((f) => (
              <div key={f.label} className="border-l-2 border-tantrek-orange pl-4">
                <p className="font-body text-[10px] font-bold tracking-[0.26em] uppercase text-tantrek-text-muted">
                  {f.label}
                </p>
                <p className="mt-2 font-display text-tantrek-navy text-sm lg:text-[15px] leading-snug font-medium">
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3 · The story — editorial 2-column with a quiet eyebrow + rule
          Migration note if present; otherwise general framing.
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white editorial-section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="lg:col-span-5"
            >
              <p className="editorial-eyebrow text-tantrek-orange mb-6">
                {d.migrationNote ? "Seasons & Story" : `Why ${titleMain}`}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold leading-tight">
                {d.migrationNote ? (
                  <>
                    The rhythm of{" "}
                    <span className="font-serif italic font-normal text-tantrek-orange">
                      the wild.
                    </span>
                  </>
                ) : (
                  <>
                    A place of{" "}
                    <span className="font-serif italic font-normal text-tantrek-orange">
                      its own weather.
                    </span>
                  </>
                )}
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-7 space-y-5 font-body text-tantrek-text-muted text-base lg:text-lg leading-relaxed"
            >
              {d.migrationNote ? (
                <>
                  <p>{d.migrationNote}</p>
                  <p>
                    Our journeys are designed around the season. Whether
                    that&rsquo;s river crossings, calving on the southern
                    plains, or quiet predator drives in the green months — we
                    place you in the right camp, with the right guide, at the
                    right hour.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    {d.name} is one of Tanzania&rsquo;s most rewarding
                    landscapes — chosen by travellers who want depth over
                    spectacle, low density over highway, and guiding that
                    reads the country, not the brief.
                  </p>
                  <p className="font-serif italic text-tantrek-navy-deep text-xl lg:text-2xl leading-snug">
                    &ldquo;{d.tagline}&rdquo;
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4 · Wildlife & highlights — editorial numbered list (no card grid)
          ═══════════════════════════════════════════════════════════════════ */}
      {d.highlights.length > 0 && (
        <section className="bg-tantrek-surface luxury-section-padding">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-10 lg:mb-14">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7"
              >
                <p className="editorial-eyebrow text-tantrek-orange mb-5">
                  What You&rsquo;ll Find
                </p>
                <h2 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold leading-tight">
                  Wildlife and{" "}
                  <span className="font-serif italic font-normal text-tantrek-orange">
                    moments to keep.
                  </span>
                </h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-5 text-tantrek-text-muted text-base leading-relaxed"
              >
                Every itinerary is shaped to maximise the chance of these
                encounters, without ever feeling staged.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
              {d.highlights.map((h, i) => (
                <motion.div
                  key={h}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="editorial-reason"
                >
                  <span className="reason-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-tantrek-navy text-lg font-medium leading-snug">
                    {h}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          5 · Lodge collection — editorial showcase (image-led tiles)
          ═══════════════════════════════════════════════════════════════════ */}
      {lodgeCamps.length > 0 && (
        <section className="bg-white editorial-section-padding">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12 lg:mb-16">
              <p className="editorial-eyebrow text-tantrek-orange mb-5">
                Where You&rsquo;ll Stay
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold leading-tight">
                Our preferred camps in{" "}
                <span className="font-serif italic font-normal text-tantrek-orange">
                  {titleMain}.
                </span>
              </h2>
              <p className="mt-5 text-tantrek-text-muted text-base lg:text-lg leading-relaxed">
                We work with a small, carefully chosen set of camps — for
                guiding, location, and the way they treat their place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
              {lodgeCamps.map((campName) => (
                <motion.div
                  key={campName}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="accommodation-tile group h-full min-h-[360px]">
                    <div
                      className="accommodation-image"
                      style={{ backgroundImage: `url(${d.imageUrl})` /* PLACEHOLDER: replace with per-camp hero shot */ }}
                      aria-hidden
                    />
                    <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-7">
                      <p className="font-body text-tantrek-orange text-[10px] font-bold tracking-[0.26em] uppercase mb-2">
                        Partner Camp
                      </p>
                      <h3 className="font-display text-xl lg:text-2xl text-white font-semibold leading-tight">
                        {campName}
                      </h3>
                      <p className="mt-2 text-white/85 text-sm leading-relaxed">
                        Hand-picked for guiding, location, and quiet
                        excellence in the field.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          6 · In the area — internal links, editorial chips
          ═══════════════════════════════════════════════════════════════════ */}
      {d.internalLinks.length > 0 && (
        <section className="bg-tantrek-surface border-t border-tantrek-border py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="editorial-eyebrow text-tantrek-orange mb-5">
              In the Area
            </p>
            <h3 className="font-display text-2xl sm:text-3xl text-tantrek-navy font-bold leading-tight mb-7 max-w-2xl">
              You may also like to explore.
            </h3>
            <ul className="flex flex-wrap gap-3">
              {d.internalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 rounded-full border border-tantrek-border bg-white px-5 py-2.5 text-tantrek-navy text-sm font-medium hover:bg-tantrek-navy hover:text-white hover:border-tantrek-navy transition-all"
                  >
                    {link.label}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          7 · Other destinations in circuit — editorial trio with images
          ═══════════════════════════════════════════════════════════════════ */}
      {othersInCircuit.length > 0 && (
        <section className="bg-white editorial-section-padding">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 lg:mb-14">
              <div className="max-w-2xl">
                <p className="editorial-eyebrow text-tantrek-orange mb-5">
                  More in {circuitLabel}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold leading-tight">
                  Pair with another{" "}
                  <span className="font-serif italic font-normal text-tantrek-orange">
                    place nearby.
                  </span>
                </h2>
              </div>
              <Link
                href={`/destinations/${d.circuit}`}
                className="inline-flex items-center gap-2 font-body text-tantrek-navy text-sm font-semibold tracking-wide hover:text-tantrek-orange transition-colors"
              >
                All of {circuitLabel} <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
              {othersInCircuit.slice(0, 3).map((other, i) => (
                <motion.div
                  key={other.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={`/destinations/${other.slug}`}
                    className="editorial-destination group block h-full min-h-[340px]"
                    style={{
                      backgroundImage: `url(${other.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="relative z-10 h-full flex flex-col justify-end p-7">
                      <p className="font-body text-tantrek-orange text-[10px] font-bold tracking-[0.26em] uppercase mb-2">
                        {CIRCUIT_LABELS[other.circuit]}
                      </p>
                      <h3 className="font-display text-xl lg:text-2xl text-white font-semibold leading-tight">
                        {other.name}
                      </h3>
                      <p className="mt-2 text-white/85 text-sm leading-relaxed line-clamp-2">
                        {other.tagline}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-white text-[11px] font-bold tracking-[0.22em] uppercase group-hover:gap-3 transition-all">
                        Discover <span aria-hidden>→</span>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          8 · Concierge CTA — navy, matches homepage final CTA tone
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="section-bg-frontier relative editorial-section-padding overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${d.imageUrl})` }}
          aria-hidden
        />
        <div className="absolute inset-0 frontier-overlay" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <p className="editorial-eyebrow text-tantrek-orange mb-6 justify-center">
            Begin Your {titleMain} Story
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-[1.12]">
            Let&rsquo;s shape your{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              {titleMain}
            </span>{" "}
            journey.
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
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.683-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607z" />
              </svg>
              Or message on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
