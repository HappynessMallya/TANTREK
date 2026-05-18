import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { TravelAgencySchema } from "@/components/seo/TravelAgencySchema";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "TANTREK 360 Safaris | Beyond Routes. Beyond Maps.",
    template: "%s | TANTREK 360 Safaris",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  description:
    "TANTREK 360 unites curated safari experiences with business and investment facilitation across Tanzania. End-to-end support for investors, diaspora, entrepreneurs, and global professionals.",
  keywords: [
    "TANTREK 360",
    "Tanzania safari",
    "investment safari Tanzania",
    "business tours Tanzania",
    "diaspora opportunity tours",
    "bush and beach Tanzania",
    "luxury safari Tanzania",
    "Tanzania investment facilitation",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "TANTREK 360 Safaris",
    description:
      "Curated safari experiences for investors, entrepreneurs, and global professionals — combining tourism with real access to Tanzania's opportunities.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "TANTREK 360 Safaris" }],
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
      className={`${poppins.variable} ${inter.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <TravelAgencySchema />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-tantrek-text">
        {children}
      </body>
    </html>
  );
}
