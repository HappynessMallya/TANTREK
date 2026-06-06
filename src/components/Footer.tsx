"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { publicApi, type FooterContent, type SiteSettings } from "@/lib/public-api";

// ─── Static defaults (current live content) ─────────────────────────────────
// These are the fallback: the footer renders identically to today until the
// CMS returns data, then API values override field-by-field.
const DEFAULT_FOOTER: Required<
  Pick<
    FooterContent,
    | "brandTagline"
    | "brandDescription"
    | "brandSubline"
    | "destinationSections"
    | "servicesLinks"
    | "companyLinks"
    | "newsletter"
    | "legalLinks"
  >
> & { getInTouch: NonNullable<FooterContent["getInTouch"]> } = {
  brandTagline: "A 360° integrated ecosystem of travel, business, and investment in Tanzania.",
  brandDescription:
    "Connecting investors, diaspora, entrepreneurs, and global professionals to Tanzania's wilderness — and its real opportunities.",
  brandSubline: "Tourism • Safaris • Investment",
  destinationSections: [
    {
      heading: "Northern Tanzania",
      links: [
        { label: "Serengeti", href: "/destinations/northern" },
        { label: "Ngorongoro", href: "/destinations/northern" },
        { label: "Tarangire", href: "/destinations/northern" },
        { label: "Lake Manyara", href: "/destinations/northern" },
      ],
    },
    {
      heading: "Southern Tanzania",
      links: [
        { label: "Julius Nyerere", href: "/destinations/southern" },
        { label: "Ruaha", href: "/destinations/southern" },
      ],
    },
    {
      heading: "Western Tanzania",
      links: [{ label: "Katavi", href: "/destinations/western" }],
    },
  ],
  servicesLinks: [
    { label: "Investment Safari Tours", href: "/experiences/luxury-fly-in" },
    { label: "Cultural Immersion", href: "/experiences/honeymoon" },
    { label: "Bush & Beach Luxury", href: "/experiences/photographic" },
    { label: "Diaspora Opportunity Tours", href: "/experiences/conservation" },
    { label: "Corporate Tours", href: "/experiences/corporate" },
  ],
  companyLinks: [
    { label: "About TANTREK 360", href: "/about" },
    { label: "Why Choose Us", href: "/about" },
    { label: "Our Impact", href: "/sustainability" },
    { label: "Speak to an Expert", href: "/plan-your-safari" },
    { label: "Insights", href: "/safari-journal" },
  ],
  getInTouch: {
    location: "Tanzania • Spain",
    whatsappLabel: "+34 637 04 86 15",
    whatsappUrl: "https://wa.me/34637048615",
    email: "info@tantrek360safaris.com",
    ctaLabel: "Speak to an Expert",
    ctaHref: "/plan-your-safari",
  },
  newsletter: {
    heading: "Stay informed",
    copy: "Tanzania investment insights and curated journeys delivered to your inbox.",
    placeholder: "Your email",
    buttonLabel: "Subscribe",
  },
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();
  const [data, setData] = useState(DEFAULT_FOOTER);

  // CMS hydration — override defaults with footer + settings when available.
  useEffect(() => {
    Promise.allSettled([publicApi.getFooter(), publicApi.getSettings()]).then(
      ([footerRes, settingsRes]) => {
        const footer =
          footerRes.status === "fulfilled" ? (footerRes.value as FooterContent | null) : null;
        const settings =
          settingsRes.status === "fulfilled" ? (settingsRes.value as SiteSettings | null) : null;
        if (!footer && !settings) return;

        setData((prev) => {
          const getInTouch = { ...prev.getInTouch, ...(footer?.getInTouch ?? {}) };
          // Settings contact info also feeds the "get in touch" block.
          if (settings?.contactEmail) getInTouch.email = settings.contactEmail;
          if (settings?.whatsappNumber) {
            const digits = settings.whatsappNumber.replace(/[^\d]/g, "");
            getInTouch.whatsappUrl = `https://wa.me/${digits}`;
            if (!footer?.getInTouch?.whatsappLabel) getInTouch.whatsappLabel = settings.whatsappNumber;
          }
          if (settings?.officeAddress) getInTouch.location = settings.officeAddress;

          return {
            brandTagline: footer?.brandTagline ?? prev.brandTagline,
            brandDescription: footer?.brandDescription ?? prev.brandDescription,
            brandSubline: footer?.brandSubline ?? prev.brandSubline,
            destinationSections: footer?.destinationSections?.length
              ? footer.destinationSections
              : prev.destinationSections,
            servicesLinks: footer?.servicesLinks?.length ? footer.servicesLinks : prev.servicesLinks,
            companyLinks: footer?.companyLinks?.length ? footer.companyLinks : prev.companyLinks,
            getInTouch,
            newsletter: { ...prev.newsletter, ...(footer?.newsletter ?? {}) },
            legalLinks: footer?.legalLinks?.length ? footer.legalLinks : prev.legalLinks,
          };
        });
      }
    );
  }, []);

  const t = data.getInTouch;

  return (
    <footer className="footer-luxury relative overflow-hidden pt-20 sm:pt-24 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16 mb-16 sm:mb-20">
          {/* Brand */}
          <div className="space-y-6 max-w-xs lg:max-w-sm">
            <Link
              href="/"
              className="block bg-white rounded-2xl px-5 py-4 w-fit shadow-[0_10px_28px_rgba(0,0,0,0.3)]"
              aria-label="TANTREK 360 Safaris - Home"
            >
              <Image
                src="/logo-footer.png"
                alt="TANTREK 360 Safaris"
                width={566}
                height={441}
                className="h-24 sm:h-28 w-auto object-contain"
              />
            </Link>
            <div className="space-y-3">
              <p className="text-white text-base font-display font-medium leading-snug">
                {data.brandTagline}
              </p>
              <p className="text-white/75 text-sm font-body leading-relaxed">
                {data.brandDescription}
              </p>
              <p className="text-white/55 text-xs font-body leading-relaxed pt-1">
                {data.brandSubline}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <a
                href={t.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-tantrek-orange hover:text-white"
                aria-label="WhatsApp TANTREK 360"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.683-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
              <a
                href={`mailto:${t.email}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-tantrek-orange hover:text-white"
                aria-label="Email TANTREK 360"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* 4 columns */}
          <nav className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 text-white" aria-label="Footer navigation">
            <div className="space-y-4">
              <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-tantrek-orange">
                Destinations
              </h3>
              <div className="space-y-3 text-[12px] font-body">
                {data.destinationSections.map((section) => (
                  <div key={section.heading} className="space-y-1.5">
                    <p className="font-semibold uppercase tracking-[0.16em] text-white/90 text-[10px]">
                      {section.heading}
                    </p>
                    <ul className="space-y-1 text-white/70">
                      {section.links.map(({ label, href }) => (
                        <li key={`${section.heading}-${label}`}>
                          <Link href={href} className="hover:text-tantrek-orange transition-colors">
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-tantrek-orange">
                Services
              </h3>
              <ul className="space-y-2 text-[12px] font-body text-white/75">
                {data.servicesLinks.map(({ label, href }) => (
                  <li key={href + label}>
                    <Link href={href} className="hover:text-tantrek-orange transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-tantrek-orange">
                Company
              </h3>
              <ul className="space-y-2 text-[12px] font-body text-white/75">
                {data.companyLinks.map(({ label, href }) => (
                  <li key={`${href}-${label}`}>
                    <Link href={href} className="hover:text-tantrek-orange transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-tantrek-orange">
                Get in touch
              </h3>
              <div className="space-y-2 text-[12px] font-body text-white/80">
                <p>{t.location}</p>
                <p>
                  WhatsApp:{" "}
                  <a href={t.whatsappUrl} className="hover:text-tantrek-orange transition-colors">
                    {t.whatsappLabel}
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a href={`mailto:${t.email}`} className="hover:text-tantrek-orange transition-colors break-all">
                    {t.email}
                  </a>
                </p>
                <Link
                  href={t.ctaHref ?? "/plan-your-safari"}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-tantrek-orange px-5 py-2.5 text-[11px] font-semibold tracking-wider uppercase text-white shadow-[0_8px_20px_rgba(255,122,0,0.32)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5"
                >
                  {t.ctaLabel}
                </Link>
              </div>
              <div className="pt-4 space-y-2">
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-tantrek-orange">
                  {data.newsletter.heading}
                </p>
                <p className="text-[12px] text-white/65 leading-relaxed">
                  {data.newsletter.copy}
                </p>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="mt-2 flex items-center gap-2"
                >
                  <input
                    type="email"
                    placeholder={data.newsletter.placeholder}
                    className="flex-1 rounded-full bg-white/10 border border-white/20 px-3 py-2 text-[12px] text-white placeholder:text-white/40 focus:outline-none focus:border-tantrek-orange"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-tantrek-orange text-white hover:bg-tantrek-orange-deep transition-colors"
                  >
                    {data.newsletter.buttonLabel}
                  </button>
                </form>
              </div>
            </div>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/60 text-[11px] font-body">
          <p>© {year} TANTREK 360 Safaris. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {data.legalLinks.map(({ label, href }, i) => (
              <span key={href} className="flex items-center gap-4">
                {i > 0 && <span className="w-px h-3 bg-white/20" aria-hidden />}
                <Link href={href} className="hover:text-tantrek-orange transition-colors">
                  {label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
