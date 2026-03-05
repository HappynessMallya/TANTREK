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
          Back to Safari Journal
        </Link>
      </div>
    );
  }

  const categoryLabel = JOURNAL_CATEGORIES.find((c) => c.slug === post.category)?.label ?? post.category;

  return (
    <article className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/safari-journal"
          className="inline-block font-body text-luxury-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-8 hover:underline"
        >
          ← Safari Journal
        </Link>
        <header className="mb-10">
          <span className="font-body text-luxury-gold text-[10px] font-semibold tracking-wider uppercase">
            {categoryLabel}
          </span>
          {post.readTime && (
            <span className="ml-3 font-body text-safari-sand-light/70 text-xs">{post.readTime}</span>
          )}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mt-4 leading-tight">
            {post.title}
          </h1>
        </header>
        <div className="relative aspect-video rounded-[10px] overflow-hidden mb-12">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
            priority
          />
        </div>
        <div className="font-body text-safari-sand-light/90 leading-relaxed space-y-6">
          <p className="text-lg">{post.excerpt}</p>
          <p className="text-sm text-safari-sand-light/70">
            Full story coming soon. In the meantime, explore our{" "}
            <Link href="/destinations" className="text-luxury-gold hover:underline">
              destinations
            </Link>{" "}
            or{" "}
            <Link href="/plan-your-safari" className="text-luxury-gold hover:underline">
              plan your safari
            </Link>
            .
          </p>
        </div>
      </div>
    </article>
  );
}
