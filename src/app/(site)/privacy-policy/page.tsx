import type { Metadata } from "next";
import Link from "next/link";
import { publicApi } from "@/lib/public-api";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for TANTREK 360 Safaris. How we collect, use, and protect your information.",
};

export default async function PrivacyPolicyPage() {
  const legal = await publicApi.getLegal("privacy");

  return (
    <main className="min-h-screen bg-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-body text-tantrek-orange text-xs font-semibold tracking-wider uppercase mb-8 hover:underline"
        >
          <span aria-hidden>←</span> Home
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl text-tantrek-navy font-bold mb-8">{legal?.title ?? "Privacy Policy"}</h1>
        {legal?.body ? (
          <div
            className="legal-prose max-w-none text-tantrek-text font-body space-y-6"
            dangerouslySetInnerHTML={{ __html: legal.body }}
          />
        ) : (
        <div className="max-w-none text-tantrek-text font-body space-y-6">
          <p className="text-base leading-relaxed text-tantrek-text-muted">
            TANTREK 360 Safaris (&quot;we&quot;) respects your privacy. This policy describes how we
            collect, use, and protect your personal information when you use our website, request a
            consultation, or engage our travel and investment services.
          </p>
          <h2 className="font-display text-xl text-tantrek-navy font-semibold mt-8 mb-3">Information we collect</h2>
          <p className="text-base leading-relaxed text-tantrek-text-muted">
            We may collect your name, email address, phone number, travel preferences, business goals, and
            investment interests when you submit an enquiry, plan a trip, or subscribe to our communications.
          </p>
          <h2 className="font-display text-xl text-tantrek-navy font-semibold mt-8 mb-3">How we use it</h2>
          <p className="text-base leading-relaxed text-tantrek-text-muted">
            We use this information to respond to your enquiries, design tailored 360° proposals (travel +
            opportunity), and send relevant updates. We do not sell your data to third parties.
          </p>
          <h2 className="font-display text-xl text-tantrek-navy font-semibold mt-8 mb-3">Contact</h2>
          <p className="text-base leading-relaxed text-tantrek-text-muted">
            For questions about this policy or your data, contact us at{" "}
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
