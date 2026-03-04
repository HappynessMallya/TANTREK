export function TravelAgencySchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Tanzania Wildmakers Safaris",
    description:
      "Luxury safari specialist crafting wild experiences in Southern and Western Tanzania. Frontier wilderness, exclusive camps, conservation-driven journeys.",
    url: "https://tanzaniawildmakers.com",
    areaServed: [
      { "@type": "Place", name: "Southern Tanzania" },
      { "@type": "Place", name: "Western Tanzania" },
      { "@type": "Place", name: "Ruaha National Park" },
      { "@type": "Place", name: "Julius Nyerere National Park" },
      { "@type": "Place", name: "Katavi National Park" },
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
