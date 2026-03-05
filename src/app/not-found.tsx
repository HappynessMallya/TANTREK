import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="font-display text-4xl sm:text-5xl text-white font-light tracking-tight">
        Page not found
      </h1>
      <p className="mt-4 text-safari-sand-light/70 font-body text-sm max-w-md">
        The wilderness you&apos;re looking for isn&apos;t here. Return to the start of your journey.
      </p>
      <Link
        href="/"
        className="mt-8 luxury-cta-primary inline-flex items-center justify-center font-body text-xs font-bold tracking-[0.25em] uppercase"
      >
        Back to home
      </Link>
    </main>
  );
}
