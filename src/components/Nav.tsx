"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { circuits, getDestinationsByCircuit, destinations } from "@/data/destinations";
import { experiences } from "@/data/experiences";
import type { Circuit } from "@/data/destinations";
import { publicApi } from "@/lib/public-api";

// ─── Destinations data shaped for mega-menu ─────────────────────────────────
const circuitOrder: Circuit[] = ["northern", "southern", "western"];

const destinationNavGroups = circuitOrder.map((circuitKey) => {
  const circuit = circuits[circuitKey];
  const parks = getDestinationsByCircuit(circuitKey);
  return {
    circuitLabel: circuit.name,
    circuitHref: `/destinations/${circuit.slug}`,
    parks: parks.map((p) => ({
      label: p.name,
      href: `/destinations/${p.slug}`,
      image: p.imageUrl,
      tagline: p.tagline,
    })),
  };
});

const defaultDestinationPreview = {
  image:
    destinations[0]?.imageUrl ??
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
  label: "Tanzania",
  tagline: "From the Serengeti's plains to Katavi's wild frontier.",
};

// ─── Journeys (formerly "Services") shaped for mega-menu ───────────────────
const journeyItems = experiences.map((e) => ({
  label: e.name,
  href: `/experiences/${e.slug}`,
  image: e.imageUrl ?? "/tour1.webp",
  tagline: e.tagline,
  eyebrow: e.eyebrow,
}));

const defaultJourneyPreview = {
  image: journeyItems[0]?.image ?? "/tour1.webp",
  label: "Signature Journeys",
  tagline: "Four ways to travel Tantrek.",
};

// ─── Top-level nav structure ────────────────────────────────────────────────
type NavLinkItem =
  | { type: "link"; href: string; label: string }
  | { type: "destinations"; label: string }
  | { type: "journeys"; label: string };

const navLinks: NavLinkItem[] = [
  { type: "destinations", label: "Destinations" },
  { type: "journeys", label: "Journeys" },
  { type: "link", href: "/safari-journal", label: "Journal" },
  { type: "link", href: "/about", label: "About" },
  { type: "link", href: "/sustainability", label: "Impact" },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Hover-driven preview state for visual mega-menus
  const [destPreview, setDestPreview] = useState(defaultDestinationPreview);
  const [journeyPreview, setJourneyPreview] = useState(defaultJourneyPreview);

  // Mega-menu content — static `@/data` build is the fallback; CMS overrides.
  const [destGroups, setDestGroups] = useState(destinationNavGroups);
  const [journeys, setJourneys] = useState(journeyItems);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // CMS hydration for the Destinations + Journeys mega-menus.
  useEffect(() => {
    publicApi.getDestinations({ limit: 100 }).then((list) => {
      if (!list?.length) return;
      const order: Circuit[] = ["northern", "southern", "western"];
      const byCircuit = new Map<string, (typeof destinationNavGroups)[number]>();
      for (const d of list) {
        const cslug = d.circuit?.slug ?? "northern";
        const cname = d.circuit?.name ?? circuits[cslug as Circuit]?.name ?? "Tanzania";
        if (!byCircuit.has(cslug)) {
          byCircuit.set(cslug, {
            circuitLabel: cname,
            circuitHref: `/destinations/${cslug}`,
            parks: [],
          });
        }
        byCircuit.get(cslug)!.parks.push({
          label: d.name,
          href: `/destinations/${d.slug}`,
          image: d.heroImage?.url ?? defaultDestinationPreview.image,
          tagline: d.tagline ?? "",
        });
      }
      const groups = Array.from(byCircuit.values()).sort((a, b) => {
        const ai = order.indexOf(a.circuitHref.split("/").pop() as Circuit);
        const bi = order.indexOf(b.circuitHref.split("/").pop() as Circuit);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });
      if (groups.length) setDestGroups(groups);
    });

    publicApi.getExperiences({ limit: 100 }).then((list) => {
      if (!list?.length) return;
      setJourneys(
        list.map((e) => ({
          label: e.name ?? e.title ?? "",
          href: `/experiences/${e.slug}`,
          image: e.heroImage?.url ?? e.imageUrl ?? "/tour1.webp",
          tagline: e.tagline ?? "",
          eyebrow: e.eyebrow,
        }))
      );
    });
  }, []);

  // Reset previews when dropdowns close so the next open starts fresh
  useEffect(() => {
    if (openDropdown !== "Destinations") setDestPreview(defaultDestinationPreview);
    if (openDropdown !== "Journeys") setJourneyPreview(defaultJourneyPreview);
  }, [openDropdown]);

  const activeMap = useMemo(
    () => ({
      destinations: pathname.startsWith("/destinations"),
      journeys: pathname.startsWith("/experiences"),
    }),
    [pathname]
  );

  const isLinkActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled
          ? "shadow-[0_2px_18px_rgba(17,24,39,0.07)] border-b border-tantrek-border"
          : "border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-16 lg:h-20" : "h-20 lg:h-24"
          }`}
        >
          {/* Logo — subtly shrinks on scroll */}
          <Link href="/" className="flex items-center shrink-0" aria-label="TANTREK 360 Safaris — Home">
            <Image
              src="/logo.png"
              alt="TANTREK 360 Safaris"
              width={566}
              height={441}
              className={`w-auto object-contain object-left transition-all duration-300 ${
                scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"
              }`}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => {
              if (item.type === "link") {
                const active = isLinkActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-toplink font-body ${
                      active ? "text-tantrek-orange is-active" : "text-tantrek-text hover:text-tantrek-orange"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              // Mega-menus (Destinations + Journeys)
              const active =
                (item.type === "destinations" && activeMap.destinations) ||
                (item.type === "journeys" && activeMap.journeys);
              const isOpen = openDropdown === item.label;
              return (
                // self-stretch + flex makes this wrapper fill the full header
                // row height (instead of just sizing to the button text). That
                // way `top-full` on the dropdown anchors at the header's
                // bottom edge — not 20–30px above it, inside the header.
                <div
                  key={item.label}
                  className="relative self-stretch flex items-center"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    className={`nav-toplink font-body flex items-center gap-1 ${
                      isOpen || active
                        ? "text-tantrek-orange is-active"
                        : "text-tantrek-text hover:text-tantrek-orange"
                    }`}
                  >
                    {item.label}
                    <svg
                      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        // Centered on the trigger: the panel drops straight
                        // down from its word (trigger sits at the panel's
                        // horizontal centre) for a balanced, professional
                        // feel. The nav now lives in the right half of the
                        // header, so a 560–640px panel centred under either
                        // trigger clears the logo on the left. `top-full`
                        // keeps it flush with the header's bottom edge.
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`absolute top-full left-1/2 -translate-x-1/2 max-w-[calc(100vw-2rem)] ${
                          item.type === "destinations" ? "w-[720px]" : "w-[620px]"
                        }`}
                      >
                        <div className="nav-dropdown-panel p-6 lg:p-7">
                          {item.type === "destinations" ? (
                            <DestinationsMega
                              groups={destGroups}
                              preview={destPreview}
                              onHoverPark={setDestPreview}
                            />
                          ) : (
                            <JourneysMega
                              items={journeys}
                              preview={journeyPreview}
                              onHover={setJourneyPreview}
                            />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Concierge CTA */}
            <Link
              href="/plan-your-safari"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-tantrek-orange px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(255,122,0,0.28)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5"
            >
              Begin Your Journey
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-tantrek-navy"
            onClick={() => {
              setMobileOpen(!mobileOpen);
              if (mobileOpen) setMobileExpanded(null);
            }}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="lg:hidden overflow-hidden bg-white border-t border-tantrek-border"
            >
              <div className="py-4 space-y-1 px-2">
                {navLinks.map((item) => {
                  if (item.type === "link") {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3 text-tantrek-text hover:bg-tantrek-orange/10 hover:text-tantrek-orange rounded-lg transition-colors text-sm font-medium"
                      >
                        {item.label}
                      </Link>
                    );
                  }

                  const expanded = mobileExpanded === item.label;
                  return (
                    <div key={item.label} className="border-b border-tantrek-border/60 last:border-0">
                      <button
                        type="button"
                        onClick={() => setMobileExpanded(expanded ? null : item.label)}
                        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-tantrek-text hover:bg-tantrek-orange/10 rounded-lg transition-colors"
                        aria-expanded={expanded}
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                        <svg
                          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                            expanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-3 pt-1 space-y-1">
                              {item.type === "destinations" ? (
                                <>
                                  <Link
                                    href="/destinations"
                                    onClick={() => {
                                      setMobileOpen(false);
                                      setMobileExpanded(null);
                                    }}
                                    className="nav-dropdown-heading block py-2.5 px-3 my-1 rounded-lg font-semibold transition-colors text-sm"
                                  >
                                    All Destinations
                                  </Link>
                                  {destGroups.map((group) => (
                                    <div key={group.circuitHref} className="mt-2 pl-2">
                                      <Link
                                        href={group.circuitHref}
                                        onClick={() => {
                                          setMobileOpen(false);
                                          setMobileExpanded(null);
                                        }}
                                        className="nav-dropdown-heading inline-block py-2 px-3 my-1 rounded-lg font-semibold transition-colors text-sm"
                                      >
                                        {group.circuitLabel}
                                      </Link>
                                      <ul className="pl-2 space-y-1 text-sm">
                                        {group.parks.map((park) => (
                                          <li key={park.href}>
                                            <Link
                                              href={park.href}
                                              onClick={() => {
                                                setMobileOpen(false);
                                                setMobileExpanded(null);
                                              }}
                                              className="nav-dropdown-link block px-2 py-1.5 rounded"
                                            >
                                              {park.label}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <Link
                                    href="/experiences"
                                    onClick={() => {
                                      setMobileOpen(false);
                                      setMobileExpanded(null);
                                    }}
                                    className="nav-dropdown-heading block py-2.5 px-3 my-1 rounded-lg font-semibold transition-colors text-sm"
                                  >
                                    All Journeys
                                  </Link>
                                  <ul className="pl-2 space-y-1 text-sm">
                                    {journeys.map((j) => (
                                      <li key={j.href}>
                                        <Link
                                          href={j.href}
                                          onClick={() => {
                                            setMobileOpen(false);
                                            setMobileExpanded(null);
                                          }}
                                          className="nav-dropdown-link block px-2 py-1.5 rounded"
                                        >
                                          {j.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
                <Link
                  href="/plan-your-safari"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 mx-2 flex items-center justify-center gap-2 rounded-full bg-tantrek-orange px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(255,122,0,0.28)] transition-all hover:bg-tantrek-orange-deep"
                >
                  Begin Your Journey
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

// ─── DestinationsMega — three circuits + a visual preview pane ──────────────
type DestPreview = { image: string; label: string; tagline: string };

function DestinationsMega({
  groups,
  preview,
  onHoverPark,
}: {
  groups: typeof destinationNavGroups;
  preview: DestPreview;
  onHoverPark: (p: DestPreview) => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-7">
        <Link
          href="/destinations"
          className="nav-dropdown-heading mb-5 block px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors text-center"
        >
          All Tanzania Destinations
        </Link>
        <div className="grid grid-cols-3 gap-x-5 gap-y-4">
          {groups.map((group) => (
            <div key={group.circuitHref} className="min-w-0">
              <Link
                href={group.circuitHref}
                className="block font-display text-[11px] font-bold text-tantrek-navy uppercase tracking-[0.18em] pb-2 hover:text-tantrek-orange transition-colors"
              >
                {group.circuitLabel}
              </Link>
              <ul className="space-y-0.5">
                {group.parks.map((park) => (
                  <li key={park.href}>
                    <Link
                      href={park.href}
                      onMouseEnter={() =>
                        onHoverPark({
                          image: park.image,
                          label: park.label,
                          tagline: park.tagline,
                        })
                      }
                      className="nav-dropdown-link block px-2 py-1.5 rounded text-[13px] leading-snug"
                    >
                      {park.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-5">
        <div
          className="nav-preview-pane h-full"
          onMouseLeave={() => onHoverPark(defaultDestinationPreview)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={preview.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="nav-preview-image"
              style={{ backgroundImage: `url(${preview.image})` }}
            />
          </AnimatePresence>
          <div className="relative z-10 h-full flex flex-col justify-end p-5">
            <p className="font-body text-tantrek-orange text-[10px] font-bold tracking-[0.26em] uppercase mb-2">
              Featured
            </p>
            <p className="font-display text-white text-lg font-semibold leading-tight">
              {preview.label}
            </p>
            <p className="mt-1 text-white/85 text-xs leading-snug line-clamp-2">
              {preview.tagline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── JourneysMega — experiences with a visual preview pane ──────────────────
type JourneyPreview = { image: string; label: string; tagline: string };

function JourneysMega({
  items,
  preview,
  onHover,
}: {
  items: typeof journeyItems;
  preview: JourneyPreview;
  onHover: (p: JourneyPreview) => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-7">
        <Link
          href="/experiences"
          className="nav-dropdown-heading mb-5 block px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors text-center"
        >
          All Signature Journeys
        </Link>
        <ul className="space-y-1">
          {items.map((j) => (
            <li key={j.href}>
              <Link
                href={j.href}
                onMouseEnter={() =>
                  onHover({
                    image: j.image,
                    label: j.label,
                    tagline: j.tagline,
                  })
                }
                className="nav-dropdown-link group block px-3 py-2.5 rounded-lg"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    {j.eyebrow && (
                      <p className="font-body text-[10px] font-semibold tracking-[0.22em] uppercase text-tantrek-text-muted group-hover:text-tantrek-orange transition-colors">
                        {j.eyebrow}
                      </p>
                    )}
                    <p className="font-display text-[14px] font-semibold leading-snug mt-0.5">
                      {j.label}
                    </p>
                  </div>
                  <span
                    className="text-tantrek-text-soft group-hover:text-tantrek-orange transition-colors shrink-0"
                    aria-hidden
                  >
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-5">
        <div
          className="nav-preview-pane h-full"
          onMouseLeave={() => onHover(defaultJourneyPreview)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={preview.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="nav-preview-image"
              style={{ backgroundImage: `url(${preview.image})` }}
            />
          </AnimatePresence>
          <div className="relative z-10 h-full flex flex-col justify-end p-5">
            <p className="font-body text-tantrek-orange text-[10px] font-bold tracking-[0.26em] uppercase mb-2">
              Featured
            </p>
            <p className="font-display text-white text-lg font-semibold leading-tight">
              {preview.label}
            </p>
            <p className="mt-1 text-white/85 text-xs leading-snug line-clamp-2">
              {preview.tagline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
