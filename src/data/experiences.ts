export interface Experience {
  slug: string;
  name: string;
  tagline: string;
  metaDescription: string;
  body: string;
  highlights: string[];
  cta: string;
  internalLinks: { label: string; href: string }[];
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
  },
];

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug);
}
