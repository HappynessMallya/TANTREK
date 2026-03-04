import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getDestinationBySlug,
  getDestinationsByCircuit,
  destinations,
} from "@/data/destinations";
import { DestinationPageContent } from "./DestinationPageContent";
import { FAQSchema } from "@/components/seo/FAQSchema";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) return { title: "Destination" };
  return {
    title: `${dest.name} — Luxury Safari`,
    description: dest.metaDescription,
    openGraph: { description: dest.metaDescription },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) notFound();

  const othersInCircuit = getDestinationsByCircuit(dest.circuit).filter(
    (d) => d.slug !== dest.slug
  );

  const faqItems = [
    {
      question: `What is the best time to visit ${dest.name}?`,
      answer: dest.bestTime,
    },
    {
      question: `What wildlife can I see in ${dest.name}?`,
      answer: dest.highlights.join(". ") + ".",
    },
    {
      question: `Which luxury camps does Tanzania Wildmakers recommend in ${dest.name}?`,
      answer: dest.luxuryCamps.join(", ") + ".",
    },
  ];

  return (
    <>
      <FAQSchema items={faqItems} />
      <DestinationPageContent
        destination={dest}
        othersInCircuit={othersInCircuit}
      />
    </>
  );
}
