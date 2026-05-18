import type { Metadata } from "next";
import Image from "next/image";
import { PlanYourSafariForm } from "./PlanYourSafariForm";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Plan Your Trip — TANTREK 360 Bespoke Itinerary",
  description:
    "Tell us your goals — travel, investment, or both. TANTREK 360 will design a 360° experience combining safari, culture, and Tanzania opportunity exposure.",
};

type PlanPageProps = {
  searchParams?: Promise<{ season?: string; email?: string }> | { season?: string; email?: string };
};

export default async function PlanYourSafariPage(props: PlanPageProps) {
  const raw = props.searchParams;
  const resolved = raw && typeof (raw as Promise<unknown>).then === "function"
    ? await (raw as Promise<{ season?: string; email?: string }>)
    : (raw as { season?: string; email?: string } | undefined) ?? {};
  const initialEmail = typeof resolved.email === "string" ? resolved.email : "";
  const initialSeason = typeof resolved.season === "string" ? resolved.season : "";

  return (
    <main className="relative flex min-h-screen flex-col bg-white pt-20">
      {/* Top navy banner */}
      <section className="relative overflow-hidden bg-tantrek-navy-deep">
        <div className="absolute inset-0 opacity-25">
          <Image src="/tour6.webp" alt="" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-hero-overlay" aria-hidden />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 50% 40% at 80% 25%, rgba(255,122,0,0.18), transparent 70%)" }}
          aria-hidden
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <p className="font-body text-tantrek-orange text-[11px] font-bold tracking-[0.36em] uppercase mb-4">
            Bespoke 360° Planning
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight max-w-3xl">
            Plan Your <span className="text-tantrek-orange">TANTREK Journey</span>
          </h1>
          <p className="mt-5 max-w-2xl text-white/85 text-base sm:text-lg leading-relaxed">
            Every TANTREK 360 journey is a blank canvas. Tell us your goals — travel, investment, or
            both — and we&apos;ll curate a programme that blends wilderness, culture, and real
            opportunity.
          </p>
        </div>
      </section>

      <div className="relative z-10 -mt-12 flex-1 py-6 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12 lg:items-start">
          {/* Left column: profile card + how-it-works */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            <div className="rounded-2xl border border-tantrek-border bg-white p-6 sm:p-8 shadow-card">
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-tantrek-orange/20">
                      <Image
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80"
                        alt="TANTREK 360 trip architect"
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-lg font-semibold text-tantrek-navy">
                      Your TANTREK Architect
                    </h2>
                    <p className="mt-0.5 font-body text-[10px] font-bold uppercase tracking-[0.22em] text-tantrek-orange">
                      360° Itinerary &amp; Opportunity Design
                    </p>
                  </div>
                </div>
                <p className="font-body text-sm leading-relaxed text-tantrek-text-muted">
                  Years of experience across Tanzania&apos;s parks, coast, and emerging sectors. We connect
                  you to the wilderness, the markets, and the partners that matter — with absolute
                  discretion and end-to-end care.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Tanzania-wide: Northern, Southern & Western circuits",
                    "Investment, real estate, tourism & SME exposure",
                    "English, Swahili & Spanish speaking",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-3 text-sm text-tantrek-text">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tantrek-orange/15 text-tantrek-orange">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-tantrek-border bg-tantrek-surface p-6 sm:p-8">
              <p className="font-body text-tantrek-orange text-[10px] font-bold tracking-[0.28em] uppercase mb-3">
                Response time
              </p>
              <p className="font-display text-tantrek-navy text-2xl font-semibold mb-2">24–48 hours</p>
              <p className="font-body text-tantrek-text-muted text-sm leading-relaxed">
                Our private inquiry response window. For anything more urgent, message us directly on{" "}
                <a href="https://wa.me/34637048615" target="_blank" rel="noopener noreferrer" className="text-tantrek-orange font-semibold hover:underline">
                  WhatsApp
                </a>
                {" "}or email{" "}
                <a href="mailto:info@tantrek360safaris.com" className="text-tantrek-orange font-semibold hover:underline break-all">
                  info@tantrek360safaris.com
                </a>
                .
              </p>
            </div>

            <div className="hidden lg:block">
              <Button href="/" variant="outline">
                ← Return Home
              </Button>
            </div>
          </div>

          {/* Right column: form */}
          <div className="lg:col-span-3 glassmorphism-panel rounded-2xl p-6 sm:p-8 lg:p-10">
            {initialSeason && (
              <p className="mb-4 font-body text-[10px] font-bold uppercase tracking-[0.22em] text-tantrek-orange">
                Preferred season:{" "}
                {initialSeason === "dry-jun-oct" && "Dry (Jun – Oct)"}
                {initialSeason === "green-dec-mar" && "Green (Dec – Mar)"}
                {initialSeason === "shoulder" && "Shoulder (Apr – May, Nov)"}
                {initialSeason === "flexible" && "Flexible"}
              </p>
            )}
            <PlanYourSafariForm inline initialEmail={initialEmail} initialSeason={initialSeason} />
          </div>
        </div>

        <div className="mt-8 flex justify-center lg:hidden">
          <Button href="/" variant="outline">
            ← Return Home
          </Button>
        </div>
      </div>
    </main>
  );
}
