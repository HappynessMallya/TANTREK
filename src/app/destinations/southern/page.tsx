import type { Metadata } from "next";
import Link from "next/link";
import { getDestinationsByCircuit } from "@/data/destinations";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Southern Circuit — Julius Nyerere & Ruaha Luxury Safari",
  description:
    "Southern Tanzania luxury safari: Julius Nyerere (ex-Selous) and Ruaha. Low-density wilderness, walking safaris, fly-in exclusivity. Tanzania Wildmakers.",
};

export default function SouthernCircuitPage() {
  const parks = getDestinationsByCircuit("southern");

  return (
    <>
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24 px-4 sm:px-6">
        <GlassCard className="max-w-4xl mx-auto p-8 sm:p-10 lg:p-12 text-center rounded-xl">
          <h1 className="font-display text-4xl lg:text-5xl text-safari-gold-light">
            Southern Circuit
          </h1>
          <p className="mt-6 text-lg text-safari-sand-light/90">
            The soul of our brand. Julius Nyerere and Ruaha offer vast,
            low-density wilderness—walking safaris, boat safaris, and the kind
            of silence that redefines safari. This is where we are wilderness
            architects.
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
              Plan Your Southern Circuit Safari
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
