import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURNAL_POSTS, JOURNAL_CATEGORIES } from "@/data/safariJournal";
import { publicApi } from "@/lib/public-api";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return JOURNAL_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [apiPost, staticPost] = await Promise.all([
    publicApi.getJournalPost(slug),
    Promise.resolve(JOURNAL_POSTS.find((p) => p.slug === slug)),
  ]);
  const title = apiPost?.title ?? staticPost?.title ?? "The Tantrek Journal";
  const description = apiPost?.excerpt ?? staticPost?.excerpt ?? "";
  return { title, description };
}

// Find up to 3 related posts — prefer same category, fall back to other recent
function getRelated(currentSlug: string, currentCategory?: string) {
  const sameCategory = JOURNAL_POSTS.filter(
    (p) => p.slug !== currentSlug && p.category === currentCategory
  );
  const others = JOURNAL_POSTS.filter(
    (p) => p.slug !== currentSlug && p.category !== currentCategory
  );
  return [...sameCategory, ...others].slice(0, 3);
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const [apiPost, staticPost] = await Promise.all([
    publicApi.getJournalPost(slug),
    Promise.resolve(JOURNAL_POSTS.find((p) => p.slug === slug)),
  ]);

  if (!apiPost && !staticPost) notFound();

  const title = apiPost?.title ?? staticPost?.title ?? "";
  const excerpt = apiPost?.excerpt ?? staticPost?.excerpt ?? "";
  const body = apiPost?.body ?? null;
  const image = apiPost?.heroImage?.url ?? staticPost?.image ?? "/tour5.webp";
  const imageAlt = apiPost?.heroImage?.altText ?? staticPost?.imageAlt ?? title;
  const categorySlug = apiPost?.category?.slug ?? staticPost?.category;
  const categoryLabel =
    apiPost?.category?.label ??
    JOURNAL_CATEGORIES.find((c) => c.slug === categorySlug)?.label ??
    categorySlug ??
    "";
  const readTime = apiPost?.readTime
    ? `${apiPost.readTime} min read`
    : staticPost?.readTime;
  const author = apiPost?.author;
  const publishedAt = apiPost?.publishedAt
    ? new Date(apiPost.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const related = getRelated(slug, categorySlug);

  return (
    <article className="bg-white">
      {/* ═══════════════════════════════════════════════════════════════════
          1 · Article hero — editorial, not boxy
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-tantrek-navy-deep pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover opacity-35"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-hero-overlay" aria-hidden />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 78% 28%, rgba(255,122,0,0.15), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/safari-journal"
            className="inline-flex items-center gap-1.5 font-body text-tantrek-orange text-[11px] font-bold tracking-[0.28em] uppercase mb-7 hover:underline"
          >
            <span aria-hidden>←</span> The Journal
          </Link>
          <p className="editorial-eyebrow text-tantrek-orange mb-6">
            {categoryLabel}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] text-white font-bold tracking-tight leading-[1.06]">
            {title}
          </h1>
          {/* Meta row */}
          <div className="mt-7 flex items-center gap-4 text-white/70 text-xs sm:text-sm font-body">
            {author && <span className="font-semibold text-white/85">{author}</span>}
            {publishedAt && <span>{publishedAt}</span>}
            {readTime && <span>· {readTime}</span>}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2 · Featured image — full-bleed editorial inset
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(0,43,91,0.16)]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3 · Article body — editorial reading flow (no boxy card)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white pb-20 lg:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {excerpt && (
            <p className="font-serif italic text-2xl sm:text-3xl text-tantrek-navy-deep leading-snug mb-10 lg:mb-12">
              {excerpt}
            </p>
          )}
          <div className="h-px w-16 bg-tantrek-orange mb-10 lg:mb-12" aria-hidden />
          <div className="font-body text-tantrek-text text-base sm:text-lg leading-[1.75] space-y-6">
            {body ? (
              body.split("\n\n").map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p className="text-tantrek-text-muted">
                Full story coming soon. In the meantime, explore our{" "}
                <Link
                  href="/destinations"
                  className="text-tantrek-orange hover:underline font-semibold"
                >
                  destinations
                </Link>{" "}
                or{" "}
                <Link
                  href="/plan-your-safari"
                  className="text-tantrek-orange hover:underline font-semibold"
                >
                  begin a conversation
                </Link>
                .
              </p>
            )}
          </div>

          {/* Inline post-article action row */}
          <div className="mt-14 pt-10 border-t border-tantrek-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <Link
              href="/safari-journal"
              className="inline-flex items-center gap-2 font-body text-tantrek-navy text-sm font-semibold tracking-wide hover:text-tantrek-orange transition-colors"
            >
              <span aria-hidden>←</span> All journal stories
            </Link>
            <Link
              href="/plan-your-safari"
              className="inline-flex items-center gap-2 rounded-full bg-tantrek-orange px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,122,0,0.3)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5"
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

      {/* ═══════════════════════════════════════════════════════════════════
          4 · Related stories
          ═══════════════════════════════════════════════════════════════════ */}
      {related.length > 0 && (
        <section className="bg-tantrek-surface luxury-section-padding">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <p className="editorial-eyebrow text-tantrek-orange mb-5">
                  Continue Reading
                </p>
                <h2 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold leading-tight">
                  Other stories from{" "}
                  <span className="font-serif italic font-normal text-tantrek-orange">
                    the field.
                  </span>
                </h2>
              </div>
              <Link
                href="/safari-journal"
                className="inline-flex items-center gap-2 font-body text-tantrek-navy text-sm font-semibold tracking-wide hover:text-tantrek-orange transition-colors"
              >
                All journal stories <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-12">
              {related.map((post) => {
                const catLabel =
                  JOURNAL_CATEGORIES.find((c) => c.slug === post.category)?.label ??
                  post.category;
                return (
                  <Link
                    key={post.slug}
                    href={`/safari-journal/${post.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-tantrek-navy-deep">
                      <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="pt-5">
                      <p className="font-body text-[10px] font-bold tracking-[0.26em] uppercase text-tantrek-orange mb-3">
                        {catLabel}
                        {post.readTime && (
                          <span className="ml-2.5 text-tantrek-text-muted font-medium normal-case tracking-normal">
                            · {post.readTime}
                          </span>
                        )}
                      </p>
                      <h3 className="font-display text-xl text-tantrek-navy leading-snug font-semibold group-hover:text-tantrek-orange transition-colors">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-tantrek-text-muted text-[15px] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
