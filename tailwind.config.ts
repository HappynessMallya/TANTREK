import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tantrek: {
          // Primary brand
          navy: "#003B8E",
          "navy-deep": "#002B5B",
          "navy-soft": "#0a4ba6",
          // Primary action
          orange: "#FF7A00",
          "orange-deep": "#FF4D00",
          "orange-soft": "#FF9333",
          // Accents
          sky: "#00AEEF",
          "sky-soft": "#33BFF2",
          gold: "#D4A64A",
          // Neutrals
          white: "#FFFFFF",
          surface: "#F5F7FA",
          "surface-2": "#EEF1F6",
          border: "#E4E8EE",
          text: "#111827",
          "text-muted": "#6B7280",
          "text-soft": "#9CA3AF",
        },
        // Legacy aliases — secondary pages (destinations listing, sustainability,
        // safari-journal) still use these on navy backgrounds, so the "sand"/"cream"
        // values must remain light for legibility against dark navy.
        safari: {
          green: "#003B8E",
          "green-dark": "#002B5B",
          "green-light": "#0a4ba6",
          sand: "#FF7A00",
          "sand-light": "#E8EEF6",
          "sand-muted": "#9CA3AF",
          gold: "#FF7A00",
          "gold-light": "#FF9333",
          "gold-dark": "#FF4D00",
          cream: "#FFFFFF",
        },
        luxury: {
          gold: "#FF7A00",
          "gold-hover": "#FF4D00",
          champagne: "#F5F7FA",
          "sand-warm": "#F5F7FA",
          "dark-emerald": "#002B5B",
          "overlay-dark": "rgba(0, 43, 91, 0.72)",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.85)",
          border: "rgba(0, 59, 142, 0.12)",
          dark: "rgba(0, 43, 91, 0.55)",
        },
      },
      fontFamily: {
        display: ["var(--font-poppins)", "Montserrat", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-orange": "linear-gradient(90deg, #FF7A00 0%, #FF4D00 100%)",
        "gradient-navy": "linear-gradient(135deg, #003B8E 0%, #002B5B 100%)",
        "gradient-hero-overlay":
          "linear-gradient(180deg, rgba(0,43,91,0.35) 0%, rgba(0,43,91,0.55) 60%, rgba(0,43,91,0.85) 100%)",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(17, 24, 39, 0.06)",
        card: "0 12px 32px rgba(17, 24, 39, 0.08)",
        elevated: "0 20px 48px rgba(0, 43, 91, 0.12)",
        "orange-glow": "0 12px 32px rgba(255, 122, 0, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
