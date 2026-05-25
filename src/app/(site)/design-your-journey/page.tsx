import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JourneyBuilder } from "./JourneyBuilder";

export const metadata: Metadata = {
  title: "Sketch Your Journey — TANTREK 360",
  description:
    "Pick your length, your region, and your travel style. We'll sketch a starting draft of a Tanzania safari — then hand it to a real safari designer to refine.",
};

export default function DesignYourJourneyPage() {
  return (
    <main className="bg-white">
      {/* ═══════════════════════════════════════════════════════════════════
          1 · Editorial hero
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-tantrek-navy-deep pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0">
          <Image
            src="/tour6.webp"
            alt=""
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-hero-overlay" aria-hidden />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,122,0,0.18), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="editorial-eyebrow text-tantrek-orange mb-6 justify-center">
            Design Your Journey
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] text-white font-bold tracking-tight leading-[1.04]">
            Sketch first.{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              Talk second.
            </span>
          </h1>
          <p className="mt-7 text-white/85 text-base sm:text-lg lg:text-xl font-body leading-relaxed max-w-2xl mx-auto">
            Three quick choices — length, region, style — and we&rsquo;ll
            compose a starting draft. It&rsquo;s honest, transparent, and
            meant to start a conversation with a safari designer.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2 · The builder itself — dark canvas, full-bleed bg
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-tantrek-navy-deep relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,122,0,0.08) 0%, transparent 55%)",
          }}
          aria-hidden
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <JourneyBuilder />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3 · How this works — honest, sets expectations
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white luxury-section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
            <div className="lg:col-span-5">
              <p className="editorial-eyebrow text-tantrek-orange mb-6">
                How This Works
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold leading-tight">
                Honest about what this{" "}
                <span className="font-serif italic font-normal text-tantrek-orange">
                  is — and isn&rsquo;t.
                </span>
              </h2>
              <p className="mt-5 text-tantrek-text-muted text-base lg:text-lg leading-relaxed">
                This sketch is a transparent tool, not a quote. The real
                itinerary is shaped by a person — who knows the seasons, the
                camps&rsquo; current form, and the small details that make a
                journey yours.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-9">
              {[
                {
                  number: "01",
                  title: "Simple rules, not an algorithm",
                  body:
                    "One stop per roughly 3–4 nights of safari. The most iconic anchor in each region comes first. Mixed circuits cross-pair for contrast. That’s the whole composition logic — it’s meant to be predictable, not clever.",
                },
                {
                  number: "02",
                  title: "Camps are suggestions",
                  body:
                    "We surface the camps we know best in each park, but the right choice depends on dates, party size, and what your safari designer thinks pairs well. Treat the names as starting points, not final picks.",
                },
                {
                  number: "03",
                  title: "Real itineraries are humans",
                  body:
                    "What an automated sketch can’t do: read the seasons, judge a camp’s current form, weave a private moment into Day Six. That’s the work we do once you reach out.",
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
          4 · Quiet alternative — for people who don't want to use the tool
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-tantrek-surface border-t border-tantrek-border py-14 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-tantrek-navy font-bold leading-tight">
            Prefer to{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              just write to us?
            </span>
          </h2>
          <p className="mt-5 text-tantrek-text-muted text-base leading-relaxed max-w-xl mx-auto">
            The builder is one way in. If you&rsquo;d rather skip it and
            describe what you have in mind, we&rsquo;re right here.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/plan-your-safari"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-tantrek-navy px-7 py-3 text-sm font-semibold text-tantrek-navy hover:bg-tantrek-navy hover:text-white transition-all"
            >
              Go straight to the form
            </Link>
            <a
              href="https://wa.me/34637048615"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-tantrek-text-muted text-sm tracking-wide hover:text-tantrek-orange transition-colors"
            >
              Or message on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
