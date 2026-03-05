"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { JOURNAL_CATEGORIES, JOURNAL_POSTS, type JournalCategorySlug } from "@/data/safariJournal";

export default function SafariJournalPage() {
  const [activeCategory, setActiveCategory] = useState<JournalCategorySlug | "all">("all");

  const filteredPosts =
    activeCategory === "all"
      ? JOURNAL_POSTS
      : JOURNAL_POSTS.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=60)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-safari-green-dark/80 via-safari-green-dark/60 to-safari-green-dark" aria-hidden />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-luxury-gold text-[10px] font-bold tracking-[0.35em] uppercase mb-4">
            Stories from the wild
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Safari Journal
          </h1>
          <p className="mt-6 text-safari-sand-light/90 text-base sm:text-lg font-body font-light leading-relaxed max-w-2xl mx-auto">
            Stories, insights and seasonal guidance from Tanzania&apos;s wild frontiers.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="relative z-20 -mt-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-lg font-body text-xs font-semibold tracking-wider uppercase transition-colors ${
                activeCategory === "all"
                  ? "bg-luxury-gold text-[#0B1F1A]"
                  : "bg-white/10 text-safari-sand-light/90 border border-white/20 hover:bg-white/15 hover:border-luxury-gold/40"
              }`}
            >
              All
            </button>
            {JOURNAL_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-lg font-body text-xs font-semibold tracking-wider uppercase transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-luxury-gold text-[#0B1F1A]"
                    : "bg-white/10 text-safari-sand-light/90 border border-white/20 hover:bg-white/15 hover:border-luxury-gold/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial cards */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredPosts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group"
              >
                <Link
                  href={`/safari-journal/${post.slug}`}
                  className="block rounded-[10px] overflow-hidden bg-safari-green-dark/50 border border-white/10 transition-all duration-300 hover:border-luxury-gold/30 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]"
                  style={{
                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.35)",
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                      }}
                    />
                    <span className="absolute bottom-3 left-3 font-body text-[10px] font-semibold tracking-wider uppercase text-luxury-gold">
                      {JOURNAL_CATEGORIES.find((c) => c.slug === post.category)?.label ?? post.category}
                    </span>
                    {post.readTime && (
                      <span className="absolute bottom-3 right-3 font-body text-[10px] text-white/80">
                        {post.readTime}
                      </span>
                    )}
                  </div>
                  <div className="p-6 sm:p-7">
                    <h2 className="font-display text-xl sm:text-2xl text-white leading-snug group-hover:text-luxury-gold transition-colors duration-300">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-safari-sand-light/70 text-sm font-body leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <p className="text-center text-safari-sand-light/70 font-body py-12">
              No stories in this category yet. Check back soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
