"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  {
    label: "Destinations",
    children: [
      { href: "/destinations/northern", label: "Northern Circuit" },
      { href: "/destinations/southern", label: "Southern Circuit" },
      { href: "/destinations/western", label: "Western Circuit" },
    ],
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
              width={180}
              height={48}
              className="h-10 w-auto lg:h-12 object-contain object-left"
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
                    {openDropdown === item.label && item.children && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full left-0 pt-2 min-w-[200px]"
                      >
                        <div className="glass-card rounded-lg py-2 shadow-xl">
                          {item.children.map((child) => (
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
            <a
              href="https://wa.me/255762111315"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-safari-gold hover:underline"
            >
              WhatsApp
            </a>
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
              className="lg:hidden glass-card rounded-b-lg overflow-hidden"
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
                      {item.children?.map((child) => (
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
                <a
                  href="https://wa.me/255762111315"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-safari-gold"
                >
                  WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
