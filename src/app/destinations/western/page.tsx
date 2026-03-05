import type { Metadata } from "next";
import { CircuitPageContent } from "../CircuitPageContent";

export const metadata: Metadata = {
  title: "Western Circuit — Katavi Luxury Safari",
  description:
    "Western Tanzania luxury safari: Katavi National Park. Africa's last true frontier, buffalo herds, remote fly-in camps. Tanzania Wildmakers Safaris.",
};

export default function WesternCircuitPage() {
  return (
    <CircuitPageContent
      circuit="western"
      eyebrow="Western Tanzania"
      title="Western Circuit"
      intro="Katavi is Africa's last true frontier—fly-in only, massive buffalo herds, hippo pools, and a sense of having the wilderness to yourself. For the traveler who has seen the rest and wants the undiscovered."
      ctaText="Plan your Western Circuit safari"
    />
  );
}
