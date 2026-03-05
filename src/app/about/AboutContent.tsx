"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

const ABOUT_TESTIMONIALS = [
  {
    quote:
      "An experience that transcends the traditional safari. The attention to detail and commitment to conservation made our journey deeply meaningful.",
    name: "The Henderson Family",
    location: "London, UK",
  },
  {
    quote:
      "Tanzania Wildmakers provided a level of exclusivity we hadn't found elsewhere. Witnessing the migration from a private camp was life-changing.",
    name: "James Sterling",
    location: "New York, USA",
  },
  {
    quote:
      "The guides here aren't just experts; they are poets of the savannah. Every day felt like a new chapter in a magnificent wilderness story.",
    name: "Elena Moretti",
    location: "Milan, Italy",
  },
  {
    quote:
      "A masterclass in luxury hospitality. We left with a profound appreciation for the conservation work being done behind the scenes.",
    name: "Dr. Richard Vance",
    location: "Dubai, UAE",
  },
];

// Expert team — placeholder URLs (initials + brand colors) so images always load
const TEAM = [
  {
    name: "Emmanuel K.",
    role: "Head Field Guide",
    imageUrl: "https://ui-avatars.com/api/?name=Emmanuel+K&size=400&background=1e4030&color=c4a967&bold=true",
    alt: "Emmanuel K., Head Field Guide",
  },
  {
    name: "Sarah M.",
    role: "Experience Director",
    imageUrl: "https://ui-avatars.com/api/?name=Sarah+M&size=400&background=1e4030&color=c4a967&bold=true",
    alt: "Sarah M., Experience Director",
  },
  {
    name: "Dr. Lucas J.",
    role: "Chief Ecologist",
    imageUrl: "https://ui-avatars.com/api/?name=Lucas+J&size=400&background=1e4030&color=c4a967&bold=true",
    alt: "Dr. Lucas J., Chief Ecologist",
  },
  {
    name: "Nia W.",
    role: "Private Concierge",
    imageUrl: "https://ui-avatars.com/api/?name=Nia+W&size=400&background=1e4030&color=c4a967&bold=true",
    alt: "Nia W., Private Concierge",
  },
];

const FOUNDER_QUOTE =
  "We do not inherit the earth from our ancestors, we borrow it from our children. Our mission at Wildmakers is to ensure that the story of the African wilderness remains vibrant for generations, told through the lens of luxury that respects every leaf and paw print.";

export function AboutContent() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    if (index < 0) setTestimonialIndex(ABOUT_TESTIMONIALS.length - 1);
    else if (index >= ABOUT_TESTIMONIALS.length) setTestimonialIndex(0);
    else setTestimonialIndex(index);
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo(testimonialIndex + 1), 6000);
    return () => clearInterval(t);
  }, [testimonialIndex, goTo]);

  return (
    <>
      {/* Hero — full-height, portrait/safari background */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1920&q=80"
            alt=""
            fill
            className="object-cover grayscale opacity-60"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-safari-green-dark via-safari-green-dark/50 to-transparent" />
        </div>
        <div className="relative z-10 px-4 text-center max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-safari-gold-light text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6"
          >
            The Architects of Your
            <br />
            Wilderness Narrative
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-safari-sand-light/90 text-lg font-light max-w-2xl mx-auto md:text-xl"
          >
            Crafting legacy safaris where high-end hospitality meets deep-rooted African conservation.
          </motion.p>
        </div>
      </section>

      {/* Our Heritage — glass card overlapping hero */}
      <section className="relative z-20 px-4 pb-24 sm:px-6 lg:px-8 -mt-32">
        <div className="max-w-5xl mx-auto about-glass rounded-2xl p-8 shadow-2xl md:p-16">
          <div className="grid gap-12 items-center md:grid-cols-2">
            <div>
              <span className="text-safari-gold font-body font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
                Our Heritage
              </span>
              <h2 className="font-display text-3xl font-bold text-white mb-6 md:text-4xl">
                Born from the Earth
              </h2>
              <p className="text-safari-sand-light/80 leading-relaxed mb-6">
                Founded at the intersection of luxury and preservation, Tanzania Wildmakers was born from a singular passion: to protect the wild while offering unparalleled guest experiences. Our journey began in the heart of the Serengeti, driven by the belief that true luxury lies in the harmony between man and nature.
              </p>
              <p className="text-safari-sand-light/80 leading-relaxed">
                Today, we are more than a safari operator. We are stewards of the land, partners to the local Maasai communities, and curators of moments that transform perspectives.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-safari-gold/20 aspect-square relative">
              <Image
                src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80"
                alt="Safari scene"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reflections — Guest Testimonials carousel */}
      <section className="relative overflow-hidden bg-safari-green-dark py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=60"
            alt=""
            fill
            className="object-cover opacity-20 blur-2xl scale-110"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-safari-green-dark via-transparent to-safari-green-dark" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-safari-gold font-body font-bold tracking-[0.3em] text-xs uppercase mb-4 block">
                Reflections
              </span>
              <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
                Guest Testimonials
              </h2>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => goTo(testimonialIndex - 1)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-safari-gold/30 text-safari-gold transition-all hover:bg-safari-gold/10"
                aria-label="Previous testimonial"
              >
                <span className="text-2xl leading-none">‹</span>
              </button>
              <button
                type="button"
                onClick={() => goTo(testimonialIndex + 1)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-safari-gold/30 text-safari-gold transition-all hover:bg-safari-gold/10"
                aria-label="Next testimonial"
              >
                <span className="text-2xl leading-none">›</span>
              </button>
            </div>
          </div>
          <div className="relative min-h-[280px] md:min-h-[260px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
                className="about-testimonial-glass relative flex flex-col rounded-2xl p-8 md:p-10 lg:p-12 max-w-3xl mx-auto"
              >
                <span className="font-display text-safari-gold text-5xl opacity-50 absolute left-6 top-6 lg:text-6xl" aria-hidden>
                  &ldquo;
                </span>
                <div className="relative z-10 pt-6">
                  <p className="text-safari-sand-light/95 text-lg font-light italic leading-relaxed mb-8 md:text-xl">
                    &ldquo;{ABOUT_TESTIMONIALS[testimonialIndex].quote}&rdquo;
                  </p>
                  <h4 className="font-display text-xl font-bold text-white">
                    {ABOUT_TESTIMONIALS[testimonialIndex].name}
                  </h4>
                  <p className="text-safari-gold/80 text-sm font-body tracking-widest uppercase mt-1">
                    {ABOUT_TESTIMONIALS[testimonialIndex].location}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mx-auto mt-8 h-px w-full max-w-2xl bg-safari-gold/20 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute left-0 top-0 h-full bg-safari-gold shadow-[0_0_8px_rgba(196,169,103,0.5)]"
              initial={false}
              animate={{ width: `${((testimonialIndex + 1) / ABOUT_TESTIMONIALS.length) * 100}%` }}
              transition={{ type: "tween", duration: 0.3 }}
            />
          </div>
        </div>
      </section>

      {/* The Artisans — Expert Team */}
      <section className="about-gold-texture bg-safari-green-dark py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <span className="text-safari-gold font-body font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
            The Artisans
          </span>
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            The Expert Team
          </h2>
          <p className="text-safari-sand-light/80 max-w-2xl mx-auto font-body">
            Meet the conservationists, master guides, and luxury concierges who make your journey possible.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center"
            >
              <div className="relative size-36 overflow-hidden rounded-full border-2 border-safari-gold p-1.5 mb-5 md:size-44">
                <Image
                  src={member.imageUrl}
                  alt={member.alt}
                  fill
                  className="object-cover rounded-full"
                  sizes="176px"
                />
              </div>
              <h4 className="font-display text-xl font-bold text-white">{member.name}</h4>
              <p className="text-safari-gold text-sm font-medium font-body">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Founder quote */}
      <section className="relative overflow-hidden bg-safari-green py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 about-gold-texture opacity-20" aria-hidden />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="font-display text-safari-gold text-5xl md:text-6xl leading-none" aria-hidden>
            &ldquo;
          </span>
          <blockquote className="font-display text-xl text-safari-sand-light italic leading-relaxed mb-10 md:text-2xl lg:text-3xl">
            {FOUNDER_QUOTE}
          </blockquote>
          <footer className="flex flex-col items-center gap-2">
            <cite className="font-display text-safari-gold text-2xl not-italic md:text-3xl">
              A. Juma
            </cite>
            <p className="text-safari-sand-light/70 text-sm font-body tracking-widest uppercase">
              Founder & Visionary
            </p>
            <div className="mt-6 w-24 border-t border-safari-gold/30 pt-4" />
          </footer>
        </div>
      </section>

      {/* Conservation CTA */}
      <section className="border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-safari-gold-light mb-6 lg:text-3xl">
            Conservation & Community
          </h2>
          <p className="text-safari-sand-light/90 leading-relaxed font-body">
            Our itineraries are built on low-density tourism and conservation partnerships. We collaborate with local communities and support initiatives that protect the wilderness we showcase. Luxury, for us, includes leaving the land and its people better than we found them.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/sustainability" variant="outline" className="rounded-xl">
              Our Sustainability Commitment
            </Button>
            <Button href="/plan-your-safari" variant="primary" className="rounded-xl">
              Plan Your Safari
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
