import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { ContactUsBanner } from "@/components/ContactUsBanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
      <ContactUsBanner />
      <WhatsAppFloat />
    </>
  );
}
