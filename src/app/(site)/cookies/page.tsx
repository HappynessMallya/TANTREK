import type { Metadata } from "next";
import Link from "next/link";
import { publicApi } from "@/lib/public-api";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie policy for TANTREK 360 Safaris website.",
};

export default async function CookiesPage() {
  const legal = await publicApi.getLegal("cookies");

  return (
    <main className="min-h-screen bg-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-body text-tantrek-orange text-xs font-semibold tracking-wider uppercase mb-8 hover:underline"
        >
          <span aria-hidden>←</span> Home
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold mb-8">{legal?.title ?? "Cookie Policy"}</h1>
        {legal?.body ? (
          <div
            className="legal-prose max-w-none text-tantrek-text font-body space-y-6"
            dangerouslySetInnerHTML={{ __html: legal.body }}
          />
        ) : (
        <div className="max-w-none text-tantrek-text font-body space-y-6">
          <p className="text-base leading-relaxed text-tantrek-text-muted">
            Our website may use cookies and similar technologies to improve your experience, remember
            preferences, and understand how the site is used.
          </p>
          <h2 className="font-display text-xl text-tantrek-navy font-semibold mt-8 mb-3">What we use</h2>
          <p className="text-base leading-relaxed text-tantrek-text-muted">
            We may use essential cookies for site operation and, if you consent, analytics cookies. You
            can adjust cookie settings in your browser.
          </p>
          <h2 className="font-display text-xl text-tantrek-navy font-semibold mt-8 mb-3">Contact</h2>
          <p className="text-base leading-relaxed text-tantrek-text-muted">
            Questions:{" "}
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
