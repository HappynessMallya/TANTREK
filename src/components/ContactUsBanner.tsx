"use client";

const CONTACT_EMAIL = "info@tantrek360safaris.com";

export function ContactUsBanner() {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="group fixed right-0 top-[45%] z-30 flex items-center gap-1 py-2.5 pl-1 pr-1.5 sm:py-3 sm:pl-2 sm:pr-3 rounded-l-lg transition-all duration-300 ease-out hover:translate-x-[-4px] focus:outline-none focus:ring-2 focus:ring-tantrek-orange focus:ring-offset-2"
      style={{
        backgroundColor: "#FF7A00",
        color: "#FFFFFF",
        boxShadow: "0 6px 18px rgba(255, 122, 0, 0.35)",
      }}
      aria-label="Contact TANTREK 360 by email"
    >
      <span
        className="font-body text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
      >
        Contact Us
      </span>
      <svg
        className="hidden sm:block w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    </a>
  );
}
