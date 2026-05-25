"use client";

/**
 * Interactive Tanzania map — the discovery surface for the /destinations page.
 *
 * Renders a stylized SVG outline of Tanzania with circuit zone fills and a
 * pulsing hotspot for every park in the destinations dataset. Hovering /
 * focusing a hotspot updates the side preview pane (image + tagline + link).
 * Clicking a hotspot navigates to the park slug page.
 *
 * Design notes:
 * - The outline is intentionally stylized, not cartographically precise. The
 *   goal is recognisable + editorial, not survey-accurate. Park positions are
 *   approximated by region; tighten them once we have a real basemap.
 * - On screens narrower than `lg`, the SVG renders as an overview only and
 *   the parks are listed as a stacked, tappable list below.
 */

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { destinations, circuits, type Circuit, type Destination } from "@/data/destinations";

// ─── Park positions on the stylised map ──────────────────────────────────────
// Coordinates are in the 600×620 viewBox. Approximated from real Tanzania
// geography — accurate enough to read as "Tanzania" but not a survey map.
type Coord = { x: number; y: number };

const PARK_COORDS: Record<string, Coord> = {
  // Northern circuit — clustered around the Great Rift escarpment
  "serengeti": { x: 245, y: 195 },
  "ngorongoro": { x: 300, y: 230 },
  "lake-manyara": { x: 325, y: 252 },
  "tarangire": { x: 348, y: 280 },
  // Southern circuit — central + southeast
  "ruaha": { x: 285, y: 380 },
  "julius-nyerere": { x: 420, y: 405 },
  // Western circuit — far west, Lake Tanganyika
  "katavi": { x: 150, y: 360 },
};

// Circuit zones — soft ellipses that subtly fill the region behind a cluster
const CIRCUIT_ZONES: Record<Circuit, { cx: number; cy: number; rx: number; ry: number }> = {
  northern: { cx: 310, cy: 235, rx: 110, ry: 75 },
  southern: { cx: 355, cy: 390, rx: 130, ry: 80 },
  western:  { cx: 150, cy: 360, rx: 60,  ry: 70 },
};

// Stylised Tanzania outline (smoothed approximation of country borders).
// Drawn manually in 600×620 viewBox to read as Tanzania at a glance.
const TANZANIA_OUTLINE_PATH = [
  "M 130 70",
  // Northern border (with Uganda, Kenya) — small dip for Lake Victoria
  "Q 175 55 230 60",
  "Q 280 50 330 65",  // Lake Victoria notch in NW
  "Q 380 55 440 60",
  "Q 495 65 530 90",
  // North-east corner
  "Q 560 115 565 160",
  // Eastern coast (Indian Ocean) — gentle convex curve
  "Q 575 220 568 280",
  "Q 562 340 552 395",
  "Q 540 450 515 490",
  // SE bulge (Mtwara) → southern border
  "Q 490 525 445 535",
  "Q 380 548 315 545",
  "Q 245 542 195 525",
  // SW corner (Lake Nyasa edge)
  "Q 150 510 115 478",
  // Western border (Lake Tanganyika) — gentle concave
  "Q 75 440 60 390",
  "Q 45 330 50 270",
  "Q 55 210 75 165",
  // Back up to NW corner
  "Q 95 120 130 70",
  "Z",
].join(" ");

// ─── Component ───────────────────────────────────────────────────────────────
type ParkWithCoord = Destination & { coord: Coord };

export function InteractiveTanzaniaMap() {
  // Build the list of parks that have a position on the map
  const parks: ParkWithCoord[] = useMemo(
    () =>
      destinations
        .filter((d) => PARK_COORDS[d.slug])
        .map((d) => ({ ...d, coord: PARK_COORDS[d.slug] })),
    []
  );

  // Default preview = first northern park (Serengeti) — the most iconic anchor
  const defaultPark = parks[0] ?? null;
  const [activeSlug, setActiveSlug] = useState<string | null>(defaultPark?.slug ?? null);

  const activePark = useMemo(
    () => parks.find((p) => p.slug === activeSlug) ?? defaultPark,
    [activeSlug, parks, defaultPark]
  );

  const activeCircuit = activePark?.circuit;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10">
      {/* ───────────────────── Map canvas ───────────────────── */}
      <div className="lg:col-span-7">
        <div className="interactive-map-canvas aspect-square sm:aspect-[6/5] lg:aspect-square relative">
          <svg
            viewBox="0 0 600 620"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            role="img"
            aria-label="Interactive map of Tanzania — click a park to discover it"
          >
            {/* Tanzania outline */}
            <path d={TANZANIA_OUTLINE_PATH} className="map-outline" />

            {/* Circuit zones (subtle fills) */}
            {(Object.keys(CIRCUIT_ZONES) as Circuit[]).map((c) => {
              const z = CIRCUIT_ZONES[c];
              return (
                <ellipse
                  key={c}
                  cx={z.cx}
                  cy={z.cy}
                  rx={z.rx}
                  ry={z.ry}
                  className={`map-zone ${activeCircuit === c ? "is-hovered" : ""}`}
                />
              );
            })}

            {/* Park hotspots */}
            {parks.map((p) => {
              const isActive = activeSlug === p.slug;
              return (
                <Link key={p.slug} href={`/destinations/${p.slug}`}>
                  <g
                    className={`map-hotspot ${isActive ? "is-active" : ""}`}
                    onMouseEnter={() => setActiveSlug(p.slug)}
                    onFocus={() => setActiveSlug(p.slug)}
                    tabIndex={0}
                    role="link"
                    aria-label={`Discover ${p.name}`}
                  >
                    {/* Generous invisible hit area for hover/tap forgiveness */}
                    <circle
                      cx={p.coord.x}
                      cy={p.coord.y}
                      r={28}
                      fill="transparent"
                    />
                    <circle
                      cx={p.coord.x}
                      cy={p.coord.y}
                      r={14}
                      className="map-hotspot-pulse"
                    />
                    <circle
                      cx={p.coord.x}
                      cy={p.coord.y}
                      r={7}
                      className="map-hotspot-dot"
                    />
                    <text
                      x={p.coord.x}
                      y={p.coord.y + 22}
                      className="map-hotspot-label"
                    >
                      {/* Trim trailing "National Park" / "Conservation Area" for the label */}
                      {p.name
                        .replace(/\s+National Park$/, "")
                        .replace(/\s+Conservation Area$/, "")}
                    </text>
                  </g>
                </Link>
              );
            })}
          </svg>

          {/* Caption strip — bottom-left of canvas */}
          <div className="absolute bottom-5 left-5 right-5 sm:right-auto z-10 flex items-center gap-3 text-white/65">
            <span className="block w-3 h-3 rounded-full bg-tantrek-orange shadow-[0_0_8px_rgba(255,122,0,0.8)]" aria-hidden />
            <p className="font-body text-[10px] tracking-[0.28em] uppercase">
              {parks.length} parks · 3 circuits · 1 Tanzania
            </p>
          </div>
        </div>

        {/* Mobile / narrow fallback — stacked tappable list below the map */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
          {parks.map((p) => (
            <Link
              key={p.slug}
              href={`/destinations/${p.slug}`}
              onMouseEnter={() => setActiveSlug(p.slug)}
              onFocus={() => setActiveSlug(p.slug)}
              className="map-mobile-list-item"
            >
              <span className="map-mobile-list-marker" aria-hidden />
              <span className="flex-1 min-w-0">
                <span className="block font-display text-sm text-white font-semibold leading-tight truncate">
                  {p.name.replace(/\s+National Park$/, "").replace(/\s+Conservation Area$/, "")}
                </span>
                <span className="block font-body text-[10px] tracking-[0.2em] uppercase text-tantrek-orange mt-0.5">
                  {circuits[p.circuit].name}
                </span>
              </span>
              <span className="text-white/40" aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ───────────────────── Preview pane ───────────────────── */}
      <aside className="lg:col-span-5 lg:sticky lg:top-28">
        <div className="map-preview-pane">
          <AnimatePresence mode="wait">
            {activePark && (
              <motion.div
                key={activePark.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <Link href={`/destinations/${activePark.slug}`} className="block">
                  <div className="map-preview-image">
                    <Image
                      src={activePark.imageUrl}
                      alt={activePark.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 40%, rgba(0, 18, 41, 0.65) 100%)",
                      }}
                      aria-hidden
                    />
                  </div>

                  <div className="p-6 lg:p-7">
                    <p className="font-body text-[10px] font-bold tracking-[0.28em] uppercase text-tantrek-orange mb-3">
                      {circuits[activePark.circuit].name}
                    </p>
                    <h3 className="font-display text-2xl lg:text-3xl text-white font-semibold leading-tight">
                      {activePark.name}
                    </h3>
                    <p className="mt-3 font-serif italic text-white/85 text-base lg:text-lg leading-snug">
                      &ldquo;{activePark.tagline}&rdquo;
                    </p>

                    {activePark.bestTime && (
                      <div className="mt-5 pt-5 border-t border-white/12 space-y-3 text-sm">
                        <div>
                          <p className="font-body text-[10px] tracking-[0.22em] uppercase text-white/55 font-semibold mb-1">
                            Best time
                          </p>
                          <p className="text-white/90 leading-snug">{activePark.bestTime}</p>
                        </div>
                      </div>
                    )}

                    <span className="mt-6 inline-flex items-center gap-2 font-body text-tantrek-orange text-[11px] font-bold tracking-[0.22em] uppercase">
                      Discover {activePark.name.split(" ")[0]} <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-4 text-center lg:text-left text-white/45 text-[11px] tracking-wide font-body hidden lg:block">
          Hover any park on the map · click to explore
        </p>
      </aside>
    </div>
  );
}
