"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
    label: "Destinations",
    isDestinations: true,
  },
  {
    label: "Experiences",
    children: [
      { href: "/experiences", label: "Curated Journeys" },
      { href: "/experiences/luxury-fly-in", label: "Luxury Fly-in" },
      { href: "/experiences/honeymoon", label: "Honeymoon" },
      { href: "/experiences/photographic", label: "Photographic" },
      { href: "/experiences/conservation", label: "Conservation" },
      { href: "/experiences/corporate", label: "Corporate" },
    ],
  },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/plan-your-safari", label: "Plan Your Safari" },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-safari-green-dark/90 border-b border-luxury-gold/10 backdrop-blur-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Tanzania Wildmakers Safaris - Home">
            <Image
              src="/logo.png"
              alt="Tanzania Wildmakers Safaris"
              width={260}
              height={72}
              className="h-14 w-auto lg:h-16 object-contain object-left"
              priority
            />
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) =>
              "href" in item ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium tracking-[0.16em] uppercase pb-1 border-b border-transparent transition-colors ${
                      pathname === item.href
                        ? "text-safari-gold-light border-luxury-gold"
                        : "text-safari-sand-light/90 hover:text-safari-gold-light"
                    }`}
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
                    className={`flex items-center gap-1 text-sm font-medium tracking-[0.16em] uppercase pb-1 border-b transition-colors ${
                      openDropdown === item.label
                        ? "text-safari-gold-light border-luxury-gold"
                        : "text-safari-sand-light/90 border-transparent hover:text-safari-gold-light"
                    }`}
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
                        className={`absolute top-full left-0 pt-2 ${"isDestinations" in item && item.isDestinations ? "min-w-[560px]" : "w-max min-w-[220px]"}`}
                      >
                        <div className="nav-dropdown-panel py-4 px-4 max-h-[70vh] overflow-y-auto rounded-xl">
                          {"isDestinations" in item && item.isDestinations
                            ? (
                                <div>
                                  <Link
                                    href="/destinations"
                                    className="nav-dropdown-heading mb-4 block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-center"
                                  >
                                    Our Sanctuaries
                                  </Link>
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                                  {destinationNavGroups.map((group) => (
                                    <div key={group.circuitHref} className="min-w-0">
                                      <Link
                                        href={group.circuitHref}
                                        className="nav-dropdown-heading inline-block px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                                      >
                                        {group.circuitLabel}
                                      </Link>
                                      <p className="pt-2 pb-1.5 text-[10px] font-bold text-luxury-gold/90 uppercase tracking-wider">
                                        Parks in this circuit
                                      </p>
                                      <ul className="list-disc list-outside pl-5 pr-0 pb-2 space-y-1 text-sm text-left">
                                        {group.parks.map((park) => (
                                          <li key={park.href} className="leading-snug">
                                            <Link
                                              href={park.href}
                                              className="nav-dropdown-link inline py-0.5 rounded hover:underline transition-colors"
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
                              )
                            : "children" in item && item.children?.map((child: { href: string; label: string }) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="nav-dropdown-link block px-4 py-2.5 text-sm rounded-lg transition-colors"
                                >
                                  {child.label}
                                </Link>
                              ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-safari-sand-light"
            onClick={() => setMobileOpen(!mobileOpen)}
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
              className="lg:hidden rounded-b-xl overflow-hidden bg-[#0b2520] border border-t-0 border-x border-b border-luxury-gold/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="py-4 space-y-1 px-2">
                {navLinks.map((item) =>
                  "href" in item ? (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 text-[#e8ddc8] hover:bg-luxury-gold/10 rounded-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div key={item.label}>
                      <span className="flex items-center gap-2 px-4 py-2 text-luxury-gold/90 text-sm font-medium uppercase tracking-wider">
                        {item.label}
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                      {"isDestinations" in item && item.isDestinations
                        ? (
                            <>
                              <Link
                                href="/destinations"
                                onClick={() => setMobileOpen(false)}
                                className="nav-dropdown-heading mt-2 inline-block py-2.5 px-4 my-1 rounded-lg font-medium transition-colors"
                              >
                                Our Sanctuaries
                              </Link>
                              {destinationNavGroups.map((group) => (
                            <div key={group.circuitHref} className="mt-2 pl-6">
                              <Link
                                href={group.circuitHref}
                                onClick={() => setMobileOpen(false)}
                                className="nav-dropdown-heading inline-block py-2 px-3 my-1 rounded-lg font-medium transition-colors"
                              >
                                {group.circuitLabel}
                              </Link>
                              <p className="text-[10px] font-bold text-luxury-gold/90 uppercase tracking-wider py-1">
                                Parks in this circuit
                              </p>
                              <ul className="list-disc list-outside pl-5 space-y-1 text-sm">
                                {group.parks.map((park) => (
                                  <li key={park.href} className="leading-snug">
                                    <Link
                                      href={park.href}
                                      onClick={() => setMobileOpen(false)}
                                      className="nav-dropdown-link inline py-0.5 rounded hover:underline"
                                    >
                                      {park.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                            </>
                          )
                        : "children" in item && item.children?.map((child: { href: string; label: string }) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="nav-dropdown-link block pl-8 py-2.5 rounded-lg"
                            >
                              {child.label}
                            </Link>
                          ))}
                    </div>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
