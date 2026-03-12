import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Tanzania Wildmakers Safaris. How we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-safari-green-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block font-body text-luxury-gold text-xs tracking-wider uppercase mb-8 hover:underline">
          ← Home
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl text-white mb-8">Privacy Policy</h1>
        <div className="prose prose-invert prose-sm max-w-none text-safari-sand-light/90 font-body space-y-6">
          <p className="text-sm leading-relaxed">
            Tanzania Wildmakers Safaris (&quot;we&quot;) respects your privacy. This policy describes how we collect, use, and protect your personal information when you use our website or contact us.
          </p>
          <h2 className="font-display text-xl text-white mt-8 mb-4">Information we collect</h2>
          <p className="text-sm leading-relaxed">
            We may collect your name, email address, phone number, and travel preferences when you submit an enquiry, plan your safari, or subscribe to our communications.
          </p>
          <h2 className="font-display text-xl text-white mt-8 mb-4">How we use it</h2>
          <p className="text-sm leading-relaxed">
            We use this information to respond to your enquiries, tailor safari proposals, and send relevant updates. We do not sell your data to third parties.
          </p>
          <h2 className="font-display text-xl text-white mt-8 mb-4">Contact</h2>
          <p className="text-sm leading-relaxed">
            For questions about this policy or your data, contact us at{" "}
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
