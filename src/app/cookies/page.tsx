import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie policy for Tanzania Wildmakers Safaris website.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-safari-green-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block font-body text-luxury-gold text-xs tracking-wider uppercase mb-8 hover:underline">
          ← Home
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl text-white mb-8">Cookie Policy</h1>
        <div className="prose prose-invert prose-sm max-w-none text-safari-sand-light/90 font-body space-y-6">
          <p className="text-sm leading-relaxed">
            Our website may use cookies and similar technologies to improve your experience, remember preferences, and understand how the site is used.
          </p>
          <h2 className="font-display text-xl text-white mt-8 mb-4">What we use</h2>
          <p className="text-sm leading-relaxed">
            We may use essential cookies for site operation and, if you consent, analytics cookies. You can adjust cookie settings in your browser.
          </p>
          <h2 className="font-display text-xl text-white mt-8 mb-4">Contact</h2>
          <p className="text-sm leading-relaxed">
            Questions:{" "}
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
