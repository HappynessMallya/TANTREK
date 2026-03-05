"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
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

type SanctuaryFrame = 0 | 1 | 2; // 0 = lodge (main), 1 = wild (overlap), 2 = safari (back)

export default function HomePage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [sanctuaryFrameOnTop, setSanctuaryFrameOnTop] = useState<SanctuaryFrame>(0);

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
          <div className="absolute inset-0 dust-layer pointer-events-none" aria-hidden />
        </div>

        {/* Hero content — eyebrow, headline, tagline, journey bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 px-4 sm:px-6 text-center max-w-5xl mx-auto pb-24"
        >
          <p className="font-body text-safari-gold text-[10px] sm:text-xs font-semibold tracking-[0.35em] uppercase mb-6">
            Est. 2010 • Private & Exclusive
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[1.08] font-normal tracking-tight">
            Where Untamed Wild
            <br />
            <span className="italic font-light">Meets Refined Luxury</span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-white/70 max-w-xl mx-auto font-body font-light leading-relaxed tracking-wide">
            Private safaris across Serengeti, Ruaha, and Katavi—crafted for travelers who seek profound wilderness without compromise.
          </p>

          {/* Hero glass CTA bar — Begin Your Journey + Explore Our Sanctuaries */}
          <div className="hero-journey-bar mt-10 sm:mt-12 px-4 py-4 rounded-lg max-w-2xl mx-auto w-full flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/plan-your-safari"
              className="luxury-cta-primary luxury-cta-glow inline-flex items-center justify-center font-body text-xs font-bold tracking-[0.25em] uppercase w-full sm:w-auto"
            >
              Begin Your Journey
            </Link>
            <Link
              href="/destinations"
              className="luxury-cta-secondary inline-flex items-center justify-center font-body text-xs font-semibold tracking-[0.22em] uppercase w-full sm:w-auto"
            >
              Explore Our Sanctuaries
            </Link>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <span className="block w-6 h-10 border-2 border-safari-sand/50 rounded-full mx-auto" />
          <span className="block text-xs text-safari-sand/60 mt-2">Scroll</span>
        </motion.div>
      </section>

      {/* Media mentions — prestige strip: champagne, minimal luxury */}
      <section className="section-bg-press relative z-20 px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
        <div className="absolute inset-0 press-texture pointer-events-none" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-10 sm:gap-16 md:gap-24">
          <span className="font-display text-lg sm:text-xl tracking-tight text-luxury-gold/80 hover:brightness-[1.2] transition-[filter] duration-300">Condé Nast <span className="font-bold">Traveler</span></span>
          <span className="font-display text-xl font-bold tracking-widest uppercase text-luxury-gold/80 hover:brightness-[1.2] transition-[filter] duration-300">Vogue</span>
          <span className="font-display text-lg tracking-tight text-luxury-gold/80 hover:brightness-[1.2] transition-[filter] duration-300">Financial Times</span>
          <span className="font-display text-xl italic tracking-tight text-luxury-gold/80 hover:brightness-[1.2] transition-[filter] duration-300">Departures</span>
          <span className="font-body font-bold text-sm tracking-[0.25em] uppercase text-luxury-gold/80 hover:brightness-[1.2] transition-[filter] duration-300">Tatler</span>
        </div>
      </section>

      {/* Sanctuaries of the Wild — immersive nature, jungle gradient + dust */}
      <section className="section-bg-sanctuaries relative luxury-section-padding overflow-hidden">
        <div className="absolute inset-0 sanctuaries-dust pointer-events-none" aria-hidden />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.12]"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=60)" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-safari-green-dark/50 via-safari-green-dark/30 to-transparent" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
              <p className="font-body text-safari-gold text-[10px] font-bold tracking-[0.3em] uppercase">
                Our destinations
              </p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
                Sanctuaries of
                <br />
                <span className="italic font-light">The Wild</span>
              </h2>
              <p className="text-safari-sand-light/70 font-body font-light leading-relaxed text-sm max-w-md">
                From the Serengeti and Ngorongoro to Ruaha, Julius Nyerere, and Katavi—each sanctuary is a place we know intimately. We craft journeys into Tanzania&apos;s most pristine wilderness, with world-class guiding and the camps that belong there.
              </p>
              <div className="pt-2">
                <Link
                  href="/destinations"
                  className="inline-block font-body text-safari-gold text-[10px] font-bold tracking-[0.25em] uppercase border-b border-safari-gold/30 pb-1.5 hover:border-safari-gold transition-colors"
                >
                  Explore our sanctuaries
                </Link>
              </div>
            </div>
            <div className="lg:col-span-7 relative flex justify-end order-1 lg:order-2 min-h-[320px] lg:min-h-[480px]">
              {/* Spacer so container keeps size when all frames are absolute */}
              <div className="w-[85%] lg:w-4/5 aspect-[3/4] shrink-0 pointer-events-none invisible" aria-hidden />
              {/* Main image — lodge: show more left of image; click brings to front */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSanctuaryFrameOnTop(0)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSanctuaryFrameOnTop(0); } }}
                className={`absolute right-0 top-0 w-[85%] lg:w-4/5 aspect-[3/4] cursor-pointer select-none transition-all duration-300 sanctuary-frame ${sanctuaryFrameOnTop === 0 ? "z-30 ring-2 ring-luxury-gold/50 ring-offset-2 ring-offset-safari-green-dark sanctuary-frame-active" : "z-10"}`}
                aria-label="Focus lodge image"
              >
                <div className="relative w-full h-full overflow-hidden rounded-[18px]">
                  <Image
                    src="/lodge.jpg"
                    alt="Luxury safari lodge"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 85vw, 55vw"
                    style={{ objectPosition: "left center" }}
                  />
                </div>
              </div>
              {/* Overlapping image — the wild; click brings to front */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSanctuaryFrameOnTop(1)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSanctuaryFrameOnTop(1); } }}
                className={`absolute -bottom-12 -left-4 lg:-bottom-20 lg:-left-10 w-[60%] lg:w-3/5 aspect-[4/5] overflow-hidden rounded-[18px] border-4 border-safari-green-dark cursor-pointer select-none transition-all duration-300 sanctuary-frame ${sanctuaryFrameOnTop === 1 ? "z-30 ring-2 ring-luxury-gold/50 ring-offset-2 ring-offset-safari-green-dark sanctuary-frame-active" : "z-20"}`}
                aria-label="Focus wilderness image"
              >
                <Image
                  src="/wild.jpg"
                  alt="Tanzania wilderness"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 35vw"
                />
              </div>
              {/* Faded background image — safari; click brings to front and shows full color */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSanctuaryFrameOnTop(2)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSanctuaryFrameOnTop(2); } }}
                className={`absolute -top-6 -right-4 lg:-top-12 lg:-right-8 w-[45%] lg:w-2/5 aspect-square overflow-hidden rounded-[18px] cursor-pointer select-none transition-all duration-300 sanctuary-frame ${sanctuaryFrameOnTop === 2 ? "z-30 opacity-100 grayscale-0 ring-2 ring-luxury-gold/50 ring-offset-2 ring-offset-safari-green-dark sanctuary-frame-active" : "z-0 opacity-50 grayscale"}`}
                aria-label="Focus safari image"
              >
                <Image
                  src="/safari.jpg"
                  alt="Safari experience"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 40vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Distinction — brand authority: dark emerald + gold radial + glass pillar cards */}
      <section className="section-bg-distinction relative luxury-section-padding overflow-hidden">
        <div className="absolute inset-0 distinction-texture pointer-events-none" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-24 space-y-4">
            <p className="font-body text-luxury-gold text-[10px] font-bold tracking-[0.35em] uppercase">
              Distinction
            </p>
            <div className="luxury-gold-line mx-auto" aria-hidden />
            <h2 className="font-display text-4xl sm:text-5xl text-white italic font-light mt-4">
              The Tanzania Wildmakers Standard
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {[
              { icon: "diamond", title: "Bespoke Curation", copy: "Every itinerary is a unique masterpiece, shaped around your dates, interests, and the wilderness you want to experience." },
              { icon: "guide", title: "Elite Guidance", copy: "Our guides hold the highest level of certification, offering deep insight into wildlife, ecosystems, and local culture." },
              { icon: "heart", title: "Ethical Impact", copy: "We dedicate a meaningful part of our practice to conservation and community partnerships in the regions we travel." },
              { icon: "care", title: "Infinite Care", copy: "From touchdown to departure, your journey is managed with precision—logistics, camps, and moments that matter." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="luxury-pillar-card rounded-xl p-8 lg:p-10 text-center space-y-6"
              >
                <div className="flex justify-center">
                  {item.icon === "diamond" && (
                    <svg className="w-8 h-8 text-luxury-gold" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12 2L2 7l10 15 10-15-10-5z" /></svg>
                  )}
                  {item.icon === "guide" && (
                    <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  )}
                  {item.icon === "heart" && (
                    <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  )}
                  {item.icon === "care" && (
                    <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  )}
                </div>
                <div className="space-y-3">
                  <h3 className="font-body text-white text-[11px] font-semibold uppercase tracking-widest">
                    {item.title}
                  </h3>
                  <p className="text-safari-sand-light/70 text-[13px] font-light leading-relaxed tracking-wide">
                    {item.copy}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story — editorial: large cinematic photo + dark overlay + gold line under quote */}
      <section className="section-bg-our-story relative luxury-section-padding overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1920&q=80)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 our-story-overlay" aria-hidden />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="font-body text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-luxury-gold">
              Our Story
            </p>
            <p
              className="font-display mt-8 text-2xl sm:text-3xl lg:text-4xl text-safari-gold-light leading-snug"
              style={{ fontFeatureSettings: '"kern" 1' }}
            >
              &quot;We are wilderness architects.&quot;
            </p>
            <div className="luxury-gold-line-wide mx-auto mt-6" aria-hidden />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mt-10 lg:mt-12 px-0 sm:px-4"
          >
            <div className="border-l-2 border-luxury-gold/50 pl-6 sm:pl-8 py-1 text-safari-sand-light/95 text-base sm:text-lg leading-relaxed space-y-5">
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

      {/* Testimonials — light & airy: warm safari sand + grain, white cards, gold stars */}
      <section className="section-bg-testimonials relative luxury-section-padding overflow-hidden">
        <div className="absolute inset-0 testimonials-grain pointer-events-none" aria-hidden />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-luxury-gold">
              In their words
            </p>
            <div className="luxury-gold-line mx-auto mt-3" aria-hidden />
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-stone-800 mt-6">
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
                <div className="luxury-testimonial-card p-8 sm:p-10 lg:p-12 text-center">
                  <div className="flex justify-center mb-6">
                    <span className="text-luxury-gold" aria-hidden>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className="inline-block w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </span>
                  </div>
                  <blockquote className="font-display text-lg sm:text-xl lg:text-2xl text-stone-700 leading-relaxed italic">
                    &quot;{TESTIMONIALS[testimonialIndex].quote}&quot;
                  </blockquote>
                  <footer className="mt-8 flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-luxury-gold/40 bg-luxury-gold/10 font-display text-sm font-semibold text-stone-800">
                      {TESTIMONIALS[testimonialIndex].initials}
                    </div>
                    <p className="mt-3 font-body font-semibold text-stone-800">
                      {TESTIMONIALS[testimonialIndex].name}
                    </p>
                    <p className="mt-1 font-body text-sm text-stone-600">
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
                className="p-2 rounded-full border border-luxury-gold/50 text-stone-700 transition-colors hover:bg-luxury-gold/10 hover:border-luxury-gold"
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
                      i === testimonialIndex ? "w-8 bg-luxury-gold" : "w-2 bg-stone-400 hover:bg-stone-500"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => goTo(testimonialIndex + 1)}
                className="p-2 rounded-full border border-luxury-gold/50 text-stone-700 transition-colors hover:bg-luxury-gold/10 hover:border-luxury-gold"
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

      {/* Where We Go — map-inspired gradient + faint texture, circuit cards with bg images */}
      <section className="section-bg-where-we-go relative luxury-section-padding overflow-hidden">
        <div className="absolute inset-0 where-we-go-texture pointer-events-none" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-body text-luxury-gold text-[10px] font-bold tracking-[0.35em] uppercase mb-4"
            >
              Explore
            </motion.p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="luxury-gold-line" aria-hidden />
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-light tracking-tight"
              >
                Where We Go
              </motion.h2>
              <div className="luxury-gold-line" aria-hidden />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-safari-sand-light/60 font-body text-sm max-w-md mx-auto"
            >
              Three circuits. One standard of excellence.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: "Northern Circuit", desc: "Serengeti, Ngorongoro, Tarangire, Lake Manyara.", href: "/destinations/northern", bgImage: "url(https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=70)" },
              { title: "Southern Circuit", desc: "Julius Nyerere, Ruaha — the soul of wilderness.", href: "/destinations/southern", bgImage: "url(https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&q=70)" },
              { title: "Western Circuit", desc: "Katavi — Africa&apos;s last true frontier.", href: "/destinations/western", bgImage: "url(/wild.jpg)" },
            ].map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={item.href}
                  className="luxury-circuit-card group block p-8 lg:p-10 h-full min-h-[280px] flex flex-col justify-end transition-all duration-500"
                  style={{ backgroundImage: item.bgImage, backgroundSize: "cover", backgroundPosition: "center" }}
                >
                  <span className="relative z-10">
                    <div className="h-px w-10 bg-luxury-gold/70 mb-6 group-hover:w-14 transition-all duration-300" aria-hidden />
                    <h3 className="font-display text-xl lg:text-2xl text-white font-medium tracking-tight group-hover:text-safari-gold-light transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-white/90 text-sm font-body leading-relaxed">
                      {item.desc}
                    </p>
                    <span className="inline-block mt-6 font-body text-luxury-gold text-[10px] font-semibold tracking-[0.2em] uppercase group-hover:tracking-[0.3em] transition-all">
                      Discover →
                    </span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-14 text-center"
          >
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 font-body text-safari-gold text-xs font-bold tracking-[0.25em] uppercase hover:text-safari-gold-light transition-colors"
            >
              Explore all sanctuaries
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Safari Experiences — dark emerald + gold glow, gold divider under heading */}
      <section className="section-bg-experiences relative luxury-section-padding overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-body text-luxury-gold text-[10px] font-bold tracking-[0.35em] uppercase mb-4"
            >
              Curated journeys
            </motion.p>
            <div className="luxury-experience-divider w-12 mx-auto mb-6" aria-hidden />
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-light tracking-tight italic"
            >
              Safari Experiences
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="mt-4 text-safari-sand-light/60 font-body text-sm max-w-lg mx-auto"
            >
              From fly-in luxury to honeymoons and conservation journeys.
            </motion.p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              { label: "Luxury Fly-in", href: "/experiences/luxury-fly-in" },
              { label: "Honeymoon", href: "/experiences/honeymoon" },
              { label: "Photographic", href: "/experiences/photographic" },
              { label: "Conservation", href: "/experiences/conservation" },
              { label: "Corporate", href: "/experiences/corporate" },
            ].map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="inline-block px-6 py-3.5 rounded-lg border border-luxury-gold/30 bg-white/[0.03] font-body text-[11px] font-medium tracking-[0.2em] uppercase text-safari-sand-light/95 hover:border-luxury-gold/50 hover:bg-luxury-gold/10 hover:text-safari-gold-light transition-all duration-300"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link
              href="/experiences"
              className="font-body text-luxury-gold text-xs tracking-widest uppercase hover:text-luxury-gold-hover transition-colors"
            >
              All curated journeys →
            </Link>
          </motion.p>
        </div>
      </section>

      {/* Begin Your Frontier — cinematic golden sunset + dark overlay + gold CTA glow */}
      <section className="section-bg-frontier relative luxury-section-padding overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=70)" }}
          aria-hidden
        />
        <div className="absolute inset-0 frontier-overlay" aria-hidden />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-body text-luxury-gold text-[10px] font-bold tracking-[0.4em] uppercase mb-6"
          >
            Your journey
          </motion.p>
          <div className="luxury-gold-line mx-auto mb-8" aria-hidden />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-light tracking-tight leading-[1.1]"
          >
            Begin Your Frontier
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mt-8 text-safari-sand-light/90 font-body text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
          >
            Tell us your dates, budget, and dreams. We&apos;ll craft an itinerary that belongs only to you.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/plan-your-safari"
              className="luxury-cta-frontier luxury-cta-glow inline-flex items-center justify-center font-body text-xs font-bold tracking-[0.25em] uppercase w-full sm:w-auto"
            >
              Plan your safari
            </Link>
            <a
              href="https://wa.me/255762111315"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-safari-sand-light/80 text-sm tracking-wide hover:text-safari-gold-light transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Or reach us on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
