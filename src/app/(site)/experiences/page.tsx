import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { publicApi, type ExperienceItem } from "@/lib/public-api";

export const metadata: Metadata = {
  title: "Curated Safari Experiences",
  description:
    "Experience the untamed beauty of Tanzania through our bespoke luxury expeditions. Aerial safaris, cultural immersion, and conservation journeys.",
};

const STATIC_JOURNEYS = [
  {
    eyebrow: "Ultra-Luxury Aviation",
    title: "Aerial Safaris by Private Jet",
    description:
      "Soar above the Great Migration in unparalleled luxury. Witness the scale of nature's greatest spectacle from the comfort of a custom-fitted private jet, with direct transfers to the most remote luxury camps.",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=80",
    imageAlt: "Luxury aircraft over African savannah",
    href: "/experiences/luxury-fly-in",
    reverse: false,
  },
  {
    eyebrow: "Heritage & Wisdom",
    title: "Walking with the Maasai",
    description:
      "A profound cultural immersion. Traverse the ancient lands guided by the wisdom of Maasai warriors. Learn the art of tracking and the deep spiritual connection between the tribe and the wild.",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900&q=80",
    imageAlt: "Maasai warrior in the savannah",
    href: "/experiences/honeymoon",
    reverse: true,
  },
  {
    eyebrow: "Legacy & Impact",
    title: "Conservation Expeditions",
    description:
      "Join our field biologists on the front lines of wildlife protection. Participate in rhino tracking and elephant monitoring while staying in eco-exclusive camps dedicated to preserving the ecosystem.",
    imageUrl: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=900&q=80",
    imageAlt: "Rhino in the wild",
    href: "/experiences/conservation",
    reverse: false,
  },
];

function toJourneys(items: ExperienceItem[]) {
  return items.map((exp, idx) => ({
    eyebrow: exp.eyebrow ?? "",
    title: exp.title ?? exp.name ?? "",
    description: exp.description ?? exp.tagline ?? "",
    imageUrl: exp.heroImage?.url ?? exp.imageUrl ?? "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=900&q=80",
    imageAlt: exp.heroImage?.altText ?? exp.title ?? exp.name ?? "",
    href: `/experiences/${exp.slug}`,
    reverse: idx % 2 === 1,
  }));
}

export default async function ExperiencesOverviewPage() {
  const apiExperiences = await publicApi.getExperiences();
  const journeys = apiExperiences && apiExperiences.length > 0
    ? toJourneys(apiExperiences)
    : STATIC_JOURNEYS;

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[60vh] min-h-[420px] w-full flex-col items-center justify-center overflow-hidden px-4 pt-24 text-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80"
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
            The Pinnacle of Exploration
          </p>
          <h1 className="font-display text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Curated Journeys
          </h1>
          <p className="mx-auto max-w-2xl font-body text-lg font-light leading-relaxed text-safari-sand-light/95">
            Experience the untamed beauty of Tanzania through our bespoke luxury
            expeditions, where cinematic landscapes meet unparalleled comfort.
          </p>
        </div>
      </section>

      {/* Featured journey cards — alternating layout */}
      <section className="bg-safari-green-dark py-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
          {journeys.map((journey, idx) => (
            <div
              key={journey.href}
              className="group relative overflow-hidden rounded-xl bg-safari-green shadow-xl transition-all hover:shadow-safari-gold/10"
            >
              <div
                className={`flex min-h-[420px] flex-col md:flex-row ${
                  journey.reverse ? "md:flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`relative z-10 flex flex-1 flex-col justify-center p-8 lg:p-16 ${
                    journey.reverse ? "gold-gradient-overlay-reverse" : "gold-gradient-overlay"
                  }`}
                >
                  <p className="mb-4 font-body text-xs font-bold uppercase tracking-widest text-safari-gold-light">
                    {journey.eyebrow}
                  </p>
                  <h2 className="font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl xl:text-5xl mb-6">
                    {journey.title}
                  </h2>
                  <p className="mb-8 max-w-md font-body text-safari-sand-light/90 leading-relaxed">
                    {journey.description}
                  </p>
                  <Link
                    href={journey.href}
                    className="group/btn inline-flex w-fit items-center gap-3 rounded-full border border-safari-gold/50 bg-safari-gold/10 px-8 py-3 font-body font-bold text-safari-gold-light transition-all hover:bg-safari-gold hover:text-safari-green-dark"
                  >
                    Explore journey
                    <svg
                      className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
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
                </div>
                <div className="relative h-64 w-full md:h-auto md:min-h-[420px] md:w-1/2">
                  <Image
                    src={journey.imageUrl}
                    alt={journey.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Tanzanian Wildmakers */}
      <section className="bg-safari-green/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-white mb-12 sm:text-4xl">
            Why Tanzania Wildmakers?
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
            <div className="space-y-4">
              <span className="inline-flex h-12 w-12 items-center justify-center text-safari-gold" aria-hidden>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </span>
              <h3 className="font-display text-xl font-bold text-white">Unrivaled Access</h3>
              <p className="font-body text-safari-sand-light/80 leading-relaxed">
                Exclusive entry to private concessions and remote migration crossings away from the crowds.
              </p>
            </div>
            <div className="space-y-4">
              <span className="inline-flex h-12 w-12 items-center justify-center text-safari-gold" aria-hidden>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <h3 className="font-display text-xl font-bold text-white">Expert Guides</h3>
              <p className="font-body text-safari-sand-light/80 leading-relaxed">
                Led by silver and gold-level KPSGA certified guides with decades of wilderness experience.
              </p>
            </div>
            <div className="space-y-4">
              <span className="inline-flex h-12 w-12 items-center justify-center text-safari-gold" aria-hidden>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M5.636 2.636a.75.75 0 010 1.06L3.464 5.879 5.636 8.05a.75.75 0 11-1.06 1.06L2.404 5.879 4.576 3.697a.75.75 0 011.06 0zM12 3a.75.75 0 01.75-.75h7.5a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0V4.81l-6.97 6.97a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 011.06-1.06l1.97 1.97 6.44-6.44H12.75A.75.75 0 0112 3zm-8.818 8.818a.75.75 0 010 1.06l-2.121 2.121a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 111.06-1.06l.97.97 1.591-1.59a.75.75 0 011.06 0zm10.364 0a.75.75 0 010 1.06l-1.59 1.591-.97.97a.75.75 0 11-1.06-1.06l1.59-1.591 2.121-2.121a.75.75 0 011.06 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <h3 className="font-display text-xl font-bold text-white">Sustainable Luxury</h3>
              <p className="font-body text-safari-sand-light/80 leading-relaxed">
                Every journey contributes directly to conservation and community partnerships across Tanzania.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
