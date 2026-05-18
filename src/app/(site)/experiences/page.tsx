import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { publicApi, type ExperienceItem } from "@/lib/public-api";

export const metadata: Metadata = {
  title: "TANTREK 360 Services — Safari & Opportunity Tours",
  description:
    "Curated journeys for investors, entrepreneurs, diaspora, and global professionals — combining Tanzania's wilderness with real access to its markets and opportunities.",
};

const STATIC_JOURNEYS = [
  {
    eyebrow: "Investment Safari Tours",
    title: "Wilderness Meets Opportunity",
    description:
      "Travel the iconic parks and see Tanzania's real economy alongside. Verified business sites, vetted partners, and structured exposure to tourism, real estate, and SME sectors — paired with the country's most considered safari experiences.",
    imageUrl: "/tour1.webp",
    imageAlt: "Investment Safari Tour",
    href: "/experiences/luxury-fly-in",
    reverse: false,
  },
  {
    eyebrow: "Cultural Immersion",
    title: "Beyond the Tourist Trail",
    description:
      "Live, learn, and listen. Spend time with communities, craftspeople, and elders — building genuine understanding of Tanzania's heritage. Each itinerary is curated with care, never staged, always meaningful.",
    imageUrl: "/tour2.webp",
    imageAlt: "Cultural immersion in Tanzania",
    href: "/experiences/honeymoon",
    reverse: true,
  },
  {
    eyebrow: "Bush & Beach Luxury",
    title: "Wild Tanzania to Zanzibar Sands",
    description:
      "The classic two-act journey, refined. Iconic parks paired with the calm of the Zanzibar coastline — premium camps, private lodges, and seamless logistics from first dusty airstrip to final sunset on the shore.",
    imageUrl: "/tour3.webp",
    imageAlt: "Bush and beach luxury safari",
    href: "/experiences/photographic",
    reverse: false,
  },
  {
    eyebrow: "Diaspora Opportunity Tours",
    title: "Reconnect. Reinvest. Build Roots.",
    description:
      "Designed for Tanzanians abroad and African diaspora ready to engage at home. Curated sector exposure, meaningful introductions, and ongoing facilitation — turning a homecoming into a long-term venture.",
    imageUrl: "/tour4.webp",
    imageAlt: "Diaspora opportunity tour",
    href: "/experiences/conservation",
    reverse: true,
  },
  {
    eyebrow: "Corporate Tours",
    title: "Team, Strategy, and Country",
    description:
      "Off-site leadership retreats and corporate familiarisation visits with a difference — wilderness, market briefings, and partner introductions in one tightly produced programme.",
    imageUrl: "/tour5.webp",
    imageAlt: "Corporate tours in Tanzania",
    href: "/experiences/corporate",
    reverse: false,
  },
];

function toJourneys(items: ExperienceItem[]) {
  return items.map((exp, idx) => ({
    eyebrow: exp.eyebrow ?? "",
    title: exp.title ?? exp.name ?? "",
    description: exp.description ?? exp.tagline ?? "",
    imageUrl: exp.heroImage?.url ?? exp.imageUrl ?? "/tour1.webp",
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
      {/* Hero — navy overlay */}
      <section className="relative flex h-[55vh] min-h-[400px] w-full flex-col items-center justify-center overflow-hidden px-4 pt-24 text-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/tour8.webp"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 z-10 bg-gradient-hero-overlay" aria-hidden />
          <div
            className="absolute inset-0 z-10"
            style={{ background: "radial-gradient(ellipse 50% 40% at 80% 25%, rgba(255,122,0,0.18), transparent 70%)" }}
            aria-hidden
          />
        </div>
        <div className="relative z-20 max-w-4xl space-y-5">
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.36em] text-tantrek-orange">
            Safari &amp; Opportunity Tours
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Our <span className="text-tantrek-orange">360° Services</span>
          </h1>
          <p className="mx-auto max-w-2xl font-body text-base sm:text-lg leading-relaxed text-white/90">
            Five curated paths into Tanzania — uniting wilderness, culture, business exposure, and
            long-term support under one trusted platform.
          </p>
        </div>
      </section>

      {/* Service rows */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-10 lg:space-y-14 px-4 sm:px-6 lg:px-8">
          {journeys.map((journey) => (
            <div
              key={journey.href}
              className="group relative overflow-hidden rounded-2xl bg-white border border-tantrek-border shadow-card transition-all hover:shadow-elevated hover:border-tantrek-orange/35"
            >
              <div
                className={`flex min-h-[400px] flex-col md:flex-row ${
                  journey.reverse ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="relative z-10 flex flex-1 flex-col justify-center p-8 lg:p-14">
                  <p className="mb-3 font-body text-[11px] font-bold uppercase tracking-[0.28em] text-tantrek-orange">
                    {journey.eyebrow}
                  </p>
                  <h2 className="font-display text-2xl font-bold text-tantrek-navy sm:text-3xl lg:text-4xl mb-5 leading-tight">
                    {journey.title}
                  </h2>
                  <p className="mb-7 max-w-md font-body text-tantrek-text-muted leading-relaxed">
                    {journey.description}
                  </p>
                  <Link
                    href={journey.href}
                    className="group/btn inline-flex w-fit items-center gap-2 rounded-full bg-tantrek-orange px-7 py-3 font-body font-semibold text-white text-sm shadow-[0_8px_20px_rgba(255,122,0,0.28)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5"
                  >
                    Explore service
                    <svg className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
                <div className="relative h-64 w-full md:h-auto md:min-h-[400px] md:w-1/2">
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

      {/* Why TANTREK 360 */}
      <section className="bg-tantrek-surface py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-tantrek-orange font-body font-bold tracking-[0.32em] text-[11px] uppercase mb-4">
            Why TANTREK 360
          </p>
          <div className="luxury-gold-line mx-auto mb-6" aria-hidden />
          <h2 className="font-display text-3xl font-bold text-tantrek-navy mb-12 sm:text-4xl">
            Three reasons clients <span className="text-tantrek-orange">stay with us</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-3">
            {[
              {
                title: "Safari + Opportunity",
                body: "Wilderness and real-world business exposure in one tightly curated programme — never bolted on.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5" /></svg>
                ),
              },
              {
                title: "Local Depth, Global Standards",
                body: "Tanzanian expertise on the ground; international standards in delivery, reporting, and follow-through.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth={1.7} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></svg>
                ),
              },
              {
                title: "End-to-End Support",
                body: "From the first conversation to entity setup, compliance, and ongoing partnership — we stay engaged.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12l2 2 4-4" /></svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="tantrek-card p-8 lg:p-10 text-left">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-tantrek-orange/10 text-tantrek-orange mb-5">
                  {item.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-tantrek-navy mb-2.5">{item.title}</h3>
                <p className="font-body text-tantrek-text-muted leading-relaxed text-sm">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
