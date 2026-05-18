import type { Metadata } from "next";
import { CircuitPageContent } from "../CircuitPageContent";

export const metadata: Metadata = {
  title: "Northern Circuit — Serengeti, Ngorongoro, Tarangire, Lake Manyara",
  description:
    "Northern Circuit with TANTREK 360: Serengeti, Ngorongoro Crater, Tarangire, Lake Manyara. Great Migration, Big Five, iconic lodges — paired with Tanzania opportunity tours.",
};

export default function NorthernCircuitPage() {
  return (
    <CircuitPageContent
      circuit="northern"
      eyebrow="Northern Tanzania"
      title="Northern Circuit"
      intro="The classic Tanzania safari route: Serengeti, Ngorongoro, Tarangire, and Lake Manyara. We design Northern Circuit itineraries for travelers who want the best of the north with exclusive camps and expert guiding."
      ctaText="Plan your Northern Circuit safari"
    />
  );
}
