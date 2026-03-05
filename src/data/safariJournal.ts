export const JOURNAL_CATEGORIES = [
  { slug: "safari-planning", label: "Safari Planning" },
  { slug: "wildlife-encounters", label: "Wildlife Encounters" },
  { slug: "destination-guides", label: "Destination Guides" },
  { slug: "conservation-stories", label: "Conservation Stories" },
  { slug: "travel-inspiration", label: "Travel Inspiration" },
] as const;

export type JournalCategorySlug = (typeof JOURNAL_CATEGORIES)[number]["slug"];

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  category: JournalCategorySlug;
  image: string;
  imageAlt: string;
  readTime?: string;
}

export const JOURNAL_POSTS: JournalPost[] = [
  {
    slug: "best-time-to-visit-serengeti",
    title: "Best Time to Visit Serengeti National Park",
    excerpt:
      "From the Great Migration river crossings to calving season and the green plains—when to go for wildlife, weather, and solitude.",
    category: "destination-guides",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
    imageAlt: "Serengeti savannah and acacia",
    readTime: "6 min read",
  },
  {
    slug: "hidden-safari-routes-ruaha",
    title: "Hidden Safari Routes in Ruaha National Park",
    excerpt:
      "Beyond the main circuits: lesser-known valleys, fly-camp trails, and the secret corners where Ruaha feels entirely yours.",
    category: "destination-guides",
    image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1200&q=80",
    imageAlt: "Ruaha wilderness",
    readTime: "8 min read",
  },
  {
    slug: "remote-wilderness-katavi",
    title: "Remote Wilderness Experiences in Katavi National Park",
    excerpt:
      "Buffalo in the thousands, hippo pools at arm's length, and the feeling of having Africa to yourself. Why Katavi remains the last frontier.",
    category: "travel-inspiration",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80",
    imageAlt: "Katavi landscape",
    readTime: "7 min read",
  },
  {
    slug: "great-migration-calendar",
    title: "The Great Migration: A Month-by-Month Guide",
    excerpt:
      "Where the herds are each season—Serengeti, Masai Mara, and the best camps for witnessing the world's greatest wildlife spectacle.",
    category: "safari-planning",
    image: "/wild.jpg",
    imageAlt: "Wildebeest migration",
    readTime: "10 min read",
  },
  {
    slug: "lion-pride-dynamics",
    title: "Understanding Lion Pride Dynamics on Safari",
    excerpt:
      "How to read the savannah's most iconic predator—territory, hunting, and the moments that make for unforgettable sightings.",
    category: "wildlife-encounters",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80",
    imageAlt: "Lion in golden grass",
    readTime: "5 min read",
  },
  {
    slug: "community-conservation-tanzania",
    title: "Community and Conservation in Tanzania's Frontier Parks",
    excerpt:
      "How local partnerships are protecting Ruaha, Katavi, and the Selous—and how your safari supports the people who guard the wild.",
    category: "conservation-stories",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    imageAlt: "Conservation landscape",
    readTime: "9 min read",
  },
];
