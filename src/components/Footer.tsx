import Link from "next/link";
import Image from "next/image";

const destinations = [
  { href: "/destinations/serengeti", label: "Serengeti" },
  { href: "/destinations/ngorongoro", label: "Ngorongoro" },
  { href: "/destinations/julius-nyerere", label: "Julius Nyerere" },
  { href: "/destinations/ruaha", label: "Ruaha" },
  { href: "/destinations/katavi", label: "Katavi" },
];

const experiences = [
  { href: "/experiences/luxury-fly-in", label: "Luxury Fly-in" },
  { href: "/experiences/honeymoon", label: "Honeymoon" },
  { href: "/experiences/photographic", label: "Photographic" },
  { href: "/experiences/conservation", label: "Conservation" },
];

export function Footer() {
  return (
    <footer
      className="relative min-h-[220px] lg:min-h-[280px] flex flex-col lg:grid lg:grid-cols-[1fr_1.25fr] items-stretch gap-6 lg:gap-0"
      style={{ backgroundColor: "#4c4a46" }}
    >
      {/* Left: logo in its own container, aligned left */}
      <div className="flex justify-center lg:justify-start items-center pt-10 lg:pt-0 lg:py-14 order-1 pl-4 sm:pl-6 lg:pl-8 lg:pr-4">
        <div className="footer-logo-container w-fit max-w-[280px] lg:max-w-none ml-6 lg:ml-20 pr-6 sm:pr-8 lg:pr-10 xl:pr-12">
          <Link href="/" className="block" aria-label="Tanzania Wildmakers Safaris - Home">
            <Image
              src="/logo-footer.png"
              alt="Tanzania Wildmakers Safaris"
              width={280}
              height={80}
              className="h-16 sm:h-20 lg:h-24 w-auto object-contain object-left"
            />
          </Link>
        </div>
      </div>

      {/* Right: footer image — larger */}
      <div className="relative w-full min-h-[180px] lg:min-h-0 shrink-0 order-3 flex items-center justify-end self-stretch">
        <div className="relative w-full h-full min-h-[160px] lg:min-h-0 self-stretch">
          <Image
            src="/footer-image.png"
            alt=""
            fill
            className="object-contain object-right"
            sizes="(max-width: 1023px) 100vw, 38vw"
            priority={false}
          />
        </div>
      </div>

      {/* Center: content — exactly in the middle of the footer on desktop */}
      <div className="flex flex-col justify-center items-center text-center px-4 sm:px-6 py-4 order-2 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:z-10 lg:px-0">
        <div className="max-w-xl">
          <p className="font-display text-lg sm:text-xl text-safari-gold-light">
            Crafting wild experiences. Redefining safari frontiers.
          </p>
          <nav className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {destinations.slice(0, 3).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-safari-sand-light/90 hover:text-safari-gold-light transition-colors"
              >
                {label}
              </Link>
            ))}
            {experiences.slice(0, 2).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-safari-sand-light/90 hover:text-safari-gold-light transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/plan-your-safari"
              className="text-safari-sand-light/90 hover:text-safari-gold-light transition-colors"
            >
              Plan Your Safari
            </Link>
          </nav>
          <p className="mt-8 text-safari-sand-light/80 text-sm">
            © {new Date().getFullYear()} Tanzania Wildmakers Safaris. Conservation-driven luxury safari.
          </p>
        </div>
      </div>
    </footer>
  );
}
