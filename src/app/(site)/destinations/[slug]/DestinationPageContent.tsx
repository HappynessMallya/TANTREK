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

function getTitleSplit(name: string): { main: string; accent: string | null } {
  if (name.endsWith(" National Park")) {
    return { main: name.replace(" National Park", ""), accent: "National Park" };
  }
  if (name.endsWith(" Conservation Area")) {
    return { main: name.replace(" Conservation Area", ""), accent: "Conservation Area" };
  }
  return { main: name, accent: null };
}

const FastFactIcons = {
  calendar: (
    <svg className="h-5 w-5 shrink-0 text-safari-gold/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  wildlife: (
    <svg className="h-5 w-5 shrink-0 text-safari-gold/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  ecosystem: (
    <svg className="h-5 w-5 shrink-0 text-safari-gold/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  temp: (
    <svg className="h-5 w-5 shrink-0 text-safari-gold/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

export function DestinationPageContent({
  destination: d,
  othersInCircuit,
}: {
  destination: Destination;
  othersInCircuit: Destination[];
}) {
  const circuitLabel = CIRCUIT_LABELS[d.circuit];
  const { main: titleMain, accent: titleAccent } = getTitleSplit(d.name);
  const lodgeCamps = d.luxuryCamps.slice(0, 3);

  return (
    <>
      {/* Hero — full height, location tag + split title + tagline */}
      <section className="relative h-[75vh] min-h-[420px] w-full overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src={d.imageUrl}
            alt={`${d.name} — luxury safari destination`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-safari-green-dark via-safari-green-dark/50 to-transparent"
            aria-hidden
          />
        </div>
        <div className="relative z-10 flex h-full max-w-7xl flex-col justify-end px-4 pb-20 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 block font-body text-xs font-bold uppercase tracking-[0.3em] text-safari-gold-light sm:text-sm"
          >
            {circuitLabel}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-5xl font-bold leading-none text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {titleMain}
            {titleAccent && (
              <>
                <br />
                <span className="text-safari-gold-light/90">{titleAccent}</span>
              </>
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-2xl font-display text-lg italic text-safari-sand-light/95"
          >
            {d.tagline}
          </motion.p>
        </div>
      </section>

      {/* Two-column: sticky sidebar (Fast Facts + Map) + main content */}
      <section className="bg-safari-green-dark py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 lg:items-start">
            {/* Left: sticky sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32">
              <div className="destination-sidebar rounded-xl border-l-4 border-l-safari-gold p-6 shadow-xl sm:p-8">
                <h3 className="mb-6 font-body text-xs font-bold uppercase tracking-[0.2em] text-safari-gold-light">
                  Fast Facts
                </h3>
                <div className="space-y-5">
                  <div className="flex gap-4">
                    {FastFactIcons.calendar}
                    <div>
                      <p className="font-body text-xs font-bold uppercase tracking-wider text-safari-sand-muted">
                        Best time to visit
                      </p>
                      <p className="font-display text-safari-cream">{d.bestTime}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {FastFactIcons.wildlife}
                    <div>
                      <p className="font-body text-xs font-bold uppercase tracking-wider text-safari-sand-muted">
                        Wildlife highlights
                      </p>
                      <p className="font-display text-safari-cream">
                        {d.highlights.slice(0, 3).join("; ")}
                      </p>
                    </div>
                  </div>
                  {d.ecosystem && (
                    <div className="flex gap-4">
                      {FastFactIcons.ecosystem}
                      <div>
                        <p className="font-body text-xs font-bold uppercase tracking-wider text-safari-sand-muted">
                          Ecosystem
                        </p>
                        <p className="font-display text-safari-cream">{d.ecosystem}</p>
                      </div>
                    </div>
                  )}
                  {d.avgTemp && (
                    <div className="flex gap-4">
                      {FastFactIcons.temp}
                      <div>
                        <p className="font-body text-xs font-bold uppercase tracking-wider text-safari-sand-muted">
                          Avg temp
                        </p>
                        <p className="font-display text-safari-cream">{d.avgTemp}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="mb-4 font-body text-xs font-bold uppercase tracking-wider text-safari-sand-muted">
                    Location map
                  </p>
                  <div className="relative h-44 overflow-hidden rounded-md bg-safari-green">
                    <Image
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=60"
                      alt=""
                      fill
                      className="object-cover opacity-40"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="h-3 w-3 rounded-full bg-safari-gold shadow-[0_0_12px_rgba(196,169,103,0.6)] motion-safe:animate-pulse"
                        aria-hidden
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right: main content */}
            <div className="lg:col-span-8 space-y-14">
              {/* Featured article */}
              <article>
                {d.migrationNote ? (
                  <>
                    <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-6">
                      The rhythm of the wild:{" "}
                      <span className="italic text-safari-gold-light">
                        {d.name.includes("Serengeti") ? "The Great Migration" : "Seasons & wildlife"}
                      </span>
                    </h2>
                    <div className="space-y-5 font-body text-lg leading-relaxed text-safari-sand-light/90">
                      <p>{d.migrationNote}</p>
                      <p>
                        Our curated safaris place you in the heart of the action—whether that’s
                        river crossings, calving season, or predator encounters. We design
                        itineraries with prime camp positions and private guiding so your
                        experience is as exclusive as the landscape.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-6">
                      Why {d.name}?
                    </h2>
                    <div className="space-y-5 font-body text-lg leading-relaxed text-safari-sand-light/90">
                      <p>
                        {d.name} is one of Tanzania&rsquo;s premier safari destinations, offering
                        a blend of raw wilderness and exclusive luxury. TANTREK 360 designs
                        itineraries here for travelers and investors who want the frontier, not
                        the highway&mdash;low-density, high-impact, with curated business
                        exposure where it adds value.
                      </p>
                      <p>{d.tagline}</p>
                    </div>
                  </>
                )}
              </article>

              {/* Two image cards (experiences) */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="group relative h-80 overflow-hidden rounded-xl sm:h-96">
                  <Image
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"
                    alt="Private safari vehicle in the wild"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-safari-green-dark via-transparent to-transparent p-6">
                    <h4 className="font-display text-xl font-bold text-white">
                      Private expeditions
                    </h4>
                    <p className="text-sm text-safari-sand-light/90">
                      Expert guides in custom-built 4x4s
                    </p>
                  </div>
                </div>
                <div className="group relative h-80 overflow-hidden rounded-xl sm:h-96">
                  <Image
                    src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80"
                    alt="Safari experience"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-safari-green-dark via-transparent to-transparent p-6">
                    <h4 className="font-display text-xl font-bold text-white">
                      {d.highlights[0]?.toLowerCase().includes("balloon")
                        ? "Aerial perspectives"
                        : "Guided experiences"}
                    </h4>
                    <p className="text-sm text-safari-sand-light/90">
                      {d.highlights[0]?.toLowerCase().includes("balloon")
                        ? "Sunrise hot air balloon safaris"
                        : "Walking and game drives"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lodge collection */}
              <div>
                <h3 className="mb-8 border-l-4 border-safari-gold pl-6 font-display text-2xl font-bold text-white sm:text-3xl">
                  Our lodge collection
                </h3>
                <div className="space-y-8">
                  {lodgeCamps.map((campName, idx) => (
                    <div
                      key={campName}
                      className={`flex flex-col gap-6 rounded-xl border border-white/5 bg-white/5 p-6 transition-colors hover:bg-white/10 sm:p-8 md:flex-row md:items-center ${
                        idx % 2 === 1 ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-lg md:h-64 md:w-1/2">
                        <Image
                          src={d.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-4">
                        <div className="flex items-center gap-1 text-safari-gold">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <svg
                              key={i}
                              className="h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <h4 className="font-display text-xl font-bold text-white sm:text-2xl">
                          {campName}
                        </h4>
                        <p className="text-sm text-safari-sand-light/80">
                          Our preferred partner in the region—exceptional guiding, prime
                          location, and a commitment to low-impact luxury.
                        </p>
                        <Link
                          href="/plan-your-safari"
                          className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest text-safari-gold-light transition-all hover:gap-3"
                        >
                          View lodge
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal links */}
              <div className="border-t border-white/10 pt-8">
                <p className="font-body text-xs font-bold uppercase tracking-wider text-safari-sand-muted">
                  Explore further
                </p>
                <ul className="mt-3 flex flex-wrap gap-4">
                  {d.internalLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-safari-gold-light hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other destinations in circuit */}
      {othersInCircuit.length > 0 && (
        <section className="border-t border-white/10 bg-safari-green-dark py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-safari-gold-light mb-8">
              More in the {d.circuit} circuit
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {othersInCircuit.map((other) => (
                <Link key={other.slug} href={`/destinations/${other.slug}`}>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:scale-[1.02] hover:bg-white/10">
                    <h3 className="font-display text-lg font-semibold text-safari-gold-light">
                      {other.name}
                    </h3>
                    <p className="mt-2 text-sm text-safari-sand-light/80">{other.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA — full width, our gold */}
      <section className="bg-safari-gold py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold leading-tight text-safari-green-dark sm:text-4xl md:text-5xl">
            Ready to begin your {titleMain} story?
          </h2>
          <p className="mt-6 text-lg font-medium text-safari-green-dark/85">
            Connect with our destination experts to design a bespoke itinerary
            tailored to your vision of luxury and adventure.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/plan-your-safari"
              className="inline-flex items-center justify-center rounded-xl bg-safari-green-dark px-10 py-4 font-bold uppercase tracking-widest text-safari-cream transition-all hover:scale-[1.02] hover:bg-safari-green"
            >
              Start planning
            </Link>
            <Link
              href="https://wa.me/34637048615"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border-2 border-safari-green-dark/40 px-10 py-4 font-bold uppercase tracking-widest text-safari-green-dark transition-all hover:bg-safari-green-dark/10"
            >
              Download brochure
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
