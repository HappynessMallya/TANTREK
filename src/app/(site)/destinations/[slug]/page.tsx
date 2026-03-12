import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getDestinationBySlug,
  getDestinationsByCircuit,
  destinations,
  type Destination,
  type Circuit,
} from "@/data/destinations";
import { DestinationPageContent } from "./DestinationPageContent";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { publicApi } from "@/lib/public-api";

type Props = { params: Promise<{ slug: string }> };

// Include static slugs so pre-existing pages always work
export async function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [apiDest, staticDest] = await Promise.all([
    publicApi.getDestination(slug),
    Promise.resolve(getDestinationBySlug(slug)),
  ]);
  const name = apiDest?.name ?? staticDest?.name ?? "Destination";
  const description = apiDest?.metaDescription ?? staticDest?.metaDescription ?? "";
  return {
    title: `${name} — Luxury Safari`,
    description,
    openGraph: { description },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;

  // Try API first, fall back to static data
  const [apiDest, staticDest] = await Promise.all([
    publicApi.getDestination(slug),
    Promise.resolve(getDestinationBySlug(slug)),
  ]);

  if (!apiDest && !staticDest) notFound();

  // Build a unified Destination object — API data takes priority, static fills gaps
  const dest: Destination = apiDest
    ? {
        slug: apiDest.slug,
        name: apiDest.name,
        circuit: (apiDest.circuit?.slug as Circuit) ?? staticDest?.circuit ?? "northern",
        tagline: apiDest.tagline ?? staticDest?.tagline ?? "",
        metaDescription: apiDest.metaDescription ?? staticDest?.metaDescription ?? "",
        highlights: apiDest.highlights ?? staticDest?.highlights ?? [],
        bestTime: staticDest?.bestTime ?? "Year-round — consult us for seasonal guidance.",
        luxuryCamps: staticDest?.luxuryCamps ?? [],
        imageUrl: apiDest.heroImage?.url ?? staticDest?.imageUrl ?? "",
        internalLinks: staticDest?.internalLinks ?? [],
        ecosystem: staticDest?.ecosystem,
        avgTemp: staticDest?.avgTemp,
        migrationNote: staticDest?.migrationNote,
      }
    : staticDest!;

  // Other destinations in the same circuit for "See also"
  const othersInCircuit = getDestinationsByCircuit(dest.circuit).filter(
    (d) => d.slug !== dest.slug
  );

  const faqItems = [
    { question: `What is the best time to visit ${dest.name}?`, answer: dest.bestTime },
    ...(dest.highlights.length > 0 ? [{ question: `What wildlife can I see in ${dest.name}?`, answer: dest.highlights.join(". ") + "." }] : []),
    ...(dest.luxuryCamps.length > 0 ? [{ question: `Which luxury camps does Tanzania Wildmakers recommend in ${dest.name}?`, answer: dest.luxuryCamps.join(", ") + "." }] : []),
  ];

  return (
    <>
      <FAQSchema items={faqItems} />
      <DestinationPageContent destination={dest} othersInCircuit={othersInCircuit} />
    </>
  );
}
