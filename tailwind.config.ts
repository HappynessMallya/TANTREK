import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        safari: {
          green: "#2c5c44",
          "green-dark": "#1e4030",
          "green-light": "#3d7a5c",
          sand: "#66532c",
          "sand-light": "#e1d3b4",
          "sand-muted": "#8a7348",
          gold: "#c4a967",
          "gold-light": "#e1d3b4",
          "gold-dark": "#66532c",
          cream: "#e1d3b4",
        },
        luxury: {
          gold: "#D4AF37",
          "gold-hover": "#E6C96A",
          champagne: "#F6F3EB",
          "sand-warm": "#F4EFE6",
          "dark-emerald": "#081f1a",
          "overlay-dark": "rgba(5, 20, 15, 0.75)",
        },
        glass: {
          light: "rgba(30,64,48,0.92)",
          border: "rgba(255,255,255,0.2)",
          dark: "rgba(0,0,0,0.35)",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #c4a967 0%, #e1d3b4 50%, #66532c 100%)",
        "gradient-sunrise": "linear-gradient(180deg, rgba(196,169,103,0.15) 0%, transparent 50%)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "dust-float": "dustFloat 20s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        dustFloat: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.4" },
          "50%": { transform: "translate(10px, -20px) scale(1.2)", opacity: "0.7" },
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
