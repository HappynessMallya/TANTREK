"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";

export function SustainabilityContent() {
  return (
    <>
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-4">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-safari-green-dark/80" />
        <div className="relative z-10 max-w-3xl mx-auto w-full flex justify-center">
          <GlassCard className="w-full p-8 sm:p-10 lg:p-12 text-center rounded-xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl lg:text-5xl text-safari-gold-light"
            >
              Sustainability & Conservation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-safari-sand-light/90"
            >
              Luxury travelers care about the land. So do we. Our model is
              low-density tourism, conservation partnerships, and community
              collaboration—so the wilderness we showcase remains wild for
              generations.
            </motion.p>
          </GlassCard>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-safari-green">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
          <div>
            <h2 className="font-display text-2xl text-safari-gold-light mb-4">
              Low-Density Tourism
            </h2>
            <p className="text-safari-sand-light/90 leading-relaxed">
              We deliberately focus on Southern and Western Tanzania—parks with
              far fewer visitors than the northern circuit. Fewer vehicles, less
              pressure on wildlife, and a more authentic experience. Our
              itineraries avoid overcrowded nodes and favor camps that limit
              guest numbers.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-safari-gold-light mb-4">
              Conservation Partnerships
            </h2>
            <p className="text-safari-sand-light/90 leading-relaxed">
              We partner with camps and conservancies that invest in
              anti-poaching, habitat restoration, and wildlife research. Where
              possible, we connect our guests with these initiatives—so your
              safari supports the places you visit.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-safari-gold-light mb-4">
              Community Collaboration
            </h2>
            <p className="text-safari-sand-light/90 leading-relaxed">
              Sustainable safari includes people. We work with operators who
              employ locally, source locally, and contribute to education and
              health in adjacent communities. Luxury, for us, means leaving the
              land and its people better than we found them.
            </p>
          </div>
          <div className="pt-8">
            <Button href="/plan-your-safari" variant="primary">
              Plan Your Safari
            </Button>
            <Link
              href="/experiences/conservation"
              className="ml-4 text-safari-gold hover:underline"
            >
              Conservation Safaris
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
