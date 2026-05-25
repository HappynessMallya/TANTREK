"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  JOURNAL_CATEGORIES,
  JOURNAL_POSTS,
  type JournalCategorySlug,
} from "@/data/safariJournal";
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
  const [activeCategory, setActiveCategory] = useState<
    JournalCategorySlug | "all"
  >("all");
  const [posts, setPosts] = useState(() =>
    JOURNAL_POSTS.map((p) => ({
      ...p,
      categoryLabel:
        JOURNAL_CATEGORIES.find((c) => c.slug === p.category)?.label ??
        p.category,
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
      {/* ═══════════════════════════════════════════════════════════════════
          1 · Cinematic hero — navy with editorial framing
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-tantrek-navy-deep pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
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
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="editorial-eyebrow text-tantrek-orange mb-6 justify-center">
            The Tantrek Journal
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] text-white font-bold tracking-tight leading-[1.04]">
            Field notes and{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              stories from the road.
            </span>
          </h1>
          <p className="mt-7 text-white/85 text-base sm:text-lg lg:text-xl font-body leading-relaxed max-w-2xl mx-auto">
            Travel guidance, seasonal reading, and quiet dispatches from
            Tanzania&rsquo;s wilderness — and the emerging opportunity around
            it.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2 · Category filter
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-tantrek-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full font-body text-[11px] font-semibold tracking-wider uppercase transition-all ${
                activeCategory === "all"
                  ? "bg-tantrek-navy text-white"
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
                    ? "bg-tantrek-navy text-white"
                    : "bg-tantrek-surface text-tantrek-navy border border-tantrek-border hover:bg-tantrek-orange/10 hover:border-tantrek-orange/35"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3 · Featured story + grid of remaining
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 luxury-section-padding">
        <div className="max-w-7xl mx-auto">
          {featured && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-16 lg:mb-20"
            >
              <Link
                href={`/safari-journal/${featured.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
              >
                <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(0,43,91,0.16)]">
                  <Image
                    src={featured.image}
                    alt={featured.imageAlt}
                    fill
                    className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                  <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-tantrek-navy/85 backdrop-blur-sm px-3.5 py-1.5 text-white text-[10px] font-bold tracking-[0.24em] uppercase">
                    Featured
                  </span>
                </div>
                <div className="lg:col-span-5 space-y-6">
                  <p className="editorial-eyebrow text-tantrek-orange">
                    {featured.categoryLabel}
                    {featured.readTime && (
                      <span className="ml-3 text-tantrek-text-muted font-medium normal-case tracking-normal text-xs">
                        · {featured.readTime}
                      </span>
                    )}
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] text-tantrek-navy leading-[1.1] font-bold group-hover:text-tantrek-orange transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-tantrek-text-muted font-body text-base lg:text-lg leading-relaxed">
                    {featured.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 font-body text-tantrek-navy text-[11px] font-bold tracking-[0.22em] uppercase group-hover:gap-3 group-hover:text-tantrek-orange transition-all">
                    Read the story <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </motion.article>
          )}

          {rest.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-12 lg:mb-14">
                <p className="editorial-eyebrow text-tantrek-orange">
                  More Stories
                </p>
                <div className="h-px flex-1 bg-tantrek-border" aria-hidden />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-14">
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
                      className="block h-full"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-tantrek-navy-deep">
                        <Image
                          src={post.image}
                          alt={post.imageAlt}
                          fill
                          className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,43,91,0.45) 0%, transparent 55%)",
                          }}
                          aria-hidden
                        />
                      </div>
                      <div className="pt-5 flex flex-col">
                        <p className="font-body text-[10px] font-bold tracking-[0.26em] uppercase text-tantrek-orange mb-3">
                          {post.categoryLabel ??
                            JOURNAL_CATEGORIES.find(
                              (c) => c.slug === post.category
                            )?.label ??
                            post.category}
                          {post.readTime && (
                            <span className="ml-2.5 text-tantrek-text-muted font-medium normal-case tracking-normal">
                              · {post.readTime}
                            </span>
                          )}
                        </p>
                        <h2 className="font-display text-xl lg:text-2xl text-tantrek-navy leading-snug font-semibold group-hover:text-tantrek-orange transition-colors duration-300">
                          {post.title}
                        </h2>
                        <p className="mt-3 text-tantrek-text-muted font-body text-[15px] leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-2 font-body text-[11px] font-bold tracking-[0.22em] uppercase text-tantrek-navy group-hover:gap-3 group-hover:text-tantrek-orange transition-all">
                          Read story <span aria-hidden>→</span>
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
              <p className="font-serif italic text-tantrek-navy-deep text-2xl mb-6">
                No stories in this category yet.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="inline-flex items-center gap-2 font-body text-tantrek-orange text-sm font-semibold tracking-wide hover:underline"
              >
                View all stories <span aria-hidden>→</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4 · Concierge CTA — matches sitewide framing
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="section-bg-frontier relative editorial-section-padding overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url(/tour8.webp)" }}
          aria-hidden
        />
        <div className="absolute inset-0 frontier-overlay" aria-hidden />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="editorial-eyebrow text-tantrek-orange mb-6 justify-center">
            From Reading to Journey
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-[1.12]">
            Want a story that fits{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              your journey?
            </span>
          </h2>
          <p className="mt-6 text-white/85 font-body text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Every Tantrek itinerary starts with a conversation. Tell us how
            you&rsquo;d like to travel — and a safari designer will reply
            within 24 hours.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/plan-your-safari"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-tantrek-orange px-9 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,122,0,0.4)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Speak with a Safari Designer
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
