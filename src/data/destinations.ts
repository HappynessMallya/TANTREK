export type Circuit = "northern" | "southern" | "western";

export interface Destination {
  slug: string;
  name: string;
  circuit: Circuit;
  tagline: string;
  metaDescription: string;
  highlights: string[];
  bestTime: string;
  luxuryCamps: string[];
  migrationNote?: string;
  /** Optional: e.g. "Short-grass plains, Acacia woodland" for Fast Facts */
  ecosystem?: string;
  /** Optional: e.g. "24°C - 28°C Day / 13°C Night" for Fast Facts */
  avgTemp?: string;
  imageUrl: string;
  internalLinks: { label: string; href: string }[];
}

export const circuits: Record<Circuit, { name: string; slug: string }> = {
  northern: { name: "Northern Circuit", slug: "northern" },
  southern: { name: "Southern Circuit", slug: "southern" },
  western: { name: "Western Circuit", slug: "western" },
};

export const destinations: Destination[] = [
  {
    slug: "serengeti",
    name: "Serengeti National Park",
    circuit: "northern",
    tagline: "The endless plains where the Great Migration writes its story.",
    metaDescription:
      "Luxury safari in Serengeti National Park. Witness the Great Migration, big cats, and endless plains. Best time to visit, luxury camps, and exclusive itineraries.",
    highlights: [
      "Great Migration (wildebeest & zebra)",
      "Big cat capital — lion, leopard, cheetah",
      "Hot-air balloon safaris at dawn",
      "Vast savannah and kopjes",
    ],
    bestTime: "Year-round. Migration: Dec–Jul (Ndutu/Serengeti), Jun–Oct (Mara River).",
    luxuryCamps: ["Four Seasons Safari Lodge", "Singita Grumeti", "andBeyond Serengeti Under Canvas"],
    migrationNote: "The Serengeti is the stage for the Great Migration; timing your visit with river crossings or calving season defines the experience.",
    ecosystem: "Short-grass plains, Acacia woodland",
    avgTemp: "24°C – 28°C day / 13°C night",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
    internalLinks: [
      { label: "Ngorongoro Conservation Area", href: "/destinations/ngorongoro" },
      { label: "Luxury Fly-in Safaris", href: "/experiences/luxury-fly-in" },
    ],
  },
  {
    slug: "ngorongoro",
    name: "Ngorongoro Conservation Area",
    circuit: "northern",
    tagline: "The world’s largest intact volcanic caldera and a wildlife ark.",
    metaDescription:
      "Ngorongoro Crater safari: black rhino, Big Five, and the iconic crater floor. Luxury lodges and best time to visit. TANTREK 360 Safaris.",
    highlights: [
      "Ngorongoro Crater — UNESCO World Heritage",
      "Black rhino and high density of predators",
      "Crater floor game drives",
      "Maasai culture and highland forests",
    ],
    bestTime: "Jun–Oct (dry, clear); Dec–Mar (green, calving). Avoid heavy rains Apr–May.",
    luxuryCamps: ["andBeyond Ngorongoro Crater Lodge", "Singita Ngorongoro House", "The Highlands"],
    imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80",
    internalLinks: [
      { label: "Serengeti National Park", href: "/destinations/serengeti" },
      { label: "Plan Your Safari", href: "/plan-your-safari" },
    ],
  },
  {
    slug: "tarangire",
    name: "Tarangire National Park",
    circuit: "northern",
    tagline: "Elephant country and ancient baobabs.",
    metaDescription:
      "Tarangire safari: elephants, baobabs, and birdlife. Best time to visit, luxury camps. Tanzania luxury safari specialist.",
    highlights: [
      "Large elephant herds",
      "Iconic baobab landscapes",
      "Diverse birdlife (migration season)",
      "Less crowded than Serengeti",
    ],
    bestTime: "Jun–Oct (dry, wildlife at river); Dec–Mar (birds, green).",
    luxuryCamps: ["Tarangire Treetops", "Oliver's Camp", "Kuro Tarangire"],
    imageUrl: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=80",
    internalLinks: [
      { label: "Lake Manyara National Park", href: "/destinations/lake-manyara" },
      { label: "Northern Circuit", href: "/destinations/northern" },
    ],
  },
  {
    slug: "lake-manyara",
    name: "Lake Manyara National Park",
    circuit: "northern",
    tagline: "Tree-climbing lions and flamingo-lined shores.",
    metaDescription:
      "Lake Manyara safari: tree-climbing lions, flamingos, and Rift Valley scenery. Luxury Tanzania safari.",
    highlights: [
      "Tree-climbing lions",
      "Flamingo flocks on the lake",
      "Compact park — ideal 1-day add-on",
      "Rift Valley escarpment views",
    ],
    bestTime: "Jun–Oct (dry); Nov–May (birds, possible wet).",
    luxuryCamps: ["Lake Manyara Tree Lodge", "andBeyond Lake Manyara Tree Lodge"],
    imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1200&q=80",
    internalLinks: [
      { label: "Tarangire National Park", href: "/destinations/tarangire" },
      { label: "Ngorongoro", href: "/destinations/ngorongoro" },
    ],
  },
  {
    slug: "julius-nyerere",
    name: "Julius Nyerere National Park",
    circuit: "southern",
    tagline: "Where the Selous spirit lives—wild, vast, and untamed.",
    metaDescription:
      "Luxury safari in Julius Nyerere National Park (ex-Selous). Southern Tanzania wilderness, walking safaris, boat safaris. Exclusive fly-in safaris.",
    highlights: [
      "Vast wilderness — one of Africa’s largest protected areas",
      "Walking safaris and boat safaris on the Rufiji",
      "Wild dog, elephant, lion — low-density viewing",
      "Former Selous Game Reserve heritage",
    ],
    bestTime: "Jun–Oct (dry, best game); Nov–May (green, birds, some areas wet).",
    luxuryCamps: ["Siwandu", "Rufiji River Camp", "Jongomero-style exclusivity"],
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
    internalLinks: [
      { label: "Ruaha National Park", href: "/destinations/ruaha" },
      { label: "Southern Circuit", href: "/destinations/southern" },
      { label: "Conservation Safaris", href: "/experiences/conservation" },
    ],
  },
  {
    slug: "ruaha",
    name: "Ruaha National Park",
    circuit: "southern",
    tagline: "The soul of Southern Tanzania—baobabs, lions, and the Great Ruaha River.",
    metaDescription:
      "Ruaha luxury safari: Tanzania’s largest park, lion prides, baobabs, fly-in exclusivity. Best time to visit and luxury camps. TANTREK 360.",
    highlights: [
      "Tanzania’s largest national park",
      "Large lion and predator populations",
      "Dramatic baobab and riverine landscapes",
      "Low visitor numbers — true exclusivity",
    ],
    bestTime: "Jun–Oct (dry, wildlife at river); Nov–May (lush, birding).",
    luxuryCamps: ["Jongomero", "Usangu Expedition Camp", "Ikuka Safari Camp"],
    imageUrl: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=80",
    internalLinks: [
      { label: "Julius Nyerere National Park", href: "/destinations/julius-nyerere" },
      { label: "Ruaha Fly-in Safari", href: "/experiences/luxury-fly-in" },
      { label: "Southern Circuit", href: "/destinations/southern" },
    ],
  },
  {
    slug: "katavi",
    name: "Katavi National Park",
    circuit: "western",
    tagline: "Africa’s last true frontier—buffalo herds and remote luxury.",
    metaDescription:
      "Katavi luxury safari: Western Tanzania’s remote wilderness. Buffalo herds, hippo pools, fly-in camps. Exclusive safari with TANTREK 360.",
    highlights: [
      "Extremely remote — fly-in only",
      "Massive buffalo herds and hippo concentrations",
      "Dry-season drama at waterholes",
      "Sense of having the wilderness to yourself",
    ],
    bestTime: "Jun–Oct (dry, peak wildlife at remaining water).",
    luxuryCamps: ["Chada Katavi", "Katavi Wildlife Camp", "Foxes Safari Camp"],
    imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1200&q=80",
    internalLinks: [
      { label: "Western Circuit", href: "/destinations/western" },
      { label: "Luxury Fly-in Safaris", href: "/experiences/luxury-fly-in" },
      { label: "Remote Safari Tanzania", href: "/destinations/ruaha" },
    ],
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function getDestinationsByCircuit(circuit: Circuit): Destination[] {
  return destinations.filter((d) => d.circuit === circuit);
}
