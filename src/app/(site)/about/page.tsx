import type { Metadata } from "next";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us — Wilderness Architects",
  description:
    "Tanzania Wildmakers Safaris: frontier luxury in Southern and Western Tanzania. We are wilderness architects, not mass tourism. Ruaha, Julius Nyerere, Katavi.",
};

export default function AboutPage() {
  return <AboutContent />;
}
