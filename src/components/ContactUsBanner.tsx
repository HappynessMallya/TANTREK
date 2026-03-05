"use client";

const CONTACT_EMAIL = "info@tanzaniawildmakersafari.com";

export function ContactUsBanner() {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="group contact-us-banner fixed right-0 top-[45%] z-30 flex items-center gap-2 py-4 pl-3 pr-4 rounded-l-lg transition-all duration-300 ease-out hover:translate-x-[-5px] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0B2D26]"
      style={{
        backgroundColor: "#0B2D26",
        color: "#D4AF37",
        borderLeft: "2px solid #D4AF37",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      }}
      aria-label="Contact us by email"
    >
      <span
        className="font-body text-[10px] font-semibold tracking-[0.2em] uppercase whitespace-nowrap origin-center"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
      >
        Contact Us
      </span>
      <svg
        className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
