"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { JOURNAL_CATEGORIES, JOURNAL_POSTS, type JournalCategorySlug } from "@/data/safariJournal";
import { publicApi, type JournalPost } from "@/lib/public-api";

function normalisePost(p: JournalPost) {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    category: p.category?.slug ?? "travel-inspiration",
    categoryLabel: p.category?.label ?? "Stories",
    image: p.heroImage?.url ?? "/tour2.webp",
    imageAlt: p.heroImage?.altText ?? p.title,
    readTime: p.readTime ? `${p.readTime} min read` : undefined,
  };
}

export default function SafariJournalPage() {
  const [activeCategory, setActiveCategory] = useState<JournalCategorySlug | "all">("all");
  const [posts, setPosts] = useState(() =>
    JOURNAL_POSTS.map((p) => ({
      ...p,
      categoryLabel: JOURNAL_CATEGORIES.find((c) => c.slug === p.category)?.label ?? p.category,
    }))
  );

  useEffect(() => {
    publicApi.getJournalPosts({ limit: 50 }).then((apiPosts) => {
      if (apiPosts && apiPosts.length > 0) {
        setPosts(apiPosts.map(normalisePost) as typeof posts);
      }
    });
  }, []);

  const filteredPosts = useMemo(
    () =>
      activeCategory === "all"
        ? posts
        : posts.filter((p) => p.category === activeCategory),
    [activeCategory, posts]
  );

  const featured = filteredPosts[0];
  const rest = filteredPosts.slice(1);

  return (
    <>
      {/* Hero — navy overlay, white headline, orange eyebrow */}
      <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden bg-tantrek-navy-deep">
        <div className="absolute inset-0">
          <Image
            src="/tour5.webp"
            alt=""
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-hero-overlay" aria-hidden />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,122,0,0.18), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-tantrek-orange text-[11px] font-bold tracking-[0.36em] uppercase mb-5">
            TANTREK 360 Insights
          </p>
          <div className="luxury-gold-line mx-auto mb-6" aria-hidden />
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-bold tracking-tight leading-tight">
            Insights &amp; <span className="text-tantrek-orange">Stories</span>
          </h1>
          <p className="mt-6 text-white/85 text-base sm:text-lg font-body leading-relaxed max-w-2xl mx-auto">
            Travel guidance, investment perspectives, and field notes from Tanzania&apos;s
            wilderness — and its emerging markets.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="relative z-20 bg-white border-b border-tantrek-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full font-body text-[11px] font-semibold tracking-wider uppercase transition-all ${
                activeCategory === "all"
                  ? "bg-tantrek-orange text-white shadow-[0_6px_16px_rgba(255,122,0,0.28)]"
                  : "bg-tantrek-surface text-tantrek-navy border border-tantrek-border hover:bg-tantrek-orange/10 hover:border-tantrek-orange/35"
              }`}
            >
              All
            </button>
            {JOURNAL_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-full font-body text-[11px] font-semibold tracking-wider uppercase transition-all ${
                  activeCategory === cat.slug
                    ? "bg-tantrek-orange text-white shadow-[0_6px_16px_rgba(255,122,0,0.28)]"
                    : "bg-tantrek-surface text-tantrek-navy border border-tantrek-border hover:bg-tantrek-orange/10 hover:border-tantrek-orange/35"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured + grid */}
      <section className="relative bg-white px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">
          {featured && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-14 lg:mb-20"
            >
              <Link
                href={`/safari-journal/${featured.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-center"
              >
                <div className="lg:col-span-3 relative aspect-[16/10] overflow-hidden rounded-2xl shadow-card">
                  <Image
                    src={featured.image}
                    alt={featured.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-tantrek-orange px-3 py-1.5 text-white text-[10px] font-bold tracking-wider uppercase shadow-[0_6px_14px_rgba(255,122,0,0.32)]">
                    Featured
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-5">
                  <p className="font-body text-[11px] font-bold tracking-[0.28em] uppercase text-tantrek-orange">
                    {featured.categoryLabel}
                    {featured.readTime && (
                      <span className="ml-3 text-tantrek-text-muted font-medium normal-case tracking-normal">
                        · {featured.readTime}
                      </span>
                    )}
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-tantrek-navy leading-tight font-bold group-hover:text-tantrek-orange transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-tantrek-text-muted font-body text-base leading-relaxed">
                    {featured.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 font-body text-tantrek-orange text-sm font-semibold tracking-wide">
                    Read story
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </motion.article>
          )}

          {rest.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-10">
                <p className="font-body text-tantrek-orange text-[11px] font-bold tracking-[0.32em] uppercase">
                  More Stories
                </p>
                <div className="h-px flex-1 bg-tantrek-border" aria-hidden />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {rest.map((post, i) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="group"
                  >
                    <Link
                      href={`/safari-journal/${post.slug}`}
                      className="rounded-2xl overflow-hidden bg-white border border-tantrek-border shadow-soft transition-all duration-300 hover:border-tantrek-orange/40 hover:shadow-card hover:-translate-y-1 h-full flex flex-col"
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
                              "linear-gradient(to top, rgba(0,43,91,0.55) 0%, transparent 55%)",
                          }}
                          aria-hidden
                        />
                        <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1 font-body text-[10px] font-bold tracking-wider uppercase text-tantrek-navy shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
                          {post.categoryLabel ?? JOURNAL_CATEGORIES.find((c) => c.slug === post.category)?.label ?? post.category}
                        </span>
                        {post.readTime && (
                          <span className="absolute bottom-3 right-3 inline-flex items-center rounded-full bg-tantrek-navy/85 px-3 py-1 font-body text-[10px] font-semibold text-white backdrop-blur-sm">
                            {post.readTime}
                          </span>
                        )}
                      </div>
                      <div className="p-6 sm:p-7 flex-1 flex flex-col">
                        <h2 className="font-display text-lg sm:text-xl text-tantrek-navy leading-snug font-semibold group-hover:text-tantrek-orange transition-colors duration-300">
                          {post.title}
                        </h2>
                        <p className="mt-3 text-tantrek-text-muted font-body text-sm leading-relaxed line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-2 font-body text-[11px] font-bold tracking-[0.22em] uppercase text-tantrek-orange">
                          Read story
                          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </>
          )}

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-tantrek-text-muted font-body text-lg">
                No stories in this category yet. Check back soon.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="mt-6 inline-flex items-center gap-2 font-body text-tantrek-orange text-sm font-semibold tracking-wide hover:underline"
              >
                View all stories →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-tantrek-surface border-t border-tantrek-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-tantrek-navy font-bold mb-4">
            Want a story that fits <span className="text-tantrek-orange">your journey</span>?
          </h2>
          <p className="text-tantrek-text-muted font-body leading-relaxed mb-8 max-w-xl mx-auto">
            Every TANTREK 360 itinerary starts with a conversation. Tell us your goals — travel,
            investment, or both — and we&apos;ll design a programme around them.
          </p>
          <Link
            href="/plan-your-safari"
            className="inline-flex items-center gap-2 rounded-full bg-tantrek-orange px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,122,0,0.3)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5"
          >
            Speak to an Expert
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
