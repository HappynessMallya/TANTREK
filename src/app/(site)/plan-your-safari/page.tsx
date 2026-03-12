import type { Metadata } from "next";
import Image from "next/image";
import { PlanYourSafariForm } from "./PlanYourSafariForm";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Plan Your Safari — Bespoke Itinerary Builder",
  description:
    "Tell us your dates, budget, and dreams. We'll craft a luxury safari itinerary for Southern and Western Tanzania. Smart form and WhatsApp quick contact.",
};

const PLAN_PAGE_BG =
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80";

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
    <main className="relative flex min-h-screen flex-col pt-20">
      {/* Full-bleed background image */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <Image
          src={PLAN_PAGE_BG}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-safari-green-dark/92"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-safari-green-dark/50 via-safari-green-dark/30 to-safari-green-dark/70"
          aria-hidden
        />
      </div>
      <div className="relative z-10 flex-1 py-12 px-4 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Left column: intro + profile card */}
          <div className="flex flex-col gap-8 pt-4 lg:pt-8">
            <div className="space-y-4">
              <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-safari-gold-light">
                Bespoke Excellence
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight text-safari-cream sm:text-5xl lg:text-6xl">
                Plan Your Private Safari
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-safari-sand-light/90 sm:text-lg">
                Every Wildmakers journey is a blank canvas. We curate every detail
                to align with your personal vision of the wild.
              </p>
            </div>

            {/* Profile / concierge card — classic, our palette */}
            <div className="rounded-xl border border-safari-gold/20 bg-safari-green/40 p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-6">
                <div className="shrink-0">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-safari-gold/50 sm:h-24 sm:w-24">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80"
                      alt="Your safari architect"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl font-bold text-safari-cream sm:text-2xl">
                    Your Safari Architect
                  </h2>
                  <p className="mt-0.5 font-body text-xs font-semibold uppercase tracking-widest text-safari-gold-light">
                    Bespoke Itinerary Design
                  </p>
                  <p className="mt-4 font-body text-sm italic leading-relaxed text-safari-sand-light/95 sm:text-base">
                    With years of experience across Southern and Western Tanzania,
                    we connect you with the heartbeat of the wild—from private
                    bush dinners to secluded migration crossings. Your journey is
                    handled with absolute discretion.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-3 text-sm text-safari-sand-light/90">
                      <span
                        className="text-safari-gold"
                        aria-hidden
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Expert knowledge: Ruaha, Julius Nyerere & Katavi
                    </li>
                    <li className="flex items-center gap-3 text-sm text-safari-sand-light/90">
                      <span
                        className="text-safari-gold"
                        aria-hidden
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      English & Swahili speaking
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <Button href="/" variant="outline">
                Return Home
              </Button>
            </div>
          </div>

          {/* Right column: glassmorphism form */}
          <div className="glassmorphism-panel rounded-xl p-6 shadow-2xl sm:p-8 lg:p-10">
            {initialSeason && (
              <p className="mb-4 font-body text-xs uppercase tracking-widest text-safari-gold-light/90">
                Preferred season from homepage:{" "}
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
            Return Home
          </Button>
        </div>
      </div>
    </main>
  );
}
