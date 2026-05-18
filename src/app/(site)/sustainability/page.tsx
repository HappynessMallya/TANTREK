import type { Metadata } from "next";
import { SustainabilityContent } from "./SustainabilityContent";

export const metadata: Metadata = {
  title: "Sustainability — Conservation & Community",
  description:
    "TANTREK 360 impact: low-density tourism, conservation partnerships, and community collaboration. Travel and investment with a positive footprint.",
};

export default function SustainabilityPage() {
  return <SustainabilityContent />;
}
