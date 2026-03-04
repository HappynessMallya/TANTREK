"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/data/destinations";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export function DestinationPageContent({
  destination: d,
  othersInCircuit,
}: {
  destination: Destination;
  othersInCircuit: Destination[];
}) {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 min-h-[60vh] flex items-end">
        <div className="absolute inset-0">
          <Image
            src={d.imageUrl}
            alt={`${d.name} — luxury safari destination`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-safari-green-dark via-safari-green-dark/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <GlassCard className="inline-block p-6 sm:p-8 lg:p-10 rounded-xl max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-safari-gold text-sm uppercase tracking-wider"
            >
              {d.circuit} circuit
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl lg:text-6xl text-safari-cream mt-2"
            >
              {d.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-xl text-safari-sand-light/95 max-w-2xl"
            >
              {d.tagline}
            </motion.p>
          </GlassCard>
        </div>
      </section>

      {/* Long-form SEO content (1500+ words structure — expand with real copy) */}
      <section className="py-16 lg:py-24 bg-safari-green">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-invert prose-safari">
          <h2 className="font-display text-2xl text-safari-gold-light">
            Why {d.name}?
          </h2>
          <p className="text-safari-sand-light/90 leading-relaxed mt-4">
            {d.name} is one of Tanzania’s premier safari destinations, offering
            a blend of raw wilderness and exclusive luxury. Unlike the crowded
            northern circuit, this park delivers low-density, high-impact
            experiences—whether you’re tracking predators along the river,
            watching elephants move through ancient landscapes, or simply
            absorbing the silence of the savannah. Tanzania Wildmakers Safaris
            designs itineraries here for travelers who want the frontier, not
            the highway.
          </p>

          <h2 className="font-display text-2xl text-safari-gold-light mt-12">
            Wildlife Highlights
          </h2>
          <ul className="mt-4 space-y-2 text-safari-sand-light/90">
            {d.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          {d.migrationNote && (
            <>
              <h2 className="font-display text-2xl text-safari-gold-light mt-12">
                Migration & Seasons
              </h2>
              <p className="text-safari-sand-light/90 leading-relaxed mt-4">
                {d.migrationNote}
              </p>
            </>
          )}

          <h2 className="font-display text-2xl text-safari-gold-light mt-12">
            Best Time to Visit
          </h2>
          <p className="text-safari-sand-light/90 leading-relaxed mt-4">
            {d.bestTime}
          </p>

          <h2 className="font-display text-2xl text-safari-gold-light mt-12">
            Luxury Camps & Lodges
          </h2>
          <p className="text-safari-sand-light/90 leading-relaxed mt-4">
            We partner with a select number of camps that match our standard of
            exclusivity and conservation. In {d.name}, our preferred properties
            include: {d.luxuryCamps.join(", ")}. Each offers prime location,
            exceptional guiding, and a commitment to low-impact tourism.
          </p>

          <h2 className="font-display text-2xl text-safari-gold-light mt-12">
            How We Craft Your Safari
          </h2>
          <p className="text-safari-sand-light/90 leading-relaxed mt-4">
            A luxury safari in {d.name} can be combined with other Southern or
            Western parks—for example, Ruaha and Julius Nyerere—for a
            multi-park fly-in journey. We handle all logistics, from light
            aircraft charters to camp selection and private guiding. Tell us your
            dates and preferences on our{" "}
            <Link href="/plan-your-safari" className="text-safari-gold hover:underline">
              Plan Your Safari
            </Link>{" "}
            page, and we’ll design an itinerary that belongs only to you.
          </p>

          {/* Internal links for SEO */}
          <div className="mt-12 pt-8 border-t border-glass-border">
            <p className="text-safari-sand-muted text-sm font-medium uppercase tracking-wider">
              Explore further
            </p>
            <ul className="mt-3 flex flex-wrap gap-4">
              {d.internalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-safari-gold hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ snippet */}
      <section className="py-12 border-t border-glass-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-xl text-safari-gold-light mb-6">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-6">
            <div>
              <dt className="text-safari-sand font-medium">
                What is the best time to visit {d.name}?
              </dt>
              <dd className="mt-1 text-safari-sand-light/80">{d.bestTime}</dd>
            </div>
            <div>
              <dt className="text-safari-sand font-medium">
                What wildlife can I see?
              </dt>
              <dd className="mt-1 text-safari-sand-light/80">
                {d.highlights.join(". ")}
              </dd>
            </div>
            <div>
              <dt className="text-safari-sand font-medium">
                Which luxury camps do you recommend?
              </dt>
              <dd className="mt-1 text-safari-sand-light/80">
                {d.luxuryCamps.join(", ")}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Other destinations in circuit */}
      {othersInCircuit.length > 0 && (
        <section className="py-16 lg:py-24 bg-safari-green-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl text-safari-gold-light mb-8">
              More in the {d.circuit} circuit
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {othersInCircuit.map((other) => (
                <Link key={other.slug} href={`/destinations/${other.slug}`}>
                  <GlassCard className="p-6 h-full transition-transform hover:scale-[1.02]">
                    <h3 className="font-display text-lg text-safari-gold-light">
                      {other.name}
                    </h3>
                    <p className="mt-2 text-safari-sand-light/80 text-sm">
                      {other.tagline}
                    </p>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-gradient-sunrise">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl text-safari-cream">
            Ready to experience {d.name}?
          </h2>
          <p className="mt-4 text-safari-sand-light/90">
            Our team will craft a bespoke itinerary including luxury camps,
            fly-in logistics, and private guiding.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button href="/plan-your-safari" variant="primary">
              Plan Your Safari
            </Button>
            <a
              href="https://wa.me/255762111315"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg border-2 border-green-500 text-green-400 hover:bg-green-500/10"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
