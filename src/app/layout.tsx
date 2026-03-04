import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { TravelAgencySchema } from "@/components/seo/TravelAgencySchema";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Tanzania Wildmakers Safaris | Luxury Safari Southern & Western Tanzania",
    template: "%s | Tanzania Wildmakers Safaris",
  },
  icons: {
    icon: "/favicon.ico",
  },
  description:
    "Crafting wild experiences in Southern and Western Tanzania. Ultra-exclusive luxury safaris in Ruaha, Julius Nyerere, and Katavi. Frontier wilderness redefined.",
  keywords: [
    "luxury safari Tanzania",
    "Southern Tanzania safari",
    "Ruaha safari",
    "Katavi luxury safari",
    "exclusive safari Tanzania",
    "Julius Nyerere National Park",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${manrope.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <TravelAgencySchema />
      </head>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
