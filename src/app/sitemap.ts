import { MetadataRoute } from "next";
import { destinations } from "@/data/destinations";
import { experiences } from "@/data/experiences";

const BASE = "https://tantreksafari.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/sustainability`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/plan-your-safari`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/destinations/northern`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/destinations/southern`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/destinations/western`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const destinationPages: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${BASE}/destinations/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const experiencePages: MetadataRoute.Sitemap = experiences.map((e) => ({
    url: `${BASE}/experiences/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...destinationPages, ...experiencePages];
}
