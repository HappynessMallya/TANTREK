import Link from "next/link";
import Image from "next/image";

const EXPLORE_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Our Sanctuaries", href: "/destinations" },
  { label: "The Safari", href: "/experiences" },
];

const COMPANY_LINKS = [
  { label: "Our Story", href: "/about" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Contact", href: "/plan-your-safari" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-luxury relative overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-14 px-4 sm:px-6 lg:px-8">
      {/* Subtle background image for depth — lodge */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.08] pointer-events-none"
        style={{ backgroundImage: "url(/lodgejpg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" aria-hidden />
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top: logo + tagline + socials | Explore + Company */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 lg:gap-16 mb-16 sm:mb-20">
          <div className="space-y-6 max-w-sm">
            <Link href="/" className="block" aria-label="Tanzania Wildmakers Safaris - Home">
              <Image
                src="/logo.png"
                alt="Tanzania Wildmakers Safaris"
                width={220}
                height={64}
                className="h-14 sm:h-16 w-auto object-contain object-left"
              />
            </Link>
            <p className="text-safari-sand-light/70 text-xs font-body font-light leading-relaxed tracking-wide uppercase">
              Redefining the boundaries of luxury and exploration. Conservation-driven safari in Southern & Western Tanzania.
            </p>
            <div className="flex gap-5 text-safari-sand-light/50">
              <a
                href="https://wa.me/255762111315"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-safari-gold transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a
                href="mailto:info@tanzaniawildmakersafari.com"
                className="hover:text-safari-gold transition-colors"
                aria-label="Email"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
            </div>
          </div>
          <nav className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-16" aria-label="Footer navigation">
            <div className="space-y-4">
              <h3 className="font-body text-white text-[10px] font-semibold uppercase tracking-[0.25em]">
                Explore
              </h3>
              <ul className="space-y-3 text-safari-sand-light/70 text-[11px] font-body uppercase tracking-widest">
                {EXPLORE_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-safari-gold transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-body text-white text-[10px] font-semibold uppercase tracking-[0.25em]">
                Company
              </h3>
              <ul className="space-y-3 text-safari-sand-light/70 text-[11px] font-body uppercase tracking-widest">
                {COMPANY_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-safari-gold transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom: copyright | stats */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-safari-gold/10 pt-10">
          <p className="text-[10px] font-body uppercase tracking-widest text-safari-sand-light/50 order-2 sm:order-1">
            © {year} Tanzania Wildmakers Safaris. All rights reserved.
          </p>
          <div className="flex gap-10 sm:gap-12 order-1 sm:order-2">
            <div className="text-center sm:text-right">
              <p className="font-display text-xl text-white">25+</p>
              <p className="text-safari-sand-light/50 text-[9px] font-body uppercase tracking-widest">Years</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="font-display text-xl text-white">100%</p>
              <p className="text-safari-sand-light/50 text-[9px] font-body uppercase tracking-widest">Private</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
