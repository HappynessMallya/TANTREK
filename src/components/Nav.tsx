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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/5 border-b border-white/10 backdrop-blur-md">
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
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-safari-gold-light"
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
                    className="flex items-center gap-1 text-sm font-medium text-safari-sand-light/90 hover:text-safari-gold-light transition-colors"
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
                        className={`absolute top-full left-0 pt-2 ${"isDestinations" in item && item.isDestinations ? "min-w-[520px]" : "w-max min-w-[200px]"}`}
                      >
                        <div className="rounded-lg py-3 px-3 shadow-xl max-h-[70vh] overflow-y-auto bg-safari-green-dark/98 border border-white/20 backdrop-blur-md">
                          {"isDestinations" in item && item.isDestinations
                            ? (
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                  {destinationNavGroups.map((group) => (
                                    <div key={group.circuitHref} className="min-w-0">
                                      <Link
                                        href={group.circuitHref}
                                        className="inline-block px-3 py-2 text-sm font-medium text-safari-gold-light bg-safari-green/90 hover:bg-safari-green rounded-md border border-white/15 transition-colors"
                                      >
                                        {group.circuitLabel}
                                      </Link>
                                      <p className="px-2 pb-1 text-xs font-bold text-safari-gold-light uppercase tracking-wider">
                                        Parks in this circuit
                                      </p>
                                      <ul className="list-disc list-inside px-2 pb-2 space-y-0.5 text-safari-sand-light/90 text-sm">
                                        {group.parks.map((park) => (
                                          <li key={park.href}>
                                            <Link
                                              href={park.href}
                                              className="hover:text-safari-gold-light hover:underline transition-colors"
                                            >
                                              {park.label}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              )
                            : "children" in item && item.children?.map((child: { href: string; label: string }) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="block px-4 py-2 text-sm text-safari-sand-light hover:bg-white/5 hover:text-safari-gold-light"
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
              className="lg:hidden rounded-b-lg overflow-hidden bg-safari-green-dark/98 border border-t-0 border-x border-b border-white/20 backdrop-blur-md"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((item) =>
                  "href" in item ? (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2 text-safari-sand-light hover:bg-white/5"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div key={item.label}>
                      <span className="flex items-center gap-2 px-4 py-2 text-safari-sand-muted text-sm font-medium">
                        {item.label}
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                      {"isDestinations" in item && item.isDestinations
                        ? destinationNavGroups.map((group) => (
                            <div key={group.circuitHref} className="mt-2 pl-8">
                              <Link
                                href={group.circuitHref}
                                onClick={() => setMobileOpen(false)}
                                className="inline-block py-2 px-3 my-1 text-safari-gold-light bg-safari-green/90 hover:bg-safari-green rounded-md border border-white/15 font-medium transition-colors"
                              >
                                {group.circuitLabel}
                              </Link>
                              <p className="text-xs font-bold text-safari-gold-light uppercase tracking-wider py-0.5">
                                Parks in this circuit
                              </p>
                              <ul className="list-disc list-inside space-y-0.5 text-safari-sand-light text-sm">
                                {group.parks.map((park) => (
                                  <li key={park.href}>
                                    <Link
                                      href={park.href}
                                      onClick={() => setMobileOpen(false)}
                                      className="hover:text-safari-gold-light hover:underline"
                                    >
                                      {park.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))
                        : "children" in item && item.children?.map((child: { href: string; label: string }) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="block pl-8 py-2 text-safari-sand-light hover:bg-white/5"
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
