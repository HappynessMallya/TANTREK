"use client";

/**
 * Journey Builder — interactive 3-step exploration tool.
 *
 * The visitor picks duration → region → style. We compose a transparent
 * day-by-day "sketch" from the destinations + experiences data and frame it
 * honestly as a starting point for a concierge conversation, not a quote.
 *
 * Composition rules (intentionally simple — humans do the real work):
 *   - 1 stop per ~3–4 nights of safari time
 *   - First park in a region is the most iconic anchor (Serengeti, Ruaha…)
 *   - Region "mixed" pairs across circuits for longer trips
 *   - Style is layered as a phrase on every stop ("all transfers by light
 *     aircraft", "photographer-friendly vehicles", etc.)
 *
 * The output's primary CTA hands off to /plan-your-safari with the sketch
 * URL-encoded into a `sketch` query param. The form prefills that text into
 * the "Your vision" notes field so the visitor doesn't retype anything.
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { destinations, type Destination, type Circuit } from "@/data/destinations";
import { experiences } from "@/data/experiences";

// ─── Builder option data ─────────────────────────────────────────────────────
type Duration = 5 | 7 | 10 | 14 | 21;
type RegionChoice = Circuit | "mixed";

const DURATION_OPTIONS: { value: Duration; label: string; helper: string }[] = [
  { value: 5, label: "5 days", helper: "A short, focused first taste" },
  { value: 7, label: "7 days", helper: "One region, two camps" },
  { value: 10, label: "10 days", helper: "The most-asked length" },
  { value: 14, label: "14 days", helper: "Multi-region, with breathing room" },
  { value: 21, label: "21+ days", helper: "Slow travel across Tanzania" },
];

const REGION_OPTIONS: {
  value: RegionChoice;
  label: string;
  blurb: string;
  image: string;
}[] = [
  {
    value: "northern",
    label: "Northern Circuit",
    blurb: "Serengeti plains, Ngorongoro crater, Tarangire's baobabs.",
    image:
      destinations.find((d) => d.slug === "serengeti")?.imageUrl ?? "/tour6.webp",
  },
  {
    value: "southern",
    label: "Southern Circuit",
    blurb: "Ruaha's wild south and the vastness of Julius Nyerere.",
    image:
      destinations.find((d) => d.slug === "ruaha")?.imageUrl ?? "/tour7.webp",
  },
  {
    value: "western",
    label: "Western Circuit",
    blurb: "Katavi — Africa's last true frontier, remote and unforgettable.",
    image:
      destinations.find((d) => d.slug === "katavi")?.imageUrl ?? "/wild.jpg",
  },
  {
    value: "mixed",
    label: "Mix it",
    blurb: "Pair circuits for contrast — iconic with remote, classic with quiet.",
    image:
      destinations.find((d) => d.slug === "ngorongoro")?.imageUrl ?? "/tour8.webp",
  },
];

const STYLE_OPTIONS = experiences.map((e) => ({
  slug: e.slug,
  label: e.name,
  blurb: e.tagline,
  image: e.imageUrl ?? "/tour1.webp",
}));

// One-line overlay per signature style — appended to every stop in the sketch
const STYLE_OVERLAY: Record<string, string> = {
  "luxury-fly-in": "All transfers by light aircraft — no road days.",
  "honeymoon": "Private vehicles and bush dinners under the stars.",
  "photographic": "Photographer-friendly vehicles and golden-hour positioning.",
  "conservation": "Time with community conservancies and conservation partners.",
  "corporate": "Dedicated vehicles, group dinners, and off-site flexibility.",
};

// Priority order — the most iconic anchor in each region comes first.
const REGION_PRIORITY: Record<Circuit, string[]> = {
  northern: ["serengeti", "ngorongoro", "tarangire", "lake-manyara"],
  southern: ["ruaha", "julius-nyerere"],
  western: ["katavi"],
};

// ─── Sketch composition ──────────────────────────────────────────────────────
type Stop = {
  startDay: number;
  endDay: number;
  destination: Destination;
};

function pickParks(region: RegionChoice, stopsNeeded: number): Destination[] {
  const pool = (slugs: string[]) =>
    slugs
      .map((s) => destinations.find((d) => d.slug === s))
      .filter((d): d is Destination => Boolean(d));

  if (region === "mixed") {
    // Round-robin across circuits — N, S, W, then second northern, etc.
    const n = pool(REGION_PRIORITY.northern);
    const s = pool(REGION_PRIORITY.southern);
    const w = pool(REGION_PRIORITY.western);
    const sequence: Destination[] = [];
    let ni = 0, si = 0, wi = 0;
    while (sequence.length < stopsNeeded && (ni < n.length || si < s.length || wi < w.length)) {
      if (ni < n.length) sequence.push(n[ni++]);
      if (sequence.length >= stopsNeeded) break;
      if (si < s.length) sequence.push(s[si++]);
      if (sequence.length >= stopsNeeded) break;
      if (wi < w.length) sequence.push(w[wi++]);
    }
    return sequence;
  }

  return pool(REGION_PRIORITY[region]).slice(0, stopsNeeded);
}

function composeSketch(duration: Duration, region: RegionChoice): Stop[] {
  // Roughly: 1 stop per 3–4 nights of safari. Subtract 1 day for arrival
  // travel time on trips of 7+ days.
  let stopsNeeded: number;
  if (duration <= 5) stopsNeeded = 1;
  else if (duration <= 7) stopsNeeded = 2;
  else if (duration <= 10) stopsNeeded = 2;
  else if (duration <= 14) stopsNeeded = 3;
  else stopsNeeded = 4;

  const parks = pickParks(region, stopsNeeded);
  if (parks.length === 0) return [];

  // Distribute days evenly across parks (with a sensible minimum)
  const nightsPerStop = Math.max(2, Math.floor(duration / parks.length));
  let day = 1;
  const stops: Stop[] = parks.map((d, i) => {
    const isLast = i === parks.length - 1;
    // Last stop absorbs any remainder so the total adds up to `duration`
    const stopNights = isLast ? duration - (day - 1) : nightsPerStop;
    const start = day;
    const end = Math.min(duration, day + stopNights - 1);
    day = end + 1;
    return { startDay: start, endDay: end, destination: d };
  });
  return stops;
}

// Render a copy-paste-friendly summary text of the sketch — handed off to
// the concierge form via URL query string.
function summariseSketch(args: {
  duration: Duration;
  region: RegionChoice;
  styleSlug: string | null;
  stops: Stop[];
}): string {
  const regionLabel =
    args.region === "mixed"
      ? "Mixed circuits"
      : REGION_OPTIONS.find((r) => r.value === args.region)?.label ?? args.region;
  const styleLabel = args.styleSlug
    ? STYLE_OPTIONS.find((s) => s.slug === args.styleSlug)?.label
    : null;

  const headerLine = `${args.duration}-day journey · ${regionLabel}${
    styleLabel ? ` · ${styleLabel}` : ""
  }`;

  const stopLines = args.stops.map((s) => {
    const dayRange =
      s.startDay === s.endDay ? `Day ${s.startDay}` : `Days ${s.startDay}–${s.endDay}`;
    const camp = s.destination.luxuryCamps[0]
      ? ` (${s.destination.luxuryCamps[0]} or similar)`
      : "";
    return `- ${dayRange}: ${s.destination.name}${camp}`;
  });

  const styleOverlay = args.styleSlug
    ? `\nStyle overlay: ${STYLE_OVERLAY[args.styleSlug] ?? ""}`
    : "";

  return [
    headerLine,
    "",
    "Sketched stops:",
    ...stopLines,
    styleOverlay,
    "",
    "(Generated from /design-your-journey — please refine with a safari designer.)",
  ]
    .filter((l) => l !== "" || true)
    .join("\n")
    .trim();
}

// ─── Component ───────────────────────────────────────────────────────────────
export function JourneyBuilder() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [duration, setDuration] = useState<Duration | null>(null);
  const [region, setRegion] = useState<RegionChoice | null>(null);
  const [styleSlug, setStyleSlug] = useState<string | null>(null);

  const stops = useMemo(() => {
    if (duration && region) return composeSketch(duration, region);
    return [];
  }, [duration, region]);

  const summary = useMemo(() => {
    if (duration && region) {
      return summariseSketch({ duration, region, styleSlug, stops });
    }
    return "";
  }, [duration, region, styleSlug, stops]);

  const handoffHref = useMemo(() => {
    if (!summary) return "/plan-your-safari";
    return `/plan-your-safari?sketch=${encodeURIComponent(summary)}`;
  }, [summary]);

  const reset = () => {
    setStep(0);
    setDuration(null);
    setRegion(null);
    setStyleSlug(null);
  };

  const goToStep = (n: 0 | 1 | 2 | 3) => setStep(n);

  return (
    <div className="space-y-12">
      {/* ───────────────────── Step indicator ───────────────────── */}
      <div className="flex items-center gap-3 sm:gap-4 max-w-2xl mx-auto">
        {[
          { n: 0, label: "Length" },
          { n: 1, label: "Where" },
          { n: 2, label: "Style" },
          { n: 3, label: "Sketch" },
        ].map((s, i, arr) => {
          const isActive = step === s.n;
          const isDone = step > s.n;
          return (
            <div key={s.n} className="flex items-center gap-3 sm:gap-4 flex-1 last:flex-initial">
              <button
                type="button"
                onClick={() => {
                  // Only allow jumping back, not forward (avoid invalid state)
                  if (s.n <= step) goToStep(s.n as 0 | 1 | 2 | 3);
                }}
                className="flex items-center gap-2"
                disabled={s.n > step}
              >
                <span
                  className={`builder-step-dot ${isActive ? "is-active" : ""} ${
                    isDone ? "is-done" : ""
                  }`}
                >
                  {isDone ? "✓" : s.n + 1}
                </span>
                <span
                  className={`hidden sm:inline font-body text-xs tracking-[0.16em] uppercase font-semibold ${
                    isActive || isDone ? "text-white" : "text-white/40"
                  }`}
                >
                  {s.label}
                </span>
              </button>
              {i < arr.length - 1 && (
                <span
                  className={`builder-step-connector ${isDone ? "is-done" : ""}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ───────────────────── Step content ───────────────────── */}
      <div className="min-h-[420px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="text-center max-w-2xl mx-auto mb-10">
                <p className="editorial-eyebrow text-tantrek-orange mb-5 justify-center">
                  Step One
                </p>
                <h2 className="font-display text-3xl sm:text-4xl text-white font-bold leading-tight">
                  How long do you have to{" "}
                  <span className="font-serif italic font-normal text-tantrek-orange">
                    travel?
                  </span>
                </h2>
                <p className="mt-4 text-white/70 text-base leading-relaxed">
                  Pick the length that fits your window. We can always adjust
                  later.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setDuration(opt.value);
                      setStep(1);
                    }}
                    className={`builder-chip flex-col text-center min-w-[140px] ${
                      duration === opt.value ? "is-selected" : ""
                    }`}
                  >
                    <span className="font-display text-lg font-semibold">
                      {opt.label}
                    </span>
                    <span className="text-[11px] font-normal opacity-70 mt-0.5">
                      {opt.helper}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="text-center max-w-2xl mx-auto mb-10">
                <p className="editorial-eyebrow text-tantrek-orange mb-5 justify-center">
                  Step Two
                </p>
                <h2 className="font-display text-3xl sm:text-4xl text-white font-bold leading-tight">
                  Which part of Tanzania{" "}
                  <span className="font-serif italic font-normal text-tantrek-orange">
                    pulls you?
                  </span>
                </h2>
                <p className="mt-4 text-white/70 text-base leading-relaxed">
                  Choose a single circuit, or mix for contrast.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
                {REGION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setRegion(opt.value);
                      setStep(2);
                    }}
                    className={`builder-card aspect-[5/6] ${
                      region === opt.value ? "is-selected" : ""
                    }`}
                  >
                    <div
                      className="builder-card-image"
                      style={{ backgroundImage: `url(${opt.image})` }}
                      aria-hidden
                    />
                    <div className="relative z-10 h-full flex flex-col justify-end p-5">
                      <h3 className="font-display text-lg text-white font-semibold leading-tight">
                        {opt.label}
                      </h3>
                      <p className="mt-1.5 text-white/80 text-xs leading-snug">
                        {opt.blurb}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="text-center max-w-2xl mx-auto mb-10">
                <p className="editorial-eyebrow text-tantrek-orange mb-5 justify-center">
                  Step Three
                </p>
                <h2 className="font-display text-3xl sm:text-4xl text-white font-bold leading-tight">
                  What kind of{" "}
                  <span className="font-serif italic font-normal text-tantrek-orange">
                    journey?
                  </span>
                </h2>
                <p className="mt-4 text-white/70 text-base leading-relaxed">
                  Pick a posture for the trip — optional.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.slug}
                    type="button"
                    onClick={() => {
                      setStyleSlug(opt.slug);
                      setStep(3);
                    }}
                    className={`builder-card aspect-[5/4] ${
                      styleSlug === opt.slug ? "is-selected" : ""
                    }`}
                  >
                    <div
                      className="builder-card-image"
                      style={{ backgroundImage: `url(${opt.image})` }}
                      aria-hidden
                    />
                    <div className="relative z-10 h-full flex flex-col justify-end p-5">
                      <h3 className="font-display text-base lg:text-lg text-white font-semibold leading-tight">
                        {opt.label}
                      </h3>
                      <p className="mt-1.5 text-white/80 text-xs leading-snug line-clamp-2">
                        {opt.blurb}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStyleSlug(null);
                    setStep(3);
                  }}
                  className="font-body text-white/55 text-sm hover:text-tantrek-orange transition-colors underline underline-offset-4 decoration-white/20"
                >
                  Skip — surprise me
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && duration && region && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                  <p className="editorial-eyebrow text-tantrek-orange mb-5 justify-center">
                    A Starting Sketch
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl text-white font-bold leading-tight">
                    Your{" "}
                    <span className="font-serif italic font-normal text-tantrek-orange">
                      {duration}-day
                    </span>{" "}
                    draft.
                  </h2>
                  <p className="mt-4 text-white/70 text-base leading-relaxed max-w-xl mx-auto">
                    Composed from your choices — meant as the beginning of a
                    conversation, not a finished itinerary.
                  </p>
                </div>

                {/* Choices summary chips */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  <SummaryChip
                    label={`${duration} days`}
                    onClick={() => goToStep(0)}
                  />
                  <SummaryChip
                    label={
                      REGION_OPTIONS.find((r) => r.value === region)?.label ??
                      ""
                    }
                    onClick={() => goToStep(1)}
                  />
                  {styleSlug && (
                    <SummaryChip
                      label={
                        STYLE_OPTIONS.find((s) => s.slug === styleSlug)
                          ?.label ?? ""
                      }
                      onClick={() => goToStep(2)}
                    />
                  )}
                </div>

                {/* Day-by-day rail */}
                <div className="builder-day-rail mb-10">
                  {stops.map((s) => {
                    const dayRange =
                      s.startDay === s.endDay
                        ? `Day ${s.startDay}`
                        : `Days ${s.startDay}–${s.endDay}`;
                    return (
                      <div key={s.destination.slug} className="builder-day-stop">
                        <p className="font-body text-[10px] tracking-[0.28em] uppercase text-tantrek-orange font-bold">
                          {dayRange}
                        </p>
                        <h3 className="mt-1.5 font-display text-xl lg:text-2xl text-white font-semibold leading-tight">
                          {s.destination.name}
                        </h3>
                        <p className="mt-2 font-serif italic text-white/80 text-base leading-snug">
                          {s.destination.tagline}
                        </p>
                        {s.destination.luxuryCamps.length > 0 && (
                          <p className="mt-3 text-white/65 text-sm">
                            <span className="text-white/45 text-[10px] tracking-[0.22em] uppercase mr-2 font-semibold">
                              Camp options
                            </span>
                            {s.destination.luxuryCamps.slice(0, 2).join(" · ")}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Style overlay reminder */}
                {styleSlug && STYLE_OVERLAY[styleSlug] && (
                  <div className="mb-10 p-5 rounded-xl bg-white/05 border border-white/12">
                    <p className="font-body text-[10px] tracking-[0.28em] uppercase text-tantrek-orange font-bold mb-2">
                      Style Overlay
                    </p>
                    <p className="text-white/85 text-sm leading-relaxed font-body">
                      {STYLE_OVERLAY[styleSlug]}
                    </p>
                  </div>
                )}

                {/* Honest disclaimer */}
                <p className="text-white/55 text-xs leading-relaxed text-center max-w-xl mx-auto mb-10 italic font-body">
                  This sketch is a transparent starting point — composed by
                  simple rules, not a quote. The real itinerary is shaped by a
                  safari designer who knows the seasons, the camps&rsquo;
                  current form, and the small details that make a journey
                  yours.
                </p>

                {/* Handoff CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                  <Link
                    href={handoffHref}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-tantrek-orange px-9 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,122,0,0.4)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5 w-full sm:w-auto"
                  >
                    Refine With a Safari Designer
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                  <button
                    type="button"
                    onClick={reset}
                    className="font-body text-white/70 text-sm tracking-wide hover:text-tantrek-orange transition-colors"
                  >
                    Start a new sketch
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Small editable chip used in the result-summary row
function SummaryChip({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-white/06 border border-white/15 px-4 py-1.5 text-white text-xs font-body hover:bg-white/10 hover:border-tantrek-orange/40 transition-colors"
    >
      {label}
      <span className="text-white/45 text-[10px]" aria-hidden>
        edit
      </span>
    </button>
  );
}
