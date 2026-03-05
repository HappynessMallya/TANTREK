"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";

const TESTIMONIALS = [
  {
    quote:
      "We didn’t see another vehicle for three days. Our guide knew every bird, every track—and when we finally found the lions, it was just us and the savannah. This is what luxury safari should be.",
    name: "Sarah & James M.",
    trip: "Ruaha & Julius Nyerere, 8 nights",
    initials: "S & J",
  },
  {
    quote:
      "From the moment we landed on that dusty airstrip to our last sundowner, every detail felt considered. The camps were intimate, the wildlife encounters raw and unhurried. We’ll be back.",
    name: "Elena V.",
    trip: "Southern Circuit honeymoon",
    initials: "E",
  },
  {
    quote:
      "Katavi felt like we had Africa to ourselves. Buffalo in the thousands, hippos at arm’s length, and a team that made us feel like family. Wildmakers didn’t just plan a trip—they gave us a story.",
    name: "Michael T.",
    trip: "Western Tanzania fly-in",
    initials: "M",
  },
];

export default function HomePage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    setTestimonialIndex((prev) => {
      if (index < 0) return TESTIMONIALS.length - 1;
      if (index >= TESTIMONIALS.length) return 0;
      return index;
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo(testimonialIndex + 1), 6000);
    return () => clearInterval(t);
  }, [testimonialIndex, goTo]);
  return (
    <>
      {/* Hero — full viewport, cinematic (pt-20 = below fixed nav) */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Video background */}
        <div className="absolute inset-0 bg-safari-green-dark">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-90"
            aria-hidden
          >
            <source src="/bg-video.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-gradient-to-b from-safari-green-dark/60 via-transparent to-safari-green-dark/80"
            aria-hidden
          />
          {/* Dust overlay */}
          <div className="absolute inset-0 dust-layer pointer-events-none" aria-hidden />
        </div>

        {/* Glass morph card overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 mx-4"
        >
          <GlassCard className="p-8 sm:p-10 lg:p-12 max-w-2xl text-center">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-safari-cream leading-tight">
              Tanzania Wildmakers Safaris
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-safari-sand-light/95">
              Crafting Wild Experiences. Redefining Safari Frontiers.
            </p>
            <p className="mt-2 text-safari-sand-light text-base sm:text-lg font-medium">
              Explore Southern & Western Tanzania in Luxury
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Button href="/plan-your-safari" variant="primary">
                Plan Your Safari
              </Button>
              <Button href="/destinations" variant="outline">
                Explore Destinations
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <span className="block w-6 h-10 border-2 border-safari-sand/50 rounded-full mx-auto" />
          <span className="block text-xs text-safari-sand/60 mt-2">Scroll</span>
        </motion.div>
      </section>

      {/* About — authority & positioning: premium statement block */}
      <section className="relative py-28 lg:py-36 overflow-hidden">
        {/* Parallax-style background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.12]"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-safari-green-dark/92" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="font-body text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-safari-gold-light/90">
              Our Story
            </p>
            <div className="mt-4 h-px w-12 mx-auto bg-gradient-to-r from-transparent via-safari-gold/60 to-transparent" aria-hidden />
            <p
              className="font-display mt-8 text-2xl sm:text-3xl lg:text-4xl text-safari-gold-light leading-snug"
              style={{ fontFeatureSettings: '"kern" 1' }}
            >
              “We are wilderness architects.”
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mt-10 lg:mt-12 px-0 sm:px-4"
          >
            <div className="border-l-2 border-safari-gold/40 pl-6 sm:pl-8 py-1 text-safari-sand-light/95 text-base sm:text-lg leading-relaxed space-y-5">
              <p>
                We are not the northern circuit. We are the frontier—Southern and
                Western Tanzania, where low-density tourism meets raw wilderness:
                Ruaha, Julius Nyerere, Katavi. Ultra-exclusive. Cinematic. Silent.
              </p>
              <p>
                Our safaris are crafted for those who seek the road less traveled:
                remote luxury camps, conservation-driven itineraries, and moments
                where the only sound is the breath of the wild.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-12 text-center"
          >
            <Button href="/about" variant="outline">
              Our Story
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Traveler testimonials — carousel */}
      <section className="relative py-20 lg:py-28 bg-safari-green-dark border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(196,169,103,0.4) 0%, transparent 60%)" }} aria-hidden />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-safari-gold-light/90">
              In their words
            </p>
            <div className="mt-3 h-px w-12 mx-auto bg-safari-gold/50" aria-hidden />
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-safari-cream mt-6">
              Traveler stories
            </h2>
          </motion.div>

          <div className="relative min-h-[280px] sm:min-h-[260px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full"
              >
                <div className="rounded-2xl border border-safari-gold/20 bg-safari-green/30 backdrop-blur-sm p-8 sm:p-10 lg:p-12 text-center">
                  <div className="flex justify-center mb-6">
                    <span className="text-safari-gold" aria-hidden>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className="inline-block w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </span>
                  </div>
                  <blockquote className="font-display text-lg sm:text-xl lg:text-2xl text-safari-sand-light/95 leading-relaxed italic">
                    “{TESTIMONIALS[testimonialIndex].quote}”
                  </blockquote>
                  <footer className="mt-8 flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-safari-gold/40 bg-safari-gold/10 font-display text-sm font-semibold text-safari-gold-light">
                      {TESTIMONIALS[testimonialIndex].initials}
                    </div>
                    <p className="mt-3 font-body font-semibold text-safari-gold-light">
                      {TESTIMONIALS[testimonialIndex].name}
                    </p>
                    <p className="mt-1 font-body text-sm text-safari-sand-muted">
                      {TESTIMONIALS[testimonialIndex].trip}
                    </p>
                  </footer>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                type="button"
                onClick={() => goTo(testimonialIndex - 1)}
                className="p-2 rounded-full border border-safari-gold/30 text-safari-gold-light transition-colors hover:bg-safari-gold/10 hover:border-safari-gold/50"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTestimonialIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === testimonialIndex ? "w-8 bg-safari-gold" : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => goTo(testimonialIndex + 1)}
                className="p-2 rounded-full border border-safari-gold/30 text-safari-gold-light transition-colors hover:bg-safari-gold/10 hover:border-safari-gold/50"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations teaser — SEO internal links */}
      <section className="py-20 lg:py-28 bg-safari-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl lg:text-4xl text-safari-gold-light text-center mb-12"
          >
            Where We Go
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Northern Circuit",
                desc: "Serengeti, Ngorongoro, Tarangire, Lake Manyara.",
                href: "/destinations/northern",
              },
              {
                title: "Southern Circuit",
                desc: "Julius Nyerere, Ruaha — the soul of wilderness.",
                href: "/destinations/southern",
              },
              {
                title: "Western Circuit",
                desc: "Katavi — Africa’s last true frontier.",
                href: "/destinations/western",
              },
            ].map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={item.href} className="block group">
                  <GlassCard className="p-6 h-full transition-transform duration-300 group-hover:scale-[1.02]">
                    <h3 className="font-display text-xl text-safari-gold-light group-hover:underline">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-safari-sand-light/80 text-sm">
                      {item.desc}
                    </p>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/destinations" variant="primary">
              Explore All Destinations
            </Button>
          </div>
        </div>
      </section>

      {/* Experiences strip */}
      <section className="py-20 border-t border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl lg:text-4xl text-safari-gold-light text-center mb-12"
          >
            Safari Experiences
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Luxury Fly-in Safaris", href: "/experiences/luxury-fly-in" },
              { label: "Honeymoon Safaris", href: "/experiences/honeymoon" },
              { label: "Photographic Expeditions", href: "/experiences/photographic" },
              { label: "Conservation Safaris", href: "/experiences/conservation" },
              { label: "Corporate Incentives", href: "/experiences/corporate" },
            ].map((item) => (
              <Button key={item.href} href={item.href} variant="outline">
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Plan Your Safari + WhatsApp */}
      <section className="py-20 lg:py-28 bg-gradient-sunrise">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl lg:text-4xl text-safari-cream"
          >
            Begin Your Frontier
          </motion.h2>
          <p className="mt-4 text-safari-sand-light/90">
            Tell us your dates, budget, and dreams. We’ll craft an itinerary that
            belongs only to you.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button href="/plan-your-safari" variant="primary">
              Plan Your Safari
            </Button>
            <a
              href="https://wa.me/255762111315"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg border-2 border-green-500 text-green-400 hover:bg-green-500/10 transition-all"
            >
              WhatsApp quick contact
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
