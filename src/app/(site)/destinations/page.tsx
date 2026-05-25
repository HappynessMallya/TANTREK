import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { destinations, circuits, type Circuit } from "@/data/destinations";
import { publicApi, type DestinationItem } from "@/lib/public-api";

// Client-only — uses hover state + SVG interactivity that doesn't SSR cleanly
const InteractiveTanzaniaMap = dynamic(
  () =>
    import("@/components/InteractiveTanzaniaMap").then((m) => ({
      default: m.InteractiveTanzaniaMap,
    })),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Destinations — Tanzania, in 360°",
  description:
    "From the Serengeti's open plains to Ruaha's wild south and Katavi's untouched west. The Tantrek collection of Tanzania's most rewarding safari destinations.",
};

const CIRCUIT_ORDER: Circuit[] = ["northern", "southern", "western"];

const CIRCUIT_INTROS: Record<Circuit, { tagline: string; meta: string }> = {
  northern: {
    tagline: "Where the migration writes the calendar.",
    meta: "Serengeti · Ngorongoro · Tarangire · Lake Manyara",
  },
  southern: {
    tagline: "Vast, less travelled, quietly extraordinary.",
    meta: "Ruaha · Julius Nyerere (Selous)",
  },
  western: {
    tagline: "Africa's last true frontier.",
    meta: "Katavi · Mahale",
  },
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80";

type ListItem = {
  slug: string;
  name: string;
  tagline: string;
  circuit: Circuit;
  imageUrl: string;
};

function fromStatic(): ListItem[] {
  return destinations.map((d) => ({
    slug: d.slug,
    name: d.name,
    tagline: d.tagline,
    circuit: d.circuit,
    imageUrl: d.imageUrl,
  }));
}

function fromApi(apiList: DestinationItem[]): ListItem[] {
  return apiList.map((d) => ({
    slug: d.slug,
    name: d.name,
    tagline: d.tagline ?? "",
    circuit: (d.circuit?.slug as Circuit) ?? "northern",
    imageUrl:
      d.heroImage?.url ??
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=70",
  }));
}

export default async function DestinationsListingPage() {
  const apiDestinations = await publicApi.getDestinations();
  const items =
    apiDestinations && apiDestinations.length > 0
      ? fromApi(apiDestinations)
      : fromStatic();

  // Group by circuit
  const byCircuit = CIRCUIT_ORDER.map((c) => ({
    circuit: c,
    name: circuits[c].name,
    slug: circuits[c].slug,
    intro: CIRCUIT_INTROS[c],
    items: items.filter((i) => i.circuit === c),
  })).filter((g) => g.items.length > 0);

  return (
    <main className="bg-white">
      {/* ═══════════════════════════════════════════════════════════════════
          1 · Cinematic hero
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
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
            Tanzania, in 360°
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl max-w-4xl">
            Three circuits.{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              One Tanzania.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl font-body text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed">
            From the Serengeti&rsquo;s endless plains to Ruaha&rsquo;s wild
            south and Katavi&rsquo;s untouched west — every region carries
            its own rhythm, its own season, its own silence.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2 · Interactive discovery map — hover/click any park to explore
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-tantrek-navy-deep relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,122,0,0.12) 0%, transparent 60%)",
          }}
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-10 lg:mb-12">
            <div className="lg:col-span-7">
              <p className="editorial-eyebrow text-tantrek-orange mb-5">
                Discover by Place
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight">
                Choose your{" "}
                <span className="font-serif italic font-normal text-tantrek-orange">
                  patch of Tanzania.
                </span>
              </h2>
            </div>
            <p className="lg:col-span-5 text-white/75 text-base lg:text-lg leading-relaxed">
              Tap any park on the map to begin. Each is paired with a story,
              a season, and the camps we&rsquo;d send you to.
            </p>
          </div>

          <InteractiveTanzaniaMap />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3 · Each circuit — its own editorial group
          ═══════════════════════════════════════════════════════════════════ */}
      {byCircuit.map((group, gi) => (
        <section
          key={group.circuit}
          className={`${gi % 2 === 0 ? "bg-white" : "bg-tantrek-surface"} editorial-section-padding`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-12 lg:mb-14">
              <div className="lg:col-span-7">
                <p className="editorial-eyebrow text-tantrek-orange mb-5">
                  {group.name}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tantrek-navy font-bold leading-tight">
                  {group.intro.tagline.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className="font-serif italic font-normal text-tantrek-orange">
                    {group.intro.tagline.split(" ").slice(-2).join(" ")}
                  </span>
                </h2>
                <p className="mt-4 font-body text-[11px] tracking-[0.24em] uppercase text-tantrek-text-muted font-semibold">
                  {group.intro.meta}
                </p>
              </div>
              <div className="lg:col-span-5 flex lg:justify-end">
                <Link
                  href={`/destinations/${group.slug}`}
                  className="inline-flex items-center gap-2 font-body text-tantrek-navy text-sm font-semibold tracking-wide hover:text-tantrek-orange transition-colors"
                >
                  View {group.name.toLowerCase()} overview{" "}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
              {group.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/destinations/${item.slug}`}
                  className="editorial-destination group block h-full min-h-[360px]"
                  style={{
                    backgroundImage: `url(${item.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="relative z-10 h-full flex flex-col justify-end p-7">
                    <h3 className="font-display text-xl lg:text-2xl text-white font-semibold leading-tight">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-white/85 text-sm leading-relaxed line-clamp-2">
                      {item.tagline}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-white text-[11px] font-bold tracking-[0.22em] uppercase group-hover:gap-3 transition-all">
                      Discover <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ═══════════════════════════════════════════════════════════════════
          4 · Conservation invitation — quieter than before, navy section
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
            Travel With Purpose
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-[1.15]">
            Every Tantrek journey supports{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              the places it visits.
            </span>
          </h2>
          <p className="mt-6 text-white/85 font-body text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            A portion of every journey goes to community-led conservancies
            and the next generation of Tanzanian guides. Read about the
            partnerships that make this work.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/sustainability"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-tantrek-orange px-9 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,122,0,0.4)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5"
            >
              Our Impact
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/plan-your-safari"
              className="inline-flex items-center gap-2 font-body text-white/85 text-sm tracking-wide hover:text-tantrek-orange transition-colors"
            >
              Or begin a conversation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
