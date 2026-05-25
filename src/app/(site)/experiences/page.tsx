import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { publicApi, type ExperienceItem } from "@/lib/public-api";

export const metadata: Metadata = {
  title: "Signature Journeys — TANTREK 360 Safaris",
  description:
    "Five signature ways to travel Tantrek — luxury fly-in safaris, honeymoon journeys, photographic expeditions, diaspora opportunity tours, and conservation safaris across Tanzania.",
};

type Journey = {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
};

// Static fallback — used if the CMS API is not yet configured / empty
const STATIC_JOURNEYS: Journey[] = [
  {
    eyebrow: "Ultra-Luxury Aviation",
    title: "Luxury Fly-in Safaris",
    description:
      "Light aircraft, remote airstrips, private guiding. From the Serengeti to Katavi without ever touching tarmac — designed for those who measure travel in hours of light, not hours on the road.",
    imageUrl: "/tour1.webp",
    imageAlt: "Luxury Fly-in Safari",
    href: "/experiences/luxury-fly-in",
  },
  {
    eyebrow: "For Two",
    title: "Honeymoon Safaris",
    description:
      "Private vehicles, bush dinners under starlight, and the silence of remote camps. We focus on Southern and Western Tanzania for true seclusion — and pair it with Zanzibar if you want sea air at the end.",
    imageUrl: "/tour2.webp",
    imageAlt: "Honeymoon safari in Tanzania",
    href: "/experiences/honeymoon",
  },
  {
    eyebrow: "For the Lens",
    title: "Photographic Expeditions",
    description:
      "Built around light, position, and patience. Photographer-friendly vehicles, guides who understand composition and behaviour, and low-density wilderness — so the shot finds you, not the crowd.",
    imageUrl: "/tour3.webp",
    imageAlt: "Photographic safari expedition",
    href: "/experiences/photographic",
  },
  {
    eyebrow: "Roots & Return",
    title: "Diaspora Opportunity Journeys",
    description:
      "For Tanzanians abroad and African diaspora ready to engage at home. Reconnect with the land. Meet the people. Explore the sectors — and the partners who could make the next chapter real.",
    imageUrl: "/tour4.webp",
    imageAlt: "Diaspora opportunity journey",
    href: "/experiences/conservation",
  },
  {
    eyebrow: "Exclusive & Unforgettable",
    title: "Corporate Incentives",
    description:
      "Off-site retreats and corporate familiarisation visits with a difference — wilderness, market briefings, partner introductions, and camp buyouts in one tightly produced programme.",
    imageUrl: "/tour5.webp",
    imageAlt: "Corporate incentive safari",
    href: "/experiences/corporate",
  },
];

function fromApi(items: ExperienceItem[]): Journey[] {
  return items.map((exp) => ({
    eyebrow: exp.eyebrow ?? "Signature Journey",
    title: exp.title ?? exp.name ?? "",
    description: exp.description ?? exp.tagline ?? "",
    imageUrl: exp.heroImage?.url ?? exp.imageUrl ?? "/tour1.webp",
    imageAlt: exp.heroImage?.altText ?? exp.title ?? exp.name ?? "",
    href: `/experiences/${exp.slug}`,
  }));
}

export default async function ExperiencesOverviewPage() {
  const apiExperiences = await publicApi.getExperiences();
  const journeys =
    apiExperiences && apiExperiences.length > 0
      ? fromApi(apiExperiences)
      : STATIC_JOURNEYS;

  // Split first item for the editorial feature treatment
  const [feature, ...rest] = journeys;

  return (
    <main className="bg-white">
      {/* ═══════════════════════════════════════════════════════════════════
          1 · Cinematic hero
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="/tour8.webp"
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
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6 lg:px-8">
          <p className="editorial-eyebrow text-tantrek-orange mb-5">
            Signature Journeys
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl max-w-4xl">
            Five ways to travel{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              Tantrek.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl font-body text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed">
            Each is a posture, not a package. We design the rest around the
            way you want to be in the wild.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2 · Feature journey — large editorial tile (first item)
          ═══════════════════════════════════════════════════════════════════ */}
      {feature && (
        <section className="bg-white editorial-section-padding">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href={feature.href}
              className="signature-feature group block h-full min-h-[520px]"
            >
              <div
                className="signature-image"
                style={{ backgroundImage: `url(${feature.imageUrl})` }}
                aria-hidden
              />
              <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-12 lg:p-16">
                <p className="font-body text-tantrek-orange text-[11px] font-semibold tracking-[0.30em] uppercase mb-4">
                  Featured · {feature.eyebrow}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight max-w-2xl">
                  {feature.title}
                </h2>
                <p className="mt-5 text-white/85 text-base lg:text-lg max-w-2xl leading-relaxed">
                  {feature.description}
                </p>
                <span className="mt-7 inline-flex items-center gap-2 text-white text-[11px] font-bold tracking-[0.24em] uppercase group-hover:gap-4 transition-all">
                  Discover the journey <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          3 · The rest — editorial 2-col grid, asymmetric image+text rows
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-tantrek-surface luxury-section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 lg:mb-16">
            <p className="editorial-eyebrow text-tantrek-orange mb-5">
              The Full Collection
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight">
              Other ways to{" "}
              <span className="font-serif italic font-normal text-tantrek-orange">
                shape your journey.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-7 gap-y-14">
            {rest.map((journey) => (
              <Link
                key={journey.href}
                href={journey.href}
                className="group block"
              >
                <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-tantrek-navy-deep">
                  <Image
                    src={journey.imageUrl}
                    alt={journey.imageAlt}
                    fill
                    className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tantrek-navy-deep/35 via-transparent to-transparent" aria-hidden />
                </div>
                <div className="pt-6">
                  <p className="font-body text-tantrek-orange text-[10px] font-bold tracking-[0.28em] uppercase mb-2.5">
                    {journey.eyebrow}
                  </p>
                  <h3 className="font-display text-2xl lg:text-3xl text-tantrek-navy font-semibold leading-tight group-hover:text-tantrek-orange transition-colors">
                    {journey.title}
                  </h3>
                  <p className="mt-3 text-tantrek-text-muted text-[15px] leading-relaxed">
                    {journey.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-body text-tantrek-navy text-[11px] font-bold tracking-[0.22em] uppercase group-hover:gap-3 group-hover:text-tantrek-orange transition-all">
                    Discover <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4 · Why Tantrek — editorial 2-column (replaces 3-card icon grid)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white luxury-section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
            <div className="lg:col-span-5">
              <p className="editorial-eyebrow text-tantrek-orange mb-6">
                Why Tantrek
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold leading-tight">
                Three quiet differences{" "}
                <span className="font-serif italic font-normal text-tantrek-orange">
                  that matter.
                </span>
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-9">
              {[
                {
                  number: "01",
                  title: "Safari + Opportunity",
                  body:
                    "Wilderness and real-world business exposure in one tightly curated programme — never bolted on. Through TANTREK 360, the same care extends quietly to investors, diaspora, and entrepreneurs.",
                },
                {
                  number: "02",
                  title: "Local Depth, Global Standards",
                  body:
                    "Tanzanian expertise on the ground; international standards in delivery, reporting, and follow-through. Owner-led, Tanzania-based — and never outsourced.",
                },
                {
                  number: "03",
                  title: "End-to-End Support",
                  body:
                    "From the first conversation to entity setup, compliance, and ongoing partnership — we stay engaged long after the trip is over.",
                },
              ].map((r) => (
                <div key={r.number} className="editorial-reason">
                  <span className="reason-number">{r.number}</span>
                  <h3 className="font-display text-lg lg:text-xl text-tantrek-navy font-semibold mb-2">
                    {r.title}
                  </h3>
                  <p className="text-tantrek-text-muted text-base leading-relaxed max-w-2xl">
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5 · Concierge CTA
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="section-bg-frontier relative editorial-section-padding overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url(/tour8.webp)" }}
          aria-hidden
        />
        <div className="absolute inset-0 frontier-overlay" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <p className="editorial-eyebrow text-tantrek-orange mb-6 justify-center">
            Begin Your Journey
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-[1.12]">
            Let&rsquo;s design{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              your version
            </span>{" "}
            of this.
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
              Or message on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
