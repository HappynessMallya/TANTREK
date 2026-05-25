import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PlanYourSafariForm } from "./PlanYourSafariForm";

export const metadata: Metadata = {
  title: "Begin Your Journey — TANTREK Safari Designers",
  description:
    "Speak with a Tantrek safari designer. Every journey is shaped through a conversation — about how you want to travel, who you're travelling with, and what would make it unforgettable.",
};

type SearchParamsShape = { season?: string; email?: string; sketch?: string };
type PlanPageProps = {
  searchParams?: Promise<SearchParamsShape> | SearchParamsShape;
};

export default async function PlanYourSafariPage(props: PlanPageProps) {
  const raw = props.searchParams;
  const resolved =
    raw && typeof (raw as Promise<unknown>).then === "function"
      ? await (raw as Promise<SearchParamsShape>)
      : ((raw as SearchParamsShape | undefined) ?? {});
  const initialEmail = typeof resolved.email === "string" ? resolved.email : "";
  const initialSeason = typeof resolved.season === "string" ? resolved.season : "";
  const initialSketch = typeof resolved.sketch === "string" ? resolved.sketch : "";

  return (
    <main className="relative flex min-h-screen flex-col bg-white pt-20">
      {/* ═══════════════════════════════════════════════════════════════════
          1 · Concierge hero — frames the inquiry as a conversation, not a form
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-tantrek-navy-deep">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/tour6.webp" /* PLACEHOLDER: replace with editorial portrait of a safari designer at work */
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-hero-overlay" aria-hidden />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 80% 25%, rgba(255,122,0,0.18), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <p className="editorial-eyebrow text-tantrek-orange mb-6">Safari Design Studio</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-[1.05] max-w-4xl">
            Begin your{" "}
            <span className="font-serif italic font-normal text-tantrek-orange">
              African story.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-white/85 text-base sm:text-lg lg:text-xl leading-relaxed font-body">
            Every Tantrek journey is shaped slowly — through conversation,
            instinct, and the careful work of those who know the land. Tell us
            how you&rsquo;d like to travel; we&rsquo;ll design the rest.
          </p>

          {/* Direct-contact rail — gives the visitor a sense of who is on the
              other end before they fill out anything */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center">
            <a
              href="https://wa.me/34637048615"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/30 px-5 py-2.5 text-white text-sm backdrop-blur-sm transition-all hover:bg-white hover:text-tantrek-navy-deep hover:border-white"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.683-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607z" />
              </svg>
              WhatsApp
            </a>
            <a
              href="mailto:info@tantrek360safaris.com"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/30 px-5 py-2.5 text-white text-sm backdrop-blur-sm transition-all hover:bg-white hover:text-tantrek-navy-deep hover:border-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@tantrek360safaris.com
            </a>
            <Link
              href="/design-your-journey"
              className="inline-flex items-center gap-2 rounded-full border border-tantrek-orange/45 bg-tantrek-orange/10 px-5 py-2.5 text-tantrek-orange text-sm backdrop-blur-sm transition-all hover:bg-tantrek-orange hover:text-white hover:border-tantrek-orange"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 4H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Sketch a draft journey first
            </Link>
            <p className="text-white/60 text-xs sm:text-sm font-body sm:ml-auto">
              Or read by a safari designer within 24 hours ↓
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2 · "What happens next" — sets expectations before the form,
          replacing the transactional contact-form feel.
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-tantrek-surface border-b border-tantrek-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "A conversation",
                body: "You share what you have in mind. We read it personally — never an auto-responder — and reply within 24 hours.",
              },
              {
                step: "02",
                title: "A draft journey",
                body: "If it feels right, we sketch a private itinerary — camps, timing, pacing — and walk you through every choice.",
              },
              {
                step: "03",
                title: "The trip itself",
                body: "From the moment you land to the moment you fly home, your safari designer is one message away.",
              },
            ].map((s) => (
              <div key={s.step} className="editorial-reason">
                <span className="reason-number">{s.step}</span>
                <h3 className="font-display text-lg text-tantrek-navy font-semibold mb-2">
                  {s.title}
                </h3>
                <p className="text-tantrek-text-muted text-sm leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3 · Designer card + inquiry form
          The original two-column layout reframed: the left column now feels
          like meeting your safari designer, not filling out a contact card.
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="flex-1 py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-14 lg:items-start">
          <aside className="flex flex-col gap-8 lg:col-span-2 lg:sticky lg:top-28">
            {/* Designer profile */}
            <div className="rounded-2xl border border-tantrek-border bg-white p-7 sm:p-8 shadow-card">
              <p className="editorial-eyebrow text-tantrek-orange mb-5">
                Your Safari Designer
              </p>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-tantrek-orange/20">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80"
                    alt="" /* PLACEHOLDER: replace with portrait of the actual designer */
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg text-tantrek-navy font-semibold leading-snug">
                    A small Tanzanian team
                  </p>
                  <p className="font-body text-sm text-tantrek-text-muted">
                    Owner-led · Tanzania-based
                  </p>
                </div>
              </div>

              <p className="mt-6 font-serif italic text-tantrek-navy-deep text-lg leading-snug">
                &ldquo;Tell us how you&rsquo;d like to travel — the rest is our work.&rdquo;
              </p>

              <ul className="mt-6 space-y-2.5">
                {[
                  "Northern, Southern & Western circuits",
                  "Tourism, investment & opportunity exposure",
                  "English, Swahili & Spanish",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-sm text-tantrek-text"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tantrek-orange/15 text-tantrek-orange">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Response time reassurance */}
            <div className="rounded-2xl bg-tantrek-navy-deep text-white p-7 sm:p-8 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 50% at 70% 30%, rgba(255,122,0,0.25), transparent 60%)",
                }}
                aria-hidden
              />
              <div className="relative z-10">
                <p className="editorial-eyebrow text-tantrek-orange mb-4">
                  Our Promise
                </p>
                <p className="font-serif text-3xl font-medium leading-tight">
                  24 hours.
                </p>
                <p className="mt-3 font-body text-white/80 text-sm leading-relaxed">
                  Every inquiry is read personally by a Tantrek safari designer
                  within one day — most replies arrive much sooner.
                </p>
                <div className="mt-5 pt-5 border-t border-white/15 space-y-3 text-sm">
                  <a
                    href="https://wa.me/34637048615"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-white/90 hover:text-tantrek-orange transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.683-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607z" />
                    </svg>
                    WhatsApp us directly
                  </a>
                  <a
                    href="mailto:info@tantrek360safaris.com"
                    className="flex items-center gap-2.5 text-white/90 hover:text-tantrek-orange transition-colors break-all"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    info@tantrek360safaris.com
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* The form — editorial framing, mechanics preserved */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-tantrek-border bg-white p-7 sm:p-9 lg:p-11 shadow-card">
              <div className="mb-7 pb-7 border-b border-tantrek-border">
                <p className="editorial-eyebrow text-tantrek-orange mb-4">
                  The Conversation
                </p>
                <h2 className="font-display text-2xl sm:text-3xl text-tantrek-navy font-bold leading-tight">
                  A few questions to{" "}
                  <span className="font-serif italic font-normal text-tantrek-orange">
                    start from.
                  </span>
                </h2>
                <p className="mt-3 text-tantrek-text-muted text-sm sm:text-[15px] leading-relaxed">
                  Short answers are fine. The more you share, the more
                  considered our reply — but anything you forget, we&rsquo;ll
                  ask about over WhatsApp or email.
                </p>
              </div>

              {initialSeason && (
                <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-tantrek-orange/10 px-4 py-1.5 font-body text-[11px] font-bold uppercase tracking-[0.22em] text-tantrek-orange">
                  Preferred season ·{" "}
                  {initialSeason === "dry-jun-oct" && "Dry (Jun – Oct)"}
                  {initialSeason === "green-dec-mar" && "Green (Dec – Mar)"}
                  {initialSeason === "shoulder" && "Shoulder (Apr – May, Nov)"}
                  {initialSeason === "flexible" && "Flexible"}
                </p>
              )}

              {initialSketch && (
                <div className="mb-7 rounded-xl border border-tantrek-orange/30 bg-tantrek-orange/[0.06] p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tantrek-orange/20 text-tantrek-orange">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <p className="font-body text-[10px] font-bold uppercase tracking-[0.22em] text-tantrek-orange leading-snug pt-0.5">
                      Your sketch is included · we&rsquo;ll see it on the
                      final step
                    </p>
                  </div>
                  <pre className="whitespace-pre-wrap font-body text-tantrek-text text-sm leading-relaxed">
                    {initialSketch}
                  </pre>
                </div>
              )}

              <PlanYourSafariForm
                inline
                initialEmail={initialEmail}
                initialSeason={initialSeason}
                initialNotes={initialSketch}
              />

              <p className="mt-7 pt-6 border-t border-tantrek-border text-tantrek-text-soft text-xs leading-relaxed">
                Your information stays with our small team. We do not share,
                sell, or auto-route it. Read about{" "}
                <Link
                  href="/privacy-policy"
                  className="text-tantrek-orange hover:text-tantrek-orange-deep underline underline-offset-2"
                >
                  how we handle it
                </Link>
                .
              </p>
            </div>

            <div className="mt-8 text-center lg:text-left">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-body text-tantrek-navy text-sm font-semibold tracking-wide hover:text-tantrek-orange transition-colors"
              >
                <span aria-hidden>←</span> Return to homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
