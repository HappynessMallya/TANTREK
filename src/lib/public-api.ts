/**
 * Public API client for the Tanzania Wildmakers Safari public website.
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
  finalCtaHeadline?: string;
  finalCtaSubcopy?: string;
  finalCtaButtonLabel?: string;
  finalCtaButtonHref?: string;
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

export interface AboutContent {
  heroImage?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  storyBody?: string;
  founderName?: string;
  founderTitle?: string;
  founderQuote?: string;
  founderImage?: string;
  valuesTitle?: string;
  value1Title?: string; value1Body?: string;
  value2Title?: string; value2Body?: string;
  value3Title?: string; value3Body?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface SustainabilityContent {
  heroImage?: string;
  headline?: string;
  subheadline?: string;
  intro?: string;
  pillar1Title?: string; pillar1Body?: string;
  pillar2Title?: string; pillar2Body?: string;
  pillar3Title?: string; pillar3Body?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface PlanContent {
  heroImage?: string;
  eyebrow?: string;
  headline?: string;
  intro?: string;
  step1Title?: string; step1Body?: string;
  step2Title?: string; step2Body?: string;
  step3Title?: string; step3Body?: string;
  formHeadline?: string;
  formSubtext?: string;
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
