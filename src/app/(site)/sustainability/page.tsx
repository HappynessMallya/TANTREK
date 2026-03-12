import type { Metadata } from "next";
import { SustainabilityContent } from "./SustainabilityContent";

export const metadata: Metadata = {
  title: "Sustainability — Conservation & Community",
  description:
    "Tanzania Wildmakers Safaris: low-density tourism, conservation partnerships, and community collaboration. Luxury safari with a positive footprint.",
};

export default function SustainabilityPage() {
  return <SustainabilityContent />;
}
