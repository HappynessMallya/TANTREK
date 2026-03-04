"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";

export default function HomePage() {
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
              <Button href="/destinations/southern" variant="outline">
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

      {/* About — authority & positioning */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Parallax-style background: buffalo / Katavi feel — use image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-safari-green-dark/90" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl lg:text-4xl text-safari-gold-light"
          >
            “We are wilderness architects.”
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-safari-sand-light/90 leading-relaxed space-y-4"
          >
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
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10"
          >
            <Button href="/about" variant="outline">
              Our Story
            </Button>
          </motion.div>
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
            <Button href="/destinations/southern" variant="primary">
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
