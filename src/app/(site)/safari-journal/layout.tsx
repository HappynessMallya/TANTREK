import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights & Stories",
  description:
    "TANTREK 360 Insights — travel guidance, investment perspectives, and field notes from Tanzania's wilderness and emerging markets.",
};

export default function SafariJournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
