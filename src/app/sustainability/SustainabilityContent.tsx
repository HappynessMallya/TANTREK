"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920&q=80";

const PILLARS = [
  {
    title: "Low-Density Tourism",
    body: "We believe true luxury is exclusivity. By limiting visitor numbers, we preserve the silence of the bush and minimize our carbon footprint on fragile ecosystems.",
    cta: "Learn more",
    href: "/destinations/southern",
    icon: "travel",
  },
  {
    title: "Conservation Partnerships",
    body: "Directly funding anti-poaching units and wildlife corridors. Every booking contributes to local conservation trusts and habitat protection.",
    cta: "View partners",
    href: "/experiences/conservation",
    icon: "handshake",
  },
  {
    title: "Community Collaboration",
    body: "True conservation begins with people. We empower indigenous communities through education, sustainable livelihoods, and vocational training.",
    cta: "Our impact",
    href: "/about",
    icon: "groups",
  },
];

const STATS = [
  { value: "120k+", label: "Acres protected", icon: "forest" },
  { value: "100%", label: "Solar at our partner camps", icon: "sun" },
  { value: "450+", label: "Scholarships provided", icon: "school" },
  { value: "Zero", label: "Single-use plastics", icon: "eco" },
];

function IconTravel({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconHandshake({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
    </svg>
  );
}
function IconGroups({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
function IconForest({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
function IconSun({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
function IconSchool({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );
}
function IconEco({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

const statIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  forest: IconForest,
  sun: IconSun,
  school: IconSchool,
  eco: IconEco,
};

export function SustainabilityContent() {
  return (
    <>
      {/* Hero — full viewport, cinematic image, gold headline */}
      <section className="relative flex h-[80vh] min-h-[500px] w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-safari-green-dark"
            aria-hidden
          />
        </div>
        <div className="relative z-10 max-w-4xl px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl font-black leading-tight text-safari-gold-light drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl mb-6"
          >
            Luxury travelers care about the land. So do we.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto max-w-2xl font-body text-lg font-light leading-relaxed text-safari-sand-light/95 md:text-xl"
          >
            Pioneering high-end ecological impact and low-density tourism in the
            heart of Tanzania's wild ecosystems.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10"
          >
            <span
              className="inline-block text-safari-gold-light text-4xl animate-bounce"
              aria-hidden
            >
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
          </motion.div>
        </div>
      </section>

      {/* Pillar cards — Our Commitment to the Wild */}
      <section className="bg-safari-green-dark py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="font-display text-3xl font-bold text-safari-gold-light sm:text-4xl mb-4">
              Our Commitment to the Wild
            </h2>
            <div className="mx-auto h-1 w-24 rounded-full bg-safari-gold" aria-hidden />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-xl border border-safari-gold/20 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-safari-gold/50"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-safari-gold/10 text-safari-gold">
                  {pillar.icon === "travel" && <IconTravel className="h-8 w-8" />}
                  {pillar.icon === "handshake" && <IconHandshake className="h-8 w-8" />}
                  {pillar.icon === "groups" && <IconGroups className="h-8 w-8" />}
                </div>
                <h3 className="font-display text-xl font-bold text-safari-gold-light sm:text-2xl mb-4">
                  {pillar.title}
                </h3>
                <p className="font-body text-safari-sand-light/90 leading-relaxed">
                  {pillar.body}
                </p>
                <div className="mt-8">
                  <Link
                    href={pillar.href}
                    className="inline-flex items-center gap-2 font-body text-sm font-bold text-safari-gold transition-all hover:gap-3"
                  >
                    {pillar.cta.toUpperCase()}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats impact */}
      <section className="border-y border-safari-gold/10 bg-safari-gold/5 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 text-center">
            {STATS.map((stat) => {
              const Icon = statIcons[stat.icon];
              return (
                <div key={stat.label}>
                  {Icon && (
                    <span className="mb-4 inline-block text-safari-gold">
                      <Icon className="h-10 w-10 mx-auto" />
                    </span>
                  )}
                  <div className="font-display text-3xl font-black text-white sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 font-body text-xs font-bold uppercase tracking-widest text-safari-sand-muted">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Image break + CTA */}
      <section className="bg-safari-green-dark py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative h-64 overflow-hidden rounded-2xl border border-safari-gold/10 mb-16 sm:h-80 lg:h-96">
            <Image
              src="https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1200&q=80"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
          </div>
          <div className="mx-auto max-w-4xl rounded-2xl border border-safari-gold/20 bg-safari-green/30 p-10 text-center backdrop-blur-sm lg:p-14">
            <h2 className="font-display text-3xl font-black italic leading-tight text-white sm:text-4xl md:text-5xl">
              Join the movement of{" "}
              <span className="text-safari-gold-light not-italic">Responsible Exploration.</span>
            </h2>
            <p className="mt-6 font-body text-lg text-safari-sand-light/90">
              Every booking contributes directly to anti-poaching and conservation
              projects in Southern and Western Tanzania.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button href="/plan-your-safari" variant="primary" className="rounded-xl px-10 py-4 text-lg font-bold">
                Book your exclusive safari
              </Button>
              <Link
                href="/experiences/conservation"
                className="inline-flex items-center justify-center rounded-xl border-2 border-safari-gold px-10 py-4 font-body text-lg font-bold text-safari-gold-light transition-colors hover:bg-safari-gold/10"
              >
                Our conservation partners
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
