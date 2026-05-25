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

// Pull a trailing word like "Safaris", "Expeditions", "Incentives" out of
// the experience name so the hero can render it as a serif italic accent.
function splitNameForHero(name: string): { main: string; accent: string | null } {
  const suffixes = ["Safaris", "Safari", "Expeditions", "Expedition", "Incentives", "Tours", "Tour", "Journeys", "Journey"];
  for (const sfx of suffixes) {
    if (name.endsWith(` ${sfx}`)) {
      return { main: name.slice(0, -(sfx.length + 1)), accent: sfx };
    }
  }
  return { main: name, accent: null };
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
  const eyebrow = staticExp?.eyebrow ?? "Signature Journey";
  const tagline = apiExp?.tagline ?? staticExp?.tagline ?? "";
  const body = apiExp?.body ?? staticExp?.body ?? "";
  const highlights = apiExp?.highlights ?? staticExp?.highlights ?? [];
  const internalLinks = staticExp?.internalLinks ?? [];

  const { main: titleMain, accent: titleAccent } = splitNameForHero(expName);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          1 · Cinematic hero
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[78vh] min-h-[480px] w-full overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt=""
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
                "radial-gradient(ellipse 50% 40% at 78% 28%, rgba(255,122,0,0.15), transparent 70%)",
            }}
            aria-hidden
          />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 sm:px-6 lg:px-8">
          <p className="editorial-eyebrow text-tantrek-orange mb-5">{eyebrow}</p>
          <h1 className="font-display text-5xl font-bold leading-[1.04] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[88px] max-w-5xl">
            {titleMain}
            {titleAccent && (
              <>
                <br />
                <span className="font-serif italic font-normal text-tantrek-orange">
                  {titleAccent}
                </span>
              </>
            )}
          </h1>
          {tagline && (
            <p className="mt-6 max-w-2xl font-serif italic text-lg sm:text-xl lg:text-2xl text-white/90 leading-snug">
              {tagline}
            </p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2 · The experience — editorial 2-column body
          ═══════════════════════════════════════════════════════════════════ */}
      {body && (
        <section className="bg-white editorial-section-padding">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
              <div className="lg:col-span-5">
                <p className="editorial-eyebrow text-tantrek-orange mb-6">
                  The Journey
                </p>
                <h2 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold leading-tight">
                  How this{" "}
                  <span className="font-serif italic font-normal text-tantrek-orange">
                    journey feels.
                  </span>
                </h2>
              </div>
              <div className="lg:col-span-7 font-body text-tantrek-text-muted text-base lg:text-lg leading-relaxed">
                <p>{body}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          3 · What's included / highlights — editorial numbered list
          ═══════════════════════════════════════════════════════════════════ */}
      {highlights.length > 0 && (
        <section className="bg-tantrek-surface luxury-section-padding">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-10 lg:mb-14">
              <div className="lg:col-span-7">
                <p className="editorial-eyebrow text-tantrek-orange mb-5">
                  Inside the Journey
                </p>
                <h2 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold leading-tight">
                  What you&rsquo;ll find{" "}
                  <span className="font-serif italic font-normal text-tantrek-orange">
                    on this trip.
                  </span>
                </h2>
              </div>
              <p className="lg:col-span-5 text-tantrek-text-muted text-base leading-relaxed">
                Every detail is shaped privately — these are the cornerstones we
                build the rest of the itinerary around.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
              {highlights.map((h, i) => (
                <div key={h} className="editorial-reason">
                  <span className="reason-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-tantrek-navy text-lg font-medium leading-snug">
                    {h}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          4 · Explore — internal links as editorial chips
          ═══════════════════════════════════════════════════════════════════ */}
      {internalLinks.length > 0 && (
        <section className="bg-white border-t border-tantrek-border py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="editorial-eyebrow text-tantrek-orange mb-5">
              Pair With
            </p>
            <h3 className="font-display text-2xl sm:text-3xl text-tantrek-navy font-bold leading-tight mb-7 max-w-2xl">
              Destinations &amp; journeys that pair well.
            </h3>
            <ul className="flex flex-wrap gap-3">
              {internalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 rounded-full border border-tantrek-border bg-white px-5 py-2.5 text-tantrek-navy text-sm font-medium hover:bg-tantrek-navy hover:text-white hover:border-tantrek-navy transition-all"
                  >
                    {link.label}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          5 · Concierge CTA — navy, matches homepage / destinations
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="section-bg-frontier relative editorial-section-padding overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden
        />
        <div className="absolute inset-0 frontier-overlay" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <p className="editorial-eyebrow text-tantrek-orange mb-6 justify-center">
            Begin This Journey
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-[1.12]">
            Let&rsquo;s shape your{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              {titleMain}
            </span>{" "}
            experience.
          </h2>
          <p className="mt-6 text-white/85 font-body text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Every journey begins with a conversation. Tell us how you&rsquo;d
            like to travel — and a Tantrek safari designer will reply within
            24 hours.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/plan-your-safari"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-tantrek-orange px-9 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,122,0,0.4)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Speak with a Safari Designer
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="https://wa.me/34637048615"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-white/85 text-sm tracking-wide hover:text-tantrek-orange transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.683-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607z" />
              </svg>
              Or message on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6 · Back to all journeys
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-tantrek-border py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 font-body text-tantrek-navy text-sm font-semibold tracking-wide hover:text-tantrek-orange transition-colors"
          >
            <span aria-hidden>←</span> All signature journeys
          </Link>
        </div>
      </section>
    </>
  );
}
