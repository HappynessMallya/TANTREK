"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { JOURNAL_POSTS, JOURNAL_CATEGORIES } from "@/data/safariJournal";

export default function JournalPostPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const post = JOURNAL_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="font-display text-2xl text-white">Post not found</h1>
        <Link
          href="/safari-journal"
          className="mt-4 font-body text-luxury-gold text-sm uppercase tracking-wider hover:underline"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  const categoryLabel = JOURNAL_CATEGORIES.find((c) => c.slug === post.category)?.label ?? post.category;

  return (
    <article className="pb-20">
      {/* Hero — image + gradient like other pages */}
      <section className="relative w-full overflow-hidden pt-20">
        <div className="relative h-[320px] w-full overflow-hidden sm:h-[380px] lg:h-[420px]">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-safari-green-dark via-safari-green-dark/70 to-transparent pointer-events-none" aria-hidden />
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 sm:p-10 lg:p-16">
            <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
              <Link
                href="/safari-journal"
                className="inline-block font-body text-luxury-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-4 hover:underline"
              >
                ← Blog
              </Link>
              <span className="font-body text-luxury-gold/90 text-[10px] font-semibold tracking-wider uppercase">
                {categoryLabel}
              </span>
              {post.readTime && (
                <span className="ml-3 font-body text-safari-sand-light/80 text-xs">{post.readTime}</span>
              )}
              <h1 className="font-display text-3xl font-bold tracking-tight text-white mt-2 sm:text-4xl lg:text-5xl xl:text-6xl">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Story content — luxurious typography */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="rounded-xl overflow-hidden border border-white/10 bg-safari-green-dark/60 backdrop-blur-sm shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]">
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="font-display text-lg sm:text-xl text-safari-sand-light/95 leading-relaxed italic">
              {post.excerpt}
            </p>
            <div className="my-8 h-px w-20 bg-luxury-gold/50" aria-hidden />
            <div className="font-body text-safari-sand-light/90 text-base sm:text-lg leading-relaxed space-y-6 tracking-wide">
              <p>
                Full story coming soon. In the meantime, explore our{" "}
                <Link href="/destinations" className="text-luxury-gold hover:underline font-medium">
                  destinations
                </Link>{" "}
                or{" "}
                <Link href="/plan-your-safari" className="text-luxury-gold hover:underline font-medium">
                  plan your safari
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
