import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safari Journal",
  description:
    "Stories, insights and seasonal guidance from Tanzania's wild frontiers. Safari planning, wildlife encounters, destination guides, and conservation stories.",
};

export default function SafariJournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
