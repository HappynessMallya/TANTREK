import type { Metadata } from "next";
import { CircuitPageContent } from "../CircuitPageContent";

export const metadata: Metadata = {
  title: "Southern Circuit — Julius Nyerere & Ruaha Luxury Safari",
  description:
    "Southern Tanzania luxury safari: Julius Nyerere (ex-Selous) and Ruaha. Low-density wilderness, walking safaris, fly-in exclusivity. Tanzania Wildmakers.",
};

export default function SouthernCircuitPage() {
  return (
    <CircuitPageContent
      circuit="southern"
      eyebrow="Southern Tanzania"
      title="Southern Circuit"
      intro="The soul of our brand. Julius Nyerere and Ruaha offer vast, low-density wilderness—walking safaris, boat safaris, and the kind of silence that redefines safari. This is where we are wilderness architects."
      ctaText="Plan your Southern Circuit safari"
    />
  );
}
