export function TravelAgencySchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "TANTREK 360 Safaris",
    description:
      "TANTREK 360 Safaris unites curated safari journeys with business consultancy and investment facilitation across Tanzania. Built for investors, diaspora, entrepreneurs, and discerning travelers.",
    url: "https://tantreksafari.com",
    email: "info@tantreksafari.com",
    telephone: "+34 637 04 86 15",
    areaServed: [
      { "@type": "Place", name: "Tanzania" },
      { "@type": "Place", name: "Northern Tanzania" },
      { "@type": "Place", name: "Southern Tanzania" },
      { "@type": "Place", name: "Western Tanzania" },
      { "@type": "Place", name: "Serengeti National Park" },
      { "@type": "Place", name: "Ngorongoro Conservation Area" },
      { "@type": "Place", name: "Ruaha National Park" },
      { "@type": "Place", name: "Julius Nyerere National Park" },
      { "@type": "Place", name: "Katavi National Park" },
      { "@type": "Place", name: "Zanzibar" },
    ],
    priceRange: "$$$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
