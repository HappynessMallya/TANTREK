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
  const title = apiPost?.title ?? staticPost?.title ?? "TANTREK 360 Insights";
  const description = apiPost?.excerpt ?? staticPost?.excerpt ?? "";
  return { title, description };
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
  const categoryLabel = apiPost?.category?.label
    ?? JOURNAL_CATEGORIES.find((c) => c.slug === (apiPost?.category?.slug ?? staticPost?.category))?.label
    ?? staticPost?.category
    ?? "";
  const readTime = apiPost?.readTime ? `${apiPost.readTime} min read` : staticPost?.readTime;
  const publishedAt = apiPost?.publishedAt
    ? new Date(apiPost.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <article className="bg-white pb-24">
      {/* Hero — navy overlay over image */}
      <section className="relative w-full overflow-hidden pt-20 bg-tantrek-navy-deep">
        <div className="relative h-[360px] w-full overflow-hidden sm:h-[420px] lg:h-[500px]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-hero-overlay" aria-hidden />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 80% 25%, rgba(255,122,0,0.18), transparent 70%)",
            }}
            aria-hidden
          />
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
            <div className="mx-auto w-full max-w-4xl">
              <Link
                href="/safari-journal"
                className="inline-flex items-center gap-1.5 font-body text-tantrek-orange text-[11px] font-bold tracking-[0.28em] uppercase mb-5 hover:underline"
              >
                <span aria-hidden>←</span> Insights
              </Link>
              <div className="flex items-center gap-3 flex-wrap mb-3">
                {categoryLabel && (
                  <span className="inline-flex items-center rounded-full bg-tantrek-orange px-3 py-1 font-body text-[10px] font-bold tracking-wider uppercase text-white shadow-[0_6px_14px_rgba(255,122,0,0.3)]">
                    {categoryLabel}
                  </span>
                )}
                {readTime && (
                  <span className="font-body text-white/80 text-xs">{readTime}</span>
                )}
                {publishedAt && (
                  <span className="font-body text-white/60 text-xs">· {publishedAt}</span>
                )}
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl leading-tight">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Story content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="rounded-2xl overflow-hidden bg-white border border-tantrek-border shadow-elevated">
          <div className="p-7 sm:p-10 lg:p-12">
            {excerpt && (
              <p className="font-display text-lg sm:text-xl text-tantrek-navy leading-relaxed font-medium">
                {excerpt}
              </p>
            )}
            <div className="my-7 h-0.5 w-16 bg-tantrek-orange rounded-full" aria-hidden />
            <div className="font-body text-tantrek-text text-base sm:text-lg leading-relaxed space-y-5">
              {body
                ? body.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                : (
                  <p className="text-tantrek-text-muted">
                    Full story coming soon. In the meantime, explore our{" "}
                    <Link href="/destinations" className="text-tantrek-orange hover:underline font-semibold">
                      destinations
                    </Link>{" "}
                    or{" "}
                    <Link href="/plan-your-safari" className="text-tantrek-orange hover:underline font-semibold">
                      plan your trip
                    </Link>
                    .
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* End-of-article CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/safari-journal"
            className="inline-flex items-center gap-2 rounded-full border-2 border-tantrek-navy px-6 py-3 text-sm font-semibold text-tantrek-navy transition-all hover:bg-tantrek-navy hover:text-white"
          >
            <span aria-hidden>←</span> All Insights
          </Link>
          <Link
            href="/plan-your-safari"
            className="inline-flex items-center gap-2 rounded-full bg-tantrek-orange px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(255,122,0,0.28)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5"
          >
            Speak to an Expert
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
