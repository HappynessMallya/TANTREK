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
  const title = apiPost?.title ?? staticPost?.title ?? "Safari Journal";
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
  const image = apiPost?.heroImage?.url ?? staticPost?.image ?? "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80";
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
    <article className="pb-20">
      {/* Hero — image + gradient */}
      <section className="relative w-full overflow-hidden pt-20">
        <div className="relative h-[320px] w-full overflow-hidden sm:h-[380px] lg:h-[460px]">
          <Image
            src={image}
            alt={imageAlt}
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
              <div className="flex items-center gap-3 flex-wrap">
                {categoryLabel && (
                  <span className="font-body text-luxury-gold/90 text-[10px] font-semibold tracking-wider uppercase">
                    {categoryLabel}
                  </span>
                )}
                {readTime && (
                  <span className="font-body text-safari-sand-light/80 text-xs">{readTime}</span>
                )}
                {publishedAt && (
                  <span className="font-body text-safari-sand-light/60 text-xs">{publishedAt}</span>
                )}
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white mt-2 sm:text-4xl lg:text-5xl xl:text-6xl">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Story content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="rounded-xl overflow-hidden border border-white/10 bg-safari-green-dark/60 backdrop-blur-sm shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]">
          <div className="p-8 sm:p-10 lg:p-12">
            {excerpt && (
              <p className="font-display text-lg sm:text-xl text-safari-sand-light/95 leading-relaxed italic">
                {excerpt}
              </p>
            )}
            <div className="my-8 h-px w-20 bg-luxury-gold/50" aria-hidden />
            <div className="font-body text-safari-sand-light/90 text-base sm:text-lg leading-relaxed space-y-6 tracking-wide">
              {body
                ? body.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                : (
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
                )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
