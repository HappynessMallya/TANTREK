"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { circuits, getDestinationsByCircuit } from "@/data/destinations";
import type { Circuit } from "@/data/destinations";

const circuitOrder: Circuit[] = ["northern", "southern", "western"];

const destinationNavGroups = circuitOrder.map((circuitKey) => {
  const circuit = circuits[circuitKey];
  const parks = getDestinationsByCircuit(circuitKey);
  return {
    circuitLabel: circuit.name,
    circuitHref: `/destinations/${circuit.slug}`,
    parks: parks.map((p) => ({ label: p.name, href: `/destinations/${p.slug}` })),
  };
});

type NavLinkItem =
  | { href: string; label: string }
  | { label: string; isDestinations: true }
  | { label: string; children: { href: string; label: string }[] };

const navLinks: NavLinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  {
    label: "Services",
    children: [
      { href: "/experiences", label: "All Services" },
      { href: "/experiences/luxury-fly-in", label: "Investment Safari Tours" },
      { href: "/experiences/honeymoon", label: "Cultural Immersion" },
      { href: "/experiences/photographic", label: "Bush & Beach Luxury" },
      { href: "/experiences/conservation", label: "Diaspora Opportunity Tours" },
      { href: "/experiences/corporate", label: "Corporate Tours" },
    ],
  },
  {
    label: "Destinations",
    isDestinations: true,
  },
  { href: "/sustainability", label: "Impact" },
  { href: "/safari-journal", label: "Insights" },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkBase =
    "text-[13px] font-medium tracking-wide transition-colors";
  const linkActive = "text-tantrek-orange";
  const linkInactive = "text-tantrek-text hover:text-tantrek-orange";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_16px_rgba(17,24,39,0.06)] border-b border-tantrek-border"
          : "bg-white/90 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="TANTREK 360 Safaris - Home">
            <Image
              src="/logo.png"
              alt="TANTREK 360 Safaris"
              width={260}
              height={72}
              className="h-11 w-auto lg:h-14 object-contain object-left"
              priority
            />
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((item) =>
              "href" in item ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${linkBase} ${pathname === item.href ? linkActive : linkInactive}`}
                >
                  {item.label}
                </Link>
              ) : (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    className={`flex items-center gap-1 ${linkBase} ${openDropdown === item.label ? linkActive : linkInactive}`}
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className={`absolute top-full left-0 pt-3 ${"isDestinations" in item && item.isDestinations ? "min-w-[580px]" : "w-max min-w-[260px]"}`}
                      >
                        <div className="nav-dropdown-panel py-4 px-4 max-h-[70vh] overflow-y-auto">
                          {"isDestinations" in item && item.isDestinations ? (
                            <div>
                              <Link
                                href="/destinations"
                                className="nav-dropdown-heading mb-4 block px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors text-center"
                              >
                                All Tanzania Destinations
                              </Link>
                              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                                {destinationNavGroups.map((group) => (
                                  <div key={group.circuitHref} className="min-w-0">
                                    <Link
                                      href={group.circuitHref}
                                      className="nav-dropdown-heading inline-block px-3 py-2 text-sm font-semibold rounded-lg transition-colors"
                                    >
                                      {group.circuitLabel}
                                    </Link>
                                    <p className="pt-2 pb-1.5 text-[10px] font-bold text-tantrek-orange uppercase tracking-wider">
                                      Parks in this circuit
                                    </p>
                                    <ul className="pl-2 pb-2 space-y-1 text-sm text-left">
                                      {group.parks.map((park) => (
                                        <li key={park.href} className="leading-snug">
                                          <Link
                                            href={park.href}
                                            className="nav-dropdown-link block px-2 py-1 rounded transition-colors"
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
                          ) : (
                            "children" in item &&
                            item.children?.map((child: { href: string; label: string }) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="nav-dropdown-link block px-4 py-2.5 text-sm rounded-lg transition-colors"
                              >
                                {child.label}
                              </Link>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            )}

            <Link
              href="/plan-your-safari"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-tantrek-orange px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(255,122,0,0.28)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5"
            >
              Plan Your Trip
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
              className="lg:hidden overflow-hidden bg-white border-t border-tantrek-border"
            >
              <div className="py-4 space-y-1 px-2">
                {navLinks.map((item) =>
                  "href" in item ? (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 text-tantrek-text hover:bg-tantrek-orange/10 hover:text-tantrek-orange rounded-lg transition-colors text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div key={item.label} className="border-b border-tantrek-border/60 last:border-0">
                      <button
                        type="button"
                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-tantrek-text hover:bg-tantrek-orange/10 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                        <svg
                          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${mobileExpanded === item.label ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-3 pt-1 space-y-1">
                              {"isDestinations" in item && item.isDestinations ? (
                                <>
                                  <Link
                                    href="/destinations"
                                    onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                                    className="nav-dropdown-heading block py-2.5 px-3 my-1 rounded-lg font-semibold transition-colors text-sm"
                                  >
                                    All Destinations
                                  </Link>
                                  {destinationNavGroups.map((group) => (
                                    <div key={group.circuitHref} className="mt-2 pl-2">
                                      <Link
                                        href={group.circuitHref}
                                        onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                                        className="nav-dropdown-heading inline-block py-2 px-3 my-1 rounded-lg font-semibold transition-colors text-sm"
                                      >
                                        {group.circuitLabel}
                                      </Link>
                                      <ul className="pl-2 space-y-1 text-sm">
                                        {group.parks.map((park) => (
                                          <li key={park.href}>
                                            <Link
                                              href={park.href}
                                              onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                                              className="nav-dropdown-link block px-2 py-1 rounded"
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
                                "children" in item &&
                                item.children?.map((child: { href: string; label: string }) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                                    className="nav-dropdown-link block py-2.5 px-2 rounded-lg text-sm"
                                  >
                                    {child.label}
                                  </Link>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                )}
                <Link
                  href="/plan-your-safari"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 mx-2 flex items-center justify-center gap-2 rounded-full bg-tantrek-orange px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(255,122,0,0.28)] transition-all hover:bg-tantrek-orange-deep"
                >
                  Plan Your Trip
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
