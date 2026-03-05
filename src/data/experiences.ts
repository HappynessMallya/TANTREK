export interface Experience {
  slug: string;
  name: string;
  tagline: string;
  metaDescription: string;
  body: string;
  highlights: string[];
  cta: string;
  internalLinks: { label: string; href: string }[];
  /** Optional: for hero and featured image on detail page */
  imageUrl?: string;
  /** Optional: eyebrow text above title (e.g. "Ultra-Luxury Aviation") */
  eyebrow?: string;
}

export const experiences: Experience[] = [
  {
    slug: "luxury-fly-in",
    name: "Luxury Fly-in Safaris",
    tagline: "From airstrip to wilderness—no highways, only sky and savannah.",
    metaDescription:
      "Luxury fly-in safari Tanzania: private charters to Ruaha, Katavi, Julius Nyerere. Exclusive camps, minimal road travel. Tanzania Wildmakers Safaris.",
    body: "Skip the long drives. Our fly-in safaris connect you by light aircraft to remote airstrips—Ruaha, Katavi, Julius Nyerere—where luxury camps and private guiding await. Maximum time in the wild, minimum time on the road. Ideal for high-net-worth travelers and short windows.",
    highlights: [
      "Private or shared charter flights",
      "Direct access to Southern & Western parks",
      "Combined circuits (e.g. Ruaha + Katavi)",
      "Seamless camp-to-camp logistics",
    ],
    cta: "Plan your fly-in safari",
    internalLinks: [
      { label: "Ruaha National Park", href: "/destinations/ruaha" },
      { label: "Katavi National Park", href: "/destinations/katavi" },
      { label: "Julius Nyerere National Park", href: "/destinations/julius-nyerere" },
    ],
    eyebrow: "Ultra-Luxury Aviation",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
  },
  {
    slug: "honeymoon",
    name: "Honeymoon Safaris",
    tagline: "Private wilderness and romance—no crowds, only the two of you.",
    metaDescription:
      "Luxury honeymoon safari Tanzania: private camps, romantic bush dinners, Southern and Western Tanzania. Tanzania Wildmakers Safaris.",
    body: "Honeymoon safaris with us mean private vehicles, intimate camps, and moments designed for two—sundowners in the bush, candlelit dinners under the stars, and the silence of remote parks. We focus on Southern and Western Tanzania for true seclusion.",
    highlights: [
      "Private vehicle and guide",
      "Intimate camps and bush dinners",
      "Combination with Zanzibar possible",
      "Flexible dates and pacing",
    ],
    cta: "Plan your honeymoon safari",
    internalLinks: [
      { label: "Ruaha National Park", href: "/destinations/ruaha" },
      { label: "Plan Your Safari", href: "/plan-your-safari" },
    ],
    eyebrow: "Heritage & Romance",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80",
  },
  {
    slug: "photographic",
    name: "Photographic Expeditions",
    tagline: "Designed for the lens—light, timing, and the right vehicle.",
    metaDescription:
      "Photographic safari Tanzania: specialist guides, bean bags, prime light. Ruaha, Serengeti, Katavi. Tanzania Wildmakers Safaris.",
    body: "Our photographic expeditions are built around light, behavior, and access. We use vehicles equipped for photographers, work with guides who understand positioning and patience, and prioritize golden hour and low-density areas so you get the shot—not the crowd.",
    highlights: [
      "Photographer-friendly vehicles",
      "Guides who understand composition and behavior",
      "Golden hour and seasonal highlights",
      "Optional post-processing or print options",
    ],
    cta: "Plan your photographic safari",
    internalLinks: [
      { label: "Serengeti National Park", href: "/destinations/serengeti" },
      { label: "Ruaha National Park", href: "/destinations/ruaha" },
      { label: "Katavi National Park", href: "/destinations/katavi" },
    ],
    eyebrow: "Designed for the Lens",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
  },
  {
    slug: "conservation",
    name: "Conservation Safaris",
    tagline: "Travel that gives back—partnerships, research, and community.",
    metaDescription:
      "Conservation safari Tanzania: low-density tourism, wildlife research, community partnerships. Tanzania Wildmakers Safaris.",
    body: "Conservation safaris connect you with the people and projects protecting Tanzania’s wilderness. Visit community conservancies, learn from researchers, and stay at camps that channel revenue into anti-poaching and habitat protection. Luxury that leaves a positive footprint.",
    highlights: [
      "Visits to conservation projects",
      "Community partnerships and cultural exchange",
      "Camps with strong conservation mandates",
      "Optional contributions to named initiatives",
    ],
    cta: "Plan your conservation safari",
    internalLinks: [
      { label: "Sustainability", href: "/sustainability" },
      { label: "Julius Nyerere National Park", href: "/destinations/julius-nyerere" },
      { label: "Ruaha National Park", href: "/destinations/ruaha" },
    ],
    eyebrow: "Legacy & Impact",
    imageUrl: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&q=80",
  },
  {
    slug: "corporate",
    name: "Corporate Incentives",
    tagline: "Reward your team with the ultimate frontier—exclusive and unforgettable.",
    metaDescription:
      "Corporate incentive safari Tanzania: exclusive camps, teambuilding, luxury. Southern and Western Tanzania. Tanzania Wildmakers Safaris.",
    body: "Corporate groups deserve the same exclusivity we offer private travelers. We design incentive safaris with dedicated vehicles, private camps or camp buyouts, and activities that blend adventure with refinement—perfect for senior teams and top performers.",
    highlights: [
      "Dedicated vehicles and guides",
      "Camp buyouts or private areas",
      "Bush dinners and sundowner events",
      "Flexible group sizes and dates",
    ],
    cta: "Plan your corporate safari",
    internalLinks: [
      { label: "Plan Your Safari", href: "/plan-your-safari" },
      { label: "Luxury Fly-in Safaris", href: "/experiences/luxury-fly-in" },
    ],
    eyebrow: "Exclusive & Unforgettable",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
  },
];

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug);
}
