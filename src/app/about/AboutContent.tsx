"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";

export function AboutContent() {
  return (
    <>
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-150"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-safari-green-dark/85" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 flex justify-center">
          <GlassCard className="w-full p-8 sm:p-10 lg:p-12 text-center rounded-xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl lg:text-5xl text-safari-gold-light"
            >
              We Are Wilderness Architects
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-safari-sand-light/90 leading-relaxed"
            >
              Tanzania Wildmakers Safaris exists at the intersection of frontier
              wilderness and refined luxury. We do not follow the northern circuit
              crowds. We design journeys into Southern and Western Tanzania—where
              the savannah still holds its silence and the only footprints are
              often yours.
            </motion.p>
          </GlassCard>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-safari-green">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl lg:text-3xl text-safari-gold-light mb-8">
            Our Positioning
          </h2>
          <ul className="space-y-6 text-safari-sand-light/90">
            <li>
              <strong className="text-safari-sand">Southern Tanzania:</strong>{" "}
              Julius Nyerere National Park and Ruaha—vast, low-density, and
              deeply immersive. This is where the Great Ruaha River and Selous
              heritage define the experience.
            </li>
            <li>
              <strong className="text-safari-sand">Western Tanzania:</strong>{" "}
              Katavi National Park—Africa’s last true frontier. Buffalo herds in
              the thousands, remote fly-in camps, and a sense of discovery that
              mass tourism cannot offer.
            </li>
            <li>
              <strong className="text-safari-sand">Ultra-exclusive:</strong> We
              work with a small number of discerning travelers each year. Your
              safari is crafted, not packaged.
            </li>
          </ul>
          <div className="mt-10">
            <Button href="/plan-your-safari" variant="primary">
              Plan Your Safari
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 border-t border-glass-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl lg:text-3xl text-safari-gold-light mb-6">
            Conservation & Community
          </h2>
          <p className="text-safari-sand-light/90 leading-relaxed">
            Our itineraries are built on low-density tourism and conservation
            partnerships. We collaborate with local communities and support
            initiatives that protect the wilderness we showcase. Luxury, for us,
            includes leaving the land and its people better than we found them.
          </p>
          <Button href="/sustainability" variant="outline" className="mt-8">
            Our Sustainability Commitment
          </Button>
        </div>
      </section>
    </>
  );
}
