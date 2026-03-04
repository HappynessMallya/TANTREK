import type { Metadata } from "next";
import Link from "next/link";
import { getDestinationsByCircuit } from "@/data/destinations";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Northern Circuit — Serengeti, Ngorongoro, Tarangire, Lake Manyara",
  description:
    "Luxury Northern Circuit safari: Serengeti, Ngorongoro Crater, Tarangire, Lake Manyara. Great Migration, Big Five, and iconic lodges. Tanzania Wildmakers Safaris.",
};

export default function NorthernCircuitPage() {
  const parks = getDestinationsByCircuit("northern");

  return (
    <>
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24 px-4 sm:px-6">
        <GlassCard className="max-w-4xl mx-auto p-8 sm:p-10 lg:p-12 text-center rounded-xl">
          <h1 className="font-display text-4xl lg:text-5xl text-safari-gold-light">
            Northern Circuit
          </h1>
          <p className="mt-6 text-lg text-safari-sand-light/90">
            The classic Tanzania safari route: Serengeti, Ngorongoro, Tarangire,
            and Lake Manyara. We design Northern Circuit itineraries for
            travelers who want the best of the north with exclusive camps and
            expert guiding.
          </p>
        </GlassCard>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {parks.map((park) => (
              <Link key={park.slug} href={`/destinations/${park.slug}`}>
                <GlassCard className="p-6 h-full transition-transform hover:scale-[1.02]">
                  <h2 className="font-display text-xl text-safari-gold-light">
                    {park.name}
                  </h2>
                  <p className="mt-2 text-safari-sand-light/80">{park.tagline}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/plan-your-safari" variant="primary">
              Plan Your Northern Circuit Safari
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
