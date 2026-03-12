import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperienceBySlug, experiences } from "@/data/experiences";
import { publicApi } from "@/lib/public-api";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return experiences.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [apiExp, staticExp] = await Promise.all([
    publicApi.getExperience(slug),
    Promise.resolve(getExperienceBySlug(slug)),
  ]);
  const name = apiExp?.title ?? apiExp?.name ?? staticExp?.name ?? "Experience";
  const description = apiExp?.description ?? staticExp?.metaDescription ?? "";
  return { title: name, description };
}

export default async function ExperiencePage({ params }: Props) {
  const { slug } = await params;
  const [apiExp, staticExp] = await Promise.all([
    publicApi.getExperience(slug),
    Promise.resolve(getExperienceBySlug(slug)),
  ]);

  if (!apiExp && !staticExp) notFound();

  // Merge: API data takes priority, static fills gaps
  const expName = apiExp?.title ?? apiExp?.name ?? staticExp?.name ?? "";
  const heroImage = apiExp?.heroImage?.url ?? apiExp?.imageUrl ?? staticExp?.imageUrl ?? DEFAULT_HERO_IMAGE;
  const eyebrow = staticExp?.eyebrow ?? "Curated Journey";
  const tagline = apiExp?.tagline ?? staticExp?.tagline ?? "";
  const body = apiExp?.body ?? staticExp?.body ?? "";
  const highlights = apiExp?.highlights ?? staticExp?.highlights ?? [];
  const cta = staticExp?.cta ?? "Plan your safari";
  const internalLinks = staticExp?.internalLinks ?? [];

  return (
    <>
      {/* Hero — same style as Curated Journeys */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-4 pt-24 text-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 z-10 bg-black/50" aria-hidden />
        </div>
        <div className="relative z-20 max-w-4xl space-y-5">
          <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-safari-gold-light">
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {expName}
          </h1>
          {tagline && (
            <p className="mx-auto max-w-2xl font-body text-lg font-light leading-relaxed text-safari-sand-light/95">
              {tagline}
            </p>
          )}
        </div>
      </section>

      {/* Main content — gold-gradient card style like Curated Journeys */}
      <section className="bg-safari-green-dark py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="group relative overflow-hidden rounded-xl bg-safari-green shadow-xl">
            <div className="flex min-h-0 flex-col lg:flex-row">
              <div className="relative z-10 flex flex-1 flex-col justify-center gold-gradient-overlay p-8 lg:p-16">
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl mb-6">
                  The experience
                </h2>
                {body && (
                  <p className="max-w-2xl font-body text-lg leading-relaxed text-safari-sand-light/95">
                    {body}
                  </p>
                )}
                <ul className="mt-8 space-y-4">
                  {highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 font-body text-safari-sand-light/90"
                    >
                      <span className="mt-1.5 shrink-0 text-safari-gold" aria-hidden>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    href="/plan-your-safari"
                    className="inline-flex items-center gap-3 rounded-full border border-safari-gold/50 bg-safari-gold/10 px-8 py-3 font-body font-bold text-safari-gold-light transition-all hover:bg-safari-gold hover:text-safari-green-dark"
                  >
                    {cta}
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                  <span className="font-body text-sm text-safari-sand-muted">
                    Or{" "}
                    <a
                      href="https://wa.me/255762111315"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-safari-gold hover:underline"
                    >
                      contact us on WhatsApp
                    </a>
                  </span>
                </div>
              </div>
              <div className="relative h-72 w-full shrink-0 lg:h-auto lg:w-[45%]">
                <Image
                  src={heroImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
            </div>
          </div>

          {/* Explore destinations */}
          <div className="mt-14 border-t border-white/10 pt-12">
            <p className="font-body text-xs font-bold uppercase tracking-wider text-safari-sand-muted">
              Explore destinations
            </p>
            <ul className="mt-4 flex flex-wrap gap-4">
              {internalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-safari-gold-light hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Back to Curated Journeys */}
      <section className="border-t border-white/10 bg-safari-green-dark py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-safari-gold-light hover:underline"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            All curated journeys
          </Link>
        </div>
      </section>
    </>
  );
}
