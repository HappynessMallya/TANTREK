/**
 * Public API client for the TANTREK 360 Safaris public website.
 *
 * - No authentication required (read-only public endpoints).
 * - Works in both server components (ISR revalidation) and client components (useEffect).
 * - Every function returns `null` on error — callers fall back to static data.
 * - Cache: 30-second ISR. Changes made in the CMS appear on the public site within 30 s.
 */

const BASE = (process.env.NEXT_PUBLIC_CMS_API_URL ?? "").trim().replace(/\/$/, "");

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HomeContent {
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSubhead?: string;
  heroCtaPrimary?: string;
  heroCtaPrimaryHref?: string;
  heroCtaSecondary?: string;
  heroCtaSecondaryHref?: string;
  mapHeading?: string;
  mapVideoUrl?: string;
  mapVideoWebM?: string;
  sanctuariesEyebrow?: string;
  sanctuariesTitle?: string;
  sanctuariesBody?: string;
  ourStoryQuote?: string;
  ourStoryBody?: string;
  ourStoryBgImage?: string;
  finalCtaEyebrow?: string;
  finalCtaHeadline?: string;
  finalCtaSubcopy?: string;
  finalCtaButtonLabel?: string;
  finalCtaButtonHref?: string;
  finalCtaSecondaryLabel?: string;
  finalCtaSecondaryHref?: string;
  finalCtaReassurance?: string;

  // ── Lower homepage sections (nested objects — matches the backend seed) ────
  brandStatement?: { eyebrow?: string; pullquote?: string; body1?: string; body2?: string };

  signatureJourneys?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: Array<{ slug?: string; eyebrow?: string; title: string; blurb?: string; href?: string; image?: string }>;
  };

  featuredCircuits?: Array<{ title: string; pullQuote?: string; body?: string; href?: string; image?: string; meta?: string }>;

  whyTravel?: {
    eyebrow?: string;
    heading?: string;
    items?: Array<{ number?: string; title: string; body: string }>;
  };

  accommodations?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: Array<{ name: string; region?: string; blurb?: string; image?: string }>;
  };

  seasons?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: Array<{ months?: string; title: string; body: string }>;
  };

  testimonials?: {
    eyebrow?: string;
    heading?: string;
    items?: Array<{ quote: string; name: string; trip?: string; initials?: string }>;
  };

  impactStats?: Array<{ value: string; label: string }>;

  conservation?: { eyebrow?: string; whereItGoes?: string; whoWeWorkWith?: string };
}

export interface HeroSlide {
  id: string;
  src: string;
  srcWebM?: string;
  alt?: string;
  order: number;
  isActive: boolean;
}

export interface DestinationItem {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  heroImage?: { url: string; altText?: string };
  circuit?: { slug: string; name: string };
  isFeatured?: boolean;
}

export interface DestinationDetail extends DestinationItem {
  description?: string;
  body?: string;
  highlights?: string[];
  gallery?: Array<{ url: string; altText?: string }>;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ExperienceItem {
  id: string;
  slug: string;
  title?: string;
  name?: string;
  eyebrow?: string;
  description?: string;
  tagline?: string;
  heroImage?: { url: string; altText?: string };
  imageUrl?: string;
  durationDays?: number;
  isFeatured?: boolean;
}

export interface ExperienceDetail extends ExperienceItem {
  body?: string;
  highlights?: string[];
  gallery?: Array<{ url: string; altText?: string }>;
  metaTitle?: string;
  metaDescription?: string;
}

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  heroImage?: { url: string; altText?: string };
  category?: { slug: string; label: string };
  readTime?: number;
  publishedAt?: string;
  author?: string;
}

export interface LinkItem { label: string; href: string; }

export interface AboutContent {
  heroEyebrow?: string;
  heroImage?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  foundationEyebrow?: string;
  foundationHeadline?: string;
  storyBody?: string;
  foundationTags?: string[];
  foundationImage?: string;
  commitmentsEyebrow?: string;
  commitmentsHeadline?: string;
  commitmentsIntro?: string;
  commitments?: Array<{ number?: string; title: string; body: string }>;
  teamEyebrow?: string;
  teamHeadline?: string;
  teamIntro?: string;
  team?: Array<{ name: string; role: string; imageUrl: string; alt?: string }>;
  teamNote?: string;
  testimonials?: Array<{ quote: string; name: string; location?: string }>;
  founderQuote?: string;
  founderName?: string;
  founderTitle?: string;
  founderImage?: string;
  ctaEyebrow?: string;
  ctaHeadline?: string;
  ctaBody?: string;
  // legacy flat values (kept for back-compat with older CMS payloads)
  valuesTitle?: string;
  value1Title?: string; value1Body?: string;
  value2Title?: string; value2Body?: string;
  value3Title?: string; value3Body?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface SustainabilityContent {
  heroEyebrow?: string;
  heroImage?: string;
  headline?: string;
  subheadline?: string;
  intro?: string;
  commitmentsEyebrow?: string;
  commitmentsHeadline?: string;
  fieldQuote?: string;
  pillars?: Array<{ number?: string; title: string; body: string; cta?: string; href?: string }>;
  statsEyebrow?: string;
  statsHeadline?: string;
  stats?: Array<{ value: string; label: string }>;
  statsNote?: string;
  ctaEyebrow?: string;
  ctaHeadline?: string;
  ctaBody?: string;
  // legacy flat values
  pillar1Title?: string; pillar1Body?: string;
  pillar2Title?: string; pillar2Body?: string;
  pillar3Title?: string; pillar3Body?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface PlanContent {
  heroEyebrow?: string;
  heroImage?: string;
  heroHeadline?: string;
  heroSubhead?: string;
  steps?: Array<{ step?: string; title: string; body: string }>;
  formHeadline?: string;
  formSubtext?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface SiteSettings {
  siteTitle?: string;
  siteDescription?: string;
  logo?: string;
  logoAlt?: string;
  ogImage?: string;
  contactEmail?: string;
  phone?: string;
  whatsappNumber?: string;
  officeAddress?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
}

export interface FooterContent {
  brandTagline?: string;
  brandDescription?: string;
  brandSubline?: string;
  destinationSections?: Array<{ heading: string; links: LinkItem[] }>;
  servicesLinks?: LinkItem[];
  companyLinks?: LinkItem[];
  getInTouch?: {
    location?: string;
    whatsappLabel?: string;
    whatsappUrl?: string;
    email?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
  newsletter?: { heading?: string; copy?: string; placeholder?: string; buttonLabel?: string };
  legalLinks?: LinkItem[];
}

export interface NavContent {
  items?: Array<{ label: string; href?: string; type?: string }>;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface LegalContent {
  title?: string;
  body?: string;
  metaDescription?: string;
}

export interface CircuitContent {
  slug: string;
  name: string;
  heroTitle?: string;
  heroIntro?: string;
  heroImageUrl?: string;
  destinations?: DestinationItem[];
}

// ─── Core fetch helper ────────────────────────────────────────────────────────

async function get<T>(path: string): Promise<T | null> {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate: 30 },   // 30-second ISR — changes visible within 30 s
    });
    if (!res.ok) return null;
    const json = await res.json() as { data?: T; content?: T } & T;
    // Handle all response shapes: { data: ... }, { content: ... }, or bare object
    if (json.content !== undefined) return json.content as T;
    if (json.data !== undefined) return json.data as T;
    return json as T;
  } catch {
    return null;
  }
}

async function getList<T>(path: string): Promise<T[] | null> {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}${path}`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    const json = await res.json() as { data?: { items?: T[] } | T[]; items?: T[] } | T[];
    // Handle { data: { items: [] } }, { items: [] }, { data: [] }, or bare []
    if (Array.isArray(json)) return json;
    const inner = (json as { data?: unknown }).data;
    if (Array.isArray(inner)) return inner as T[];
    if (inner && typeof inner === "object" && "items" in inner) return (inner as { items: T[] }).items;
    if ("items" in (json as object)) return (json as { items: T[] }).items;
    return null;
  } catch {
    return null;
  }
}

// ─── Public API surface ───────────────────────────────────────────────────────

export const publicApi = {
  get configured() { return Boolean(BASE); },

  // ── Homepage content ───────────────────────────────────────────────────────
  getHomeContent: () => get<HomeContent>("/home"),

  // ── Hero slides ────────────────────────────────────────────────────────────
  getHeroSlides: () => getList<HeroSlide>("/hero"),

  // ── Destinations ──────────────────────────────────────────────────────────
  async getDestinations(params?: { circuit?: string; limit?: number }): Promise<DestinationItem[] | null> {
    const sp = new URLSearchParams();
    if (params?.circuit) sp.set("circuit", params.circuit);
    sp.set("limit", String(params?.limit ?? 50));
    return getList<DestinationItem>(`/destinations?${sp}`);
  },
  getDestination: (slug: string) => get<DestinationDetail>(`/destinations/${encodeURIComponent(slug)}`),

  // ── Experiences ────────────────────────────────────────────────────────────
  async getExperiences(params?: { limit?: number }): Promise<ExperienceItem[] | null> {
    const sp = new URLSearchParams();
    sp.set("limit", String(params?.limit ?? 50));
    return getList<ExperienceItem>(`/experiences?${sp}`);
  },
  getExperience: (slug: string) => get<ExperienceDetail>(`/experiences/${encodeURIComponent(slug)}`),

  // ── Journal ────────────────────────────────────────────────────────────────
  async getJournalPosts(params?: { category?: string; limit?: number }): Promise<JournalPost[] | null> {
    const sp = new URLSearchParams();
    if (params?.category) sp.set("category", params.category);
    sp.set("limit", String(params?.limit ?? 50));
    return getList<JournalPost>(`/journal/posts?${sp}`);
  },
  getJournalPost: (slug: string) => get<JournalPost>(`/journal/posts/${encodeURIComponent(slug)}`),

  // ── Static pages ───────────────────────────────────────────────────────────
  getAbout: () => get<AboutContent>("/about"),
  getSustainability: () => get<SustainabilityContent>("/sustainability"),
  getPlanYourSafari: () => get<PlanContent>("/plan-your-safari"),

  // ── Global: settings / footer / nav ─────────────────────────────────────────
  getSettings: () => get<SiteSettings>("/settings"),
  getFooter: () => get<FooterContent>("/footer"),
  getNav: () => get<NavContent>("/nav"),

  // ── Legal ────────────────────────────────────────────────────────────────────
  getLegal: (key: "privacy" | "terms" | "cookies") => get<LegalContent>(`/legal/${key}`),

  // ── Circuits ──────────────────────────────────────────────────────────────────
  getCircuit: (slug: string) => get<CircuitContent>(`/circuits/${encodeURIComponent(slug)}`),

  // ── Inquiry submission (Plan Your Safari form) ─────────────────────────────
  async submitInquiry(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    travelDates?: string;
    groupSize?: string;
    budget?: string;
  }): Promise<{ success: boolean; message?: string }> {
    if (!BASE) return { success: false, message: "API not configured." };
    try {
      const res = await fetch(`${BASE}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        return { success: false, message: err.error ?? "Submission failed. Please try again." };
      }
      return { success: true };
    } catch {
      return { success: false, message: "Network error. Please check your connection." };
    }
  },
};
