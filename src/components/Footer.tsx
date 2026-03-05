import Link from "next/link";
import Image from "next/image";
import { circuits, getDestinationsByCircuit } from "@/data/destinations";
import type { Circuit } from "@/data/destinations";

const circuitOrder: Circuit[] = ["northern", "southern", "western"];

const footerDestinationGroups = circuitOrder.map((key) => {
  const circuit = circuits[key];
  const parks = getDestinationsByCircuit(key);
  return {
    circuitLabel: circuit.name,
    circuitHref: `/destinations/${circuit.slug}`,
    parks: parks.map((p) => ({ label: p.name, href: `/destinations/${p.slug}` })),
  };
});

const experiences = [
  { href: "/experiences/luxury-fly-in", label: "Luxury Fly-in" },
  { href: "/experiences/honeymoon", label: "Honeymoon" },
  { href: "/experiences/photographic", label: "Photographic" },
  { href: "/experiences/conservation", label: "Conservation" },
];

export function Footer() {
  return (
    <footer
      className="relative min-h-[380px] lg:min-h-[420px] flex flex-col lg:grid lg:grid-cols-[1fr_1.25fr] items-stretch gap-6 lg:gap-0"
      style={{ backgroundColor: "#4c4a46" }}
    >
      {/* Left: logo + contact details */}
      <div className="flex flex-col justify-center lg:justify-start items-center lg:items-start pt-10 lg:pt-0 lg:py-16 order-1 pl-4 sm:pl-6 lg:pl-8 lg:pr-4">
        <div className="footer-logo-container w-fit max-w-[280px] lg:max-w-none ml-0 lg:ml-20 pr-0 lg:pr-10 xl:pr-12 mt-12 lg:mt-12 mb-6 lg:mb-6">
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
        <div className="text-safari-sand-light/90 text-sm space-y-2 ml-0 lg:ml-20 max-w-[280px] lg:max-w-none text-center lg:text-left">
          <p>
            <span className="text-safari-sand-muted/90 font-medium">Email:</span>{" "}
            <a href="mailto:info@tanzaniawildmakersafari.com" className="hover:text-safari-gold-light underline">
              info@tanzaniawildmakersafari.com
            </a>
          </p>
          <p>
            <span className="text-safari-sand-muted/90 font-medium">Phone:</span>{" "}
            <a href="tel:+255762111315" className="hover:text-safari-gold-light underline">
              +255 762 111 315
            </a>
          </p>
          <p>
            <span className="text-safari-sand-muted/90 font-medium">Location:</span> Tanzania
          </p>
        </div>
      </div>

      {/* Right: footer image — larger */}
      <div className="relative w-full min-h-[180px] lg:min-h-0 shrink-0 order-3 flex items-center justify-end self-stretch pr-0">
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
      <div className="flex flex-col justify-center items-center text-center px-4 sm:px-6 py-8 lg:py-10 order-2 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:z-10 lg:px-0">
        <div className="max-w-3xl w-full">
          <p className="font-display text-lg sm:text-xl text-safari-gold-light">
            Crafting wild experiences. Redefining safari frontiers.
          </p>
          <p className="mt-2 text-safari-sand-light/80 text-sm max-w-lg mx-auto">
            We organise safaris by circuit; each circuit includes several national parks.
          </p>

          {/* Destinations by circuit — 3 columns on desktop */}
          <nav className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-left" aria-label="Destinations by circuit">
            {footerDestinationGroups.map((group) => (
              <div key={group.circuitHref}>
                <Link
                  href={group.circuitHref}
                  className="font-medium text-safari-gold-light hover:underline block mb-2"
                >
                  {group.circuitLabel}
                </Link>
                <ul className="list-disc list-inside text-safari-sand-light/90 text-sm space-y-1 ml-1">
                  {group.parks.map((park) => (
                    <li key={park.href}>
                      <Link href={park.href} className="hover:text-safari-gold-light hover:underline transition-colors">
                        {park.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <span className="text-safari-sand-muted/90">Experiences:</span>
            {experiences.slice(0, 3).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-safari-sand-light/90 hover:text-safari-gold-light transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link href="/plan-your-safari" className="text-safari-gold hover:underline">
              Plan Your Safari
            </Link>
          </div>

          <p className="mt-8 text-safari-sand-light/80 text-sm">
            © {new Date().getFullYear()} Tanzania Wildmakers Safaris. Conservation-driven luxury safari.
          </p>
        </div>
      </div>
    </footer>
  );
}
