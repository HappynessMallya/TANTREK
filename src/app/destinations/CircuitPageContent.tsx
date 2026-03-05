"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Circuit } from "@/data/destinations";
import { getDestinationsByCircuit, circuits } from "@/data/destinations";
import { Button } from "@/components/ui/Button";

type CircuitPageContentProps = {
  circuit: Circuit;
  eyebrow: string;
  title: string;
  intro: string;
  ctaText: string;
};

function getTags(d: { highlights: string[]; circuit: Circuit }) {
  const circuitName = circuits[d.circuit].name.replace(" Circuit", "");
  const first = d.highlights[0]?.split("—")[0]?.trim() ?? d.highlights[0] ?? circuitName;
  const second = d.highlights[1]?.split("—")[0]?.trim() ?? d.highlights[1] ?? "Luxury camps";
  return [first.slice(0, 20), second.slice(0, 22)];
}

export function CircuitPageContent({
  circuit,
  eyebrow,
  title,
  intro,
  ctaText,
}: CircuitPageContentProps) {
  const parks = getDestinationsByCircuit(circuit);
  const heroImage = parks[0]?.imageUrl ?? "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80";

  return (
    <>
      {/* Hero — full-width, cinematic */}
      <section className="relative w-full overflow-hidden pt-20">
        <div className="relative h-[420px] w-full overflow-hidden sm:h-[480px] lg:h-[540px]">
          <Image
            src={heroImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-safari-green-dark via-safari-green-dark/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10 lg:p-16">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-body text-xs font-bold uppercase tracking-[0.3em] text-safari-gold-light mb-3"
              >
                {eyebrow}
              </motion.p>
              <div className="mb-4 h-px w-16 bg-safari-gold/80" aria-hidden />
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl mb-6"
              >
                {title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-2xl font-body text-lg font-light leading-relaxed text-safari-sand-light/95"
              >
                {intro}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Content — intro + park cards */}
      <section className="relative bg-safari-green-dark py-16 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(196,169,103,0.15) 0%, transparent 55%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mt-12 lg:mt-16 mb-14">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-safari-gold/30 to-transparent" />
            <span className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-safari-gold/70">
              Parks in this circuit
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-safari-gold/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10">
            {parks.map((park, i) => {
              const [tag1, tag2] = getTags(park);
              return (
                <motion.div
                  key={park.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/destinations/${park.slug}`}
                    className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/5 transition-all duration-500 hover:border-safari-gold/40 hover:shadow-[0_0_40px_rgba(196,169,103,0.12)] block"
                  >
                    <Image
                      src={park.imageUrl}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-safari-green-dark/90 via-safari-green-dark/30 to-transparent transition-opacity duration-500 group-hover:from-safari-green-dark/85 group-hover:via-safari-green-dark/20" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                      <div className="translate-y-2 transition-all duration-500 group-hover:translate-y-0">
                        <h2 className="font-display text-2xl font-bold tracking-tight text-white mb-2 lg:text-3xl">
                          {park.name}
                        </h2>
                        <div className="h-0.5 w-14 bg-safari-gold mb-4 transition-all duration-500 group-hover:w-28 group-hover:bg-safari-gold-light" />
                        <p className="text-safari-sand-light/95 text-sm mb-6 opacity-0 max-w-sm transition-opacity duration-500 group-hover:opacity-100 leading-relaxed">
                          {park.tagline}
                        </p>
                        <div className="flex flex-wrap gap-2 opacity-0 transition-opacity duration-500 delay-75 group-hover:opacity-100">
                          <span className="inline-flex items-center gap-2 rounded-md border border-safari-gold/30 bg-black/50 px-3 py-1.5 font-body text-[10px] font-bold uppercase tracking-widest text-safari-gold-light/95 backdrop-blur-sm">
                            {tag1}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-md border border-safari-gold/30 bg-black/50 px-3 py-1.5 font-body text-[10px] font-bold uppercase tracking-widest text-safari-gold-light/95 backdrop-blur-sm">
                            {tag2}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Button href="/plan-your-safari" variant="primary" className="rounded-xl px-10 py-4 font-bold">
              {ctaText}
            </Button>
            <p className="mt-6">
              <Link
                href="/destinations"
                className="font-body text-sm text-safari-gold-light hover:underline"
              >
                ← All sanctuaries
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
