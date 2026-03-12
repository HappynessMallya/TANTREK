"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { cmsApi } from "@/lib/cms-api";

export default function CmsLoginPage() {
  const [email, setEmail] = useState("admin@tanzaniawildmakerssafari.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get("reason") === "session_expired") {
      setInfo("Your session has expired. Please log in again to continue.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await cmsApi.login(email, password);
      // Use replace instead of push so the login page is not in the browser history
      router.replace("/cms/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen bg-luxury-champagne">
      {/* Left panel — brand / decoration */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-luxury-dark-emerald relative overflow-hidden px-16">
        {/* Subtle gold dust overlay (matches public site) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(2px 2px at 20px 30px, #D4AF37, transparent), radial-gradient(2px 2px at 80px 80px, #D4AF37, transparent), radial-gradient(2px 2px at 140px 160px, #D4AF37, transparent)",
            backgroundSize: "200px 200px",
          }}
        />
        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,175,55,0.08), transparent)" }} />

        <div className="relative z-10 text-center max-w-sm">
          {/* Actual site logo */}
          <div className="mx-auto mb-8">
            <Image
              src="/logo.png"
              alt="Tanzania Wildmakers Safaris"
              width={260}
              height={72}
              className="h-16 w-auto object-contain mx-auto"
              priority
            />
          </div>

          <h2 className="font-display text-3xl font-bold text-safari-cream leading-tight">
            Tanzania Wildmakers
          </h2>
          <div className="mx-auto mt-3 h-[2px] w-12 rounded-full bg-luxury-gold" />
          <p className="mt-4 text-sm text-safari-cream/50 font-body leading-relaxed">
            Content management portal for the Tanzania Wildmakers Safari website.
          </p>

          {/* Decorative quote */}
          <div className="mt-10 rounded-xl border border-luxury-gold/20 bg-luxury-gold/5 px-6 py-5">
            <p className="font-display text-base italic text-safari-cream/70 leading-relaxed">
              &ldquo;Crafting wild experiences. Redefining safari frontiers.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 flex flex-col items-center lg:hidden">
          <div className="mb-2 rounded-xl bg-luxury-dark-emerald px-4 py-3">
            <Image
              src="/logo.png"
              alt="Tanzania Wildmakers Safaris"
              width={200}
              height={56}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-[#0D2218]">
              Welcome back
            </h1>
            <div className="mt-2 h-[2px] w-8 rounded-full bg-luxury-gold" />
            <p className="mt-3 text-sm text-[#8A9990] font-body">
              Sign in to manage your website content.
            </p>
          </div>

          {info && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-800">
              <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {info}
            </div>
          )}

          <div className="rounded-2xl border border-[#EAE4D0] bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#8A9990] mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#D5CAAD] bg-white px-4 py-2.5 text-sm text-[#0D2218] placeholder-[#B0A88C] transition-all focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/15"
                  placeholder="admin@tanzaniawildmakerssafari.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#8A9990] mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#D5CAAD] bg-white px-4 py-2.5 text-sm text-[#0D2218] placeholder-[#B0A88C] transition-all focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/15"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  autoFocus
                  required
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                  <svg className="h-4 w-4 mt-0.5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !cmsApi.isConfigured}
                className="w-full rounded-xl bg-luxury-gold px-4 py-3 text-sm font-semibold text-[#0D2218] hover:bg-luxury-gold-hover transition-all focus:outline-none focus:ring-2 focus:ring-luxury-gold/40 focus:ring-offset-2 disabled:opacity-50 shadow-sm font-body"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {!cmsApi.isConfigured && (
              <p className="mt-4 text-center text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Set <code className="font-mono">NEXT_PUBLIC_CMS_API_URL</code> to enable login.
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-[#A9A090]">
            Tanzania Wildmakers Safari &mdash; Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}
