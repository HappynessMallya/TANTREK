import type { Metadata } from "next";
import Link from "next/link";
import { publicApi } from "@/lib/public-api";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for TANTREK 360 Safaris website and services.",
};

export default async function TermsPage() {
  const legal = await publicApi.getLegal("terms");

  return (
    <main className="min-h-screen bg-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-body text-tantrek-orange text-xs font-semibold tracking-wider uppercase mb-8 hover:underline"
        >
          <span aria-hidden>←</span> Home
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold mb-8">{legal?.title ?? "Terms of Use"}</h1>
        {legal?.body ? (
          <div
            className="legal-prose max-w-none text-tantrek-text font-body space-y-6"
            dangerouslySetInnerHTML={{ __html: legal.body }}
          />
        ) : (
        <div className="max-w-none text-tantrek-text font-body space-y-6">
          <p className="text-base leading-relaxed text-tantrek-text-muted">
            By using the TANTREK 360 Safaris website, you agree to these terms. The content (text,
            images, video) is for general information only and is subject to change.
          </p>
          <h2 className="font-display text-xl text-tantrek-navy font-semibold mt-8 mb-3">Bookings &amp; engagements</h2>
          <p className="text-base leading-relaxed text-tantrek-text-muted">
            Travel enquiries, bookings, and investment facilitation engagements are subject to separate
            terms provided at the time of contracting. Prices, availability, and scope are not
            guaranteed until confirmed in writing.
          </p>
          <h2 className="font-display text-xl text-tantrek-navy font-semibold mt-8 mb-3">Contact</h2>
          <p className="text-base leading-relaxed text-tantrek-text-muted">
            For questions:{" "}
            <a href="mailto:info@tantrek360safaris.com" className="text-tantrek-orange font-semibold hover:underline">
              info@tantrek360safaris.com
            </a>
            .
          </p>
        </div>
        )}
      </div>
    </main>
  );
}
