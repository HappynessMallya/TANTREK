import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { destinations, circuits } from "@/data/destinations";

export const metadata: Metadata = {
  title: "Our Sanctuaries — Destinations",
  description:
    "Venture into the heart of Tanzania's most pristine wilderness. Northern, Southern and Western circuits: Serengeti, Ngorongoro, Ruaha, Katavi and more.",
};

const STATS = [
  { label: "Conservation land", value: "2.5M", sub: "Acres" },
  { label: "Species protected", value: "1,200+" },
  { label: "Local employment", value: "95%" },
  { label: "Guest impact", value: "Gold Tier", accent: true },
];

function getTags(d: (typeof destinations)[0]): [string, string] {
  const circuitName = circuits[d.circuit].name.replace(" Circuit", "");
  const first = d.highlights[0]?.split("—")[0]?.trim() ?? d.highlights[0] ?? circuitName;
  const second = d.highlights[1]?.split("—")[0]?.trim() ?? d.highlights[1] ?? "Luxury camps";
  return [first.slice(0, 20), second.slice(0, 22)];
}

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80";

export default function DestinationsListingPage() {
  return (
    <main className="relative min-h-screen bg-safari-green-dark">
      {/* Subtle ambient background — soft gold glow for depth */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(196,169,103,0.12) 0%, transparent 55%)",
        }}
        aria-hidden
      />
      <div className="relative z-10">
        {/* Hero — full-width, edge to edge */}
        <section className="relative w-full overflow-hidden pt-20">
          <div className="relative h-[480px] w-full overflow-hidden sm:h-[520px] lg:h-[560px]">
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 hero-gradient-bottom" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10 lg:p-16">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-safari-gold-light mb-3">
                  Unrivaled excellence
                </p>
                <div className="mb-4 h-px w-16 bg-safari-gold/80" aria-hidden />
                <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl mb-6">
                  Our Sanctuaries
                </h1>
                <p className="max-w-2xl font-body text-lg font-light leading-relaxed text-safari-sand-light/95">
                  Venture into the heart of Tanzania&apos;s most pristine wilderness.
                  Each of our selected sanctuaries represents the pinnacle of
                  luxury conservation and raw, natural beauty.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          {/* Stats — refined glass, more breathing room */}
          <section className="mt-14 lg:mt-20">
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="destinations-glass-card flex flex-col justify-center gap-3 rounded-xl border-safari-gold/20 bg-safari-green/20 p-8 backdrop-blur-md lg:p-10"
                >
                  <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-safari-gold-light/90">
                    {stat.label}
                  </span>
                  <p
                    className={`font-display text-2xl font-bold tracking-tight lg:text-3xl ${
                      stat.accent ? "text-safari-gold-light" : "text-white"
                    }`}
                  >
                    {stat.value}
                    {stat.sub && (
                      <span className="ml-1 font-body text-sm font-normal text-safari-sand-muted">
                        {stat.sub}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section divider */}
          <div className="mt-16 lg:mt-20 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-safari-gold/30 to-transparent" />
            <span className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-safari-gold/70">
              Explore
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-safari-gold/30 to-transparent" />
          </div>

          {/* Destination grid — luxury cards with gold accent on hover */}
          <section className="mt-12 lg:mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10">
              {destinations.map((d) => {
                const [tag1, tag2] = getTags(d);
                return (
                  <Link
                    key={d.slug}
                    href={`/destinations/${d.slug}`}
                    className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/5 transition-all duration-500 hover:border-safari-gold/40 hover:shadow-[0_0_40px_rgba(196,169,103,0.12)]"
                  >
                    <Image
                      src={d.imageUrl}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-safari-green-dark/90 via-safari-green-dark/30 to-transparent transition-opacity duration-500 group-hover:from-safari-green-dark/85 group-hover:via-safari-green-dark/20" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                      <div className="translate-y-2 transition-all duration-500 group-hover:translate-y-0">
                        <h2 className="font-display text-2xl font-bold tracking-tight text-white mb-2 lg:text-3xl">
                          {d.name}
                        </h2>
                        <div className="h-0.5 w-14 bg-safari-gold mb-4 transition-all duration-500 group-hover:w-28 group-hover:bg-safari-gold-light" />
                        <p className="text-safari-sand-light/95 text-sm mb-6 opacity-0 max-w-sm transition-opacity duration-500 group-hover:opacity-100 leading-relaxed">
                          {d.tagline}
                        </p>
                        <div className="flex flex-wrap gap-2 opacity-0 transition-opacity duration-500 delay-75 group-hover:opacity-100">
                          <span className="inline-flex items-center gap-2 rounded-md border border-safari-gold/30 bg-black/50 px-3 py-1.5 font-body text-[10px] font-bold uppercase tracking-widest text-safari-gold-light/95 backdrop-blur-sm">
                            {tag1}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-md border border-safari-gold/30 bg-black/50 px-3 py-1.5 font-body text-[10px] font-bold uppercase tracking-widest text-safari-gold-light/95 backdrop-blur-sm">
                            {tag2}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Conservation banner — premium CTA */}
          <section className="mt-20 lg:mt-24">
            <div className="relative overflow-hidden rounded-2xl border border-safari-gold/15 bg-safari-green/30 p-12 text-center backdrop-blur-sm lg:p-16">
              <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-safari-gold/10 blur-3xl" />
              <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-safari-green/30 blur-3xl" />
              <span className="inline-block text-safari-gold mb-6" aria-hidden>
                <svg
                  className="mx-auto h-14 w-14"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white mb-5 lg:text-4xl">
                Travel with purpose
              </h2>
              <p className="mx-auto max-w-2xl font-body text-lg font-light leading-relaxed text-safari-sand-light/90 mb-10">
                Every booking directly supports conservation and community
                partnerships. Join us in preserving the wild majesty of
                Tanzania for generations to come.
              </p>
              <Link
                href="/sustainability"
                className="inline-flex items-center justify-center rounded-full border-2 border-safari-gold px-10 py-4 font-body text-sm font-bold uppercase tracking-widest text-safari-gold-light transition-all hover:bg-safari-gold hover:text-safari-green-dark hover:shadow-[0_0 30px_rgba(196,169,103,0.25)]"
              >
                Learn about our foundation
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
