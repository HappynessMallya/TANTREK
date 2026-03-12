import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for Tanzania Wildmakers Safaris website and services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-safari-green-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block font-body text-luxury-gold text-xs tracking-wider uppercase mb-8 hover:underline">
          ← Home
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl text-white mb-8">Terms of Use</h1>
        <div className="prose prose-invert prose-sm max-w-none text-safari-sand-light/90 font-body space-y-6">
          <p className="text-sm leading-relaxed">
            By using the Tanzania Wildmakers Safaris website, you agree to these terms. The content (text, images, video) is for general information only and is subject to change.
          </p>
          <h2 className="font-display text-xl text-white mt-8 mb-4">Safari bookings</h2>
          <p className="text-sm leading-relaxed">
            Enquiries and bookings are subject to separate terms provided at the time of booking. Prices and availability are not guaranteed until confirmed in writing.
          </p>
          <h2 className="font-display text-xl text-white mt-8 mb-4">Contact</h2>
          <p className="text-sm leading-relaxed">
            For questions:{" "}
            <a href="mailto:info@tanzaniawildmakersafari.com" className="text-luxury-gold hover:underline">
              info@tanzaniawildmakersafari.com
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
