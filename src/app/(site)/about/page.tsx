import type { Metadata } from "next";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "About TANTREK 360 — 360° Integrated Ecosystem",
  description:
    "TANTREK 360 Safaris unites curated travel with business consultancy and investment facilitation. Built on honesty, integrity, and end-to-end support across Tanzania.",
};

export default function AboutPage() {
  return <AboutContent />;
}
