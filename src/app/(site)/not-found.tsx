import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-24 text-center bg-white">
      <p className="font-body text-tantrek-orange text-[11px] font-bold tracking-[0.32em] uppercase mb-4">
        404 — Off the map
      </p>
      <h1 className="font-display text-4xl sm:text-5xl text-tantrek-navy font-bold tracking-tight">
        Page not found
      </h1>
      <p className="mt-4 text-tantrek-text-muted font-body text-base max-w-md">
        The route you&apos;re looking for isn&apos;t here. Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-tantrek-orange px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,122,0,0.3)] transition-all hover:bg-tantrek-orange-deep hover:-translate-y-0.5"
      >
        Back to home
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </main>
  );
}
