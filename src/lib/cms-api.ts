/**
 * CMS API client for Tanzania Wildmakers Safari.
 * Base URL configured via NEXT_PUBLIC_CMS_API_URL.
 *
 * Authentication: every protected request automatically includes
 *   Authorization: Bearer <token>
 * Token is managed by the Zustand auth store (src/store/auth-store.ts).
 */

import { getAuthToken, useAuthStore } from "@/store/auth-store";

/** Normalise the base URL: trim whitespace and ensure it starts with http(s):// */
function normaliseBase(raw: string | undefined): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  // Auto-fix common copy-paste mistake: "ttps://" → "https://"
  if (trimmed.startsWith("ttps://")) return "h" + trimmed;
  if (trimmed.startsWith("ttp://")) return "h" + trimmed;
  return trimmed;
}

const BASE = normaliseBase(process.env.NEXT_PUBLIC_CMS_API_URL);

// ─── Token helpers (thin wrappers over the Zustand store) ────────────────────

/** Read the current token — works both inside and outside React components. */
export function getToken(): string | null {
  return getAuthToken();
}

/** Store a token (e.g. after login). Prefer cmsApi.login() over calling this directly. */
export function setToken(token: string): void {
  useAuthStore.getState().setAuth(token, useAuthStore.getState().user ?? { id: "", name: "", email: "", role: "" });
}

/** Clear the token — used on logout and on 401 responses. */
export function clearToken(): void {
  useAuthStore.getState().clearAuth();
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────

/**
 * Build request headers for every API call.
 * ALWAYS includes Authorization: Bearer <token> when a token is present.
 */
function headers(includeJson = true): Record<string, string> {
  const h: Record<string, string> = {};
  if (includeJson) h["Content-Type"] = "application/json";
  const token = getAuthToken(); // reads directly from Zustand store state
  if (token) {
    h["Authorization"] = `Bearer ${token}`;
  }
  return h;
}

/** Unwraps `{ success, data }` envelope; throws with the API error string.
 *  Falls back to returning the whole body if `data` key is absent.
 *  On 401 the token is cleared and the browser is redirected to /cms/login. */
async function handleRes<T>(res: Response): Promise<T> {
  if (!res.ok) {
    // Token is invalid or expired — log the user out and redirect to login
    if (res.status === 401) {
      useAuthStore.getState().clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/cms/login?reason=session_expired";
      }
      throw new Error("Session expired. Please log in again.");
    }
    const body = await res.json().catch(() => ({})) as { error?: string; message?: string };
    throw new Error(body.error ?? body.message ?? `${res.status} ${res.statusText}`);
  }
  const json = await res.json() as { data?: T } & T;
  // Support both `{ data: { ... } }` envelope and bare responses
  return (json.data !== undefined ? json.data : json) as T;
}

/** For 204 No Content deletes — only throws on error. */
async function handleDelete(res: Response): Promise<void> {
  if (res.status === 204 || res.ok) return;
  const body = await res.json().catch(() => ({})) as { error?: string };
  throw new Error(body.error ?? `${res.status} ${res.statusText}`);
}

/** Static page endpoints return `{ slug, title, content: {...}, updatedAt }`.
 *  This unwraps the inner `content` so pages can spread it directly. */
function pageContent<T extends object>(data: { content?: T } | T): T {
  return (data as { content?: T }).content ?? (data as T);
}

const get = (path: string) =>
  fetch(`${BASE}${path}`, { headers: headers() }).then(handleRes);

const patch = (path: string, body: unknown) =>
  fetch(`${BASE}${path}`, { method: "PATCH", headers: headers(), body: JSON.stringify(body) }).then(handleRes);

const post = (path: string, body: unknown) =>
  fetch(`${BASE}${path}`, { method: "POST", headers: headers(), body: JSON.stringify(body) }).then(handleRes);

const put = (path: string, body: unknown) =>
  fetch(`${BASE}${path}`, { method: "PUT", headers: headers(), body: JSON.stringify(body) }).then(handleRes);

const del = (path: string) =>
  fetch(`${BASE}${path}`, { method: "DELETE", headers: headers(false) }).then(handleDelete);

// ─── API surface ──────────────────────────────────────────────────────────────

export const cmsApi = {
  get base() { return BASE; },
  get isConfigured() { return Boolean(BASE); },

  // ── Health ────────────────────────────────────────────────────────────────
  async getHealth() {
    return get("/health") as Promise<{ status: string; timestamp: string; uptime: number; version: string }>;
  },

  // ── Auth ──────────────────────────────────────────────────────────────────
  async login(email: string, password: string) {
    // The API may return the token as `access_token` or `token` depending on version
    const data = await post("/auth/login", { email, password }) as {
      access_token?: string;
      token?: string;
      user: { id: string; name: string; email: string; role: string };
    };
    const jwt = data.access_token ?? data.token ?? "";
    if (!jwt) throw new Error("Login succeeded but no token was returned. Check the API response.");
    // Store token + user in Zustand — persisted to sessionStorage automatically
    useAuthStore.getState().setAuth(jwt, data.user ?? { id: "", name: email, email, role: "admin" });
    return { ...data, access_token: jwt };
  },

  async register(name: string, email: string, password: string) {
    return post("/auth/register", { name, email, password }) as Promise<{
      id: string; name: string; email: string; role: string;
    }>;
  },

  async me() {
    return get("/auth/me") as Promise<{ id: string; name: string; email: string; role: string }>;
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  async getSettings() {
    return get("/settings") as Promise<Record<string, unknown>>;
  },
  async updateSettings(body: Record<string, unknown>) {
    return patch("/settings", body);
  },

  // ── Nav ───────────────────────────────────────────────────────────────────
  async getNav() {
    return get("/nav") as Promise<{ items: Array<{ label: string; href: string }> }>;
  },
  async updateNav(items: Array<{ label: string; href: string }>) {
    return put("/nav", { items });
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  async getFooter() {
    return get("/footer") as Promise<Record<string, unknown>>;
  },
  async updateFooter(body: Record<string, unknown>) {
    return put("/footer", body);
  },

  // ── Hero slides ───────────────────────────────────────────────────────────
  async getHeroSlides() {
    return get("/hero") as Promise<HeroSlide[]>;
  },
  async getAllHeroSlides() {
    return get("/hero/all") as Promise<HeroSlide[]>;
  },
  async createHeroSlide(body: HeroSlideInput) {
    return post("/hero", body) as Promise<HeroSlide>;
  },
  async updateHeroSlide(id: string, body: Partial<HeroSlideInput>) {
    return patch(`/hero/${encodeURIComponent(id)}`, body) as Promise<HeroSlide>;
  },
  async reorderHeroSlides(slides: Array<{ id: string; order: number }>) {
    return patch("/hero/reorder", { slides });
  },
  async deleteHeroSlide(id: string) {
    return del(`/hero/${encodeURIComponent(id)}`);
  },

  // ── Media ─────────────────────────────────────────────────────────────────
  async getMedia(params?: { type?: "image" | "video"; page?: number; limit?: number }) {
    const sp = new URLSearchParams();
    if (params?.type) sp.set("type", params.type);
    if (params?.page) sp.set("page", String(params.page));
    if (params?.limit) sp.set("limit", String(params.limit));
    const q = sp.toString() ? `?${sp}` : "";
    return get(`/media${q}`) as Promise<PaginatedList<MediaItem>>;
  },
  async getMediaById(id: string) {
    return get(`/media/${encodeURIComponent(id)}`) as Promise<MediaItem>;
  },
  async uploadImage(file: File, options?: { altText?: string; usage?: string }) {
    const form = new FormData();
    form.append("file", file);
    if (options?.altText) form.append("altText", options.altText);
    if (options?.usage) form.append("usage", options.usage);
    // Note: do NOT set Content-Type for multipart/form-data — browser sets it with boundary
    const h: Record<string, string> = { Accept: "application/json" };
    const token = getAuthToken(); // always from Zustand store
    if (token) h["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${BASE}/media/images`, { method: "POST", body: form, headers: h });
    return handleRes<MediaItem>(res);
  },
  async uploadVideo(file: File, usage: "hero" | "map") {
    const form = new FormData();
    form.append("file", file);
    form.append("usage", usage);
    const h: Record<string, string> = { Accept: "application/json" };
    const token = getAuthToken(); // always from Zustand store
    if (token) h["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${BASE}/media/videos`, { method: "POST", body: form, headers: h });
    return handleRes<MediaItem>(res);
  },
  async deleteMedia(id: string) {
    return del(`/media/${encodeURIComponent(id)}`);
  },

  // ── Circuits ──────────────────────────────────────────────────────────────
  async getCircuits() {
    return get("/circuits") as Promise<Circuit[]>;
  },
  async getCircuit(slug: string) {
    return get(`/circuits/${encodeURIComponent(slug)}`) as Promise<CircuitDetail>;
  },
  async createCircuit(body: CircuitInput) {
    return post("/circuits", body) as Promise<Circuit>;
  },
  async updateCircuit(slug: string, body: Partial<CircuitInput>) {
    return patch(`/circuits/${encodeURIComponent(slug)}`, body) as Promise<Circuit>;
  },
  async deleteCircuit(slug: string) {
    return del(`/circuits/${encodeURIComponent(slug)}`);
  },

  // ── Destinations ──────────────────────────────────────────────────────────
  async getDestinations(params?: { circuit?: string; featured?: boolean; page?: number; limit?: number }) {
    const sp = new URLSearchParams();
    if (params?.circuit) sp.set("circuit", params.circuit);
    if (params?.featured != null) sp.set("featured", String(params.featured));
    if (params?.page) sp.set("page", String(params.page));
    if (params?.limit) sp.set("limit", String(params.limit));
    const q = sp.toString() ? `?${sp}` : "";
    return get(`/destinations${q}`) as Promise<PaginatedList<DestinationSummary>>;
  },
  async getDestination(slug: string) {
    return get(`/destinations/${encodeURIComponent(slug)}`) as Promise<DestinationDetail>;
  },
  async createDestination(body: Record<string, unknown>) {
    return post("/destinations", body) as Promise<DestinationDetail>;
  },
  async updateDestination(slug: string, body: Record<string, unknown>) {
    return patch(`/destinations/${encodeURIComponent(slug)}`, body) as Promise<DestinationDetail>;
  },
  async deleteDestination(slug: string) {
    return del(`/destinations/${encodeURIComponent(slug)}`);
  },
  async addDestinationGallery(slug: string, mediaId: string, sortOrder?: number) {
    return post(`/destinations/${encodeURIComponent(slug)}/gallery`, { mediaId, sortOrder });
  },
  async removeDestinationGallery(slug: string, galleryId: string) {
    return del(`/destinations/${encodeURIComponent(slug)}/gallery/${encodeURIComponent(galleryId)}`);
  },

  // ── Experiences ───────────────────────────────────────────────────────────
  async getExperiences(params?: { featured?: boolean; page?: number; limit?: number }) {
    const sp = new URLSearchParams();
    if (params?.featured != null) sp.set("featured", String(params.featured));
    if (params?.page) sp.set("page", String(params.page));
    if (params?.limit) sp.set("limit", String(params.limit));
    const q = sp.toString() ? `?${sp}` : "";
    return get(`/experiences${q}`) as Promise<PaginatedList<ExperienceSummary>>;
  },
  async getExperience(slug: string) {
    return get(`/experiences/${encodeURIComponent(slug)}`) as Promise<ExperienceDetail>;
  },
  async createExperience(body: Record<string, unknown>) {
    return post("/experiences", body) as Promise<ExperienceDetail>;
  },
  async updateExperience(slug: string, body: Record<string, unknown>) {
    return patch(`/experiences/${encodeURIComponent(slug)}`, body) as Promise<ExperienceDetail>;
  },
  async deleteExperience(slug: string) {
    return del(`/experiences/${encodeURIComponent(slug)}`);
  },
  async addExperienceGallery(slug: string, mediaId: string, sortOrder?: number) {
    return post(`/experiences/${encodeURIComponent(slug)}/gallery`, { mediaId, sortOrder });
  },
  async removeExperienceGallery(slug: string, galleryId: string) {
    return del(`/experiences/${encodeURIComponent(slug)}/gallery/${encodeURIComponent(galleryId)}`);
  },

  // ── Journal ───────────────────────────────────────────────────────────────
  async getJournalPage() {
    return get("/journal/page") as Promise<{ title: string; intro: string; heroImageId?: string }>;
  },
  async updateJournalPage(body: { title?: string; intro?: string }) {
    return patch("/journal/page", body);
  },
  async getJournalCategories() {
    return get("/journal/categories") as Promise<Array<{ id: string; slug: string; label: string }>>;
  },
  async createJournalCategory(label: string, slug?: string) {
    return post("/journal/categories", { label, slug }) as Promise<{ id: string; slug: string; label: string }>;
  },
  async deleteJournalCategory(id: string) {
    return del(`/journal/categories/${encodeURIComponent(id)}`);
  },
  async getJournalPosts(params?: { page?: number; limit?: number; category?: string; all?: boolean }) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.limit) sp.set("limit", String(params.limit));
    if (params?.category) sp.set("category", params.category);
    if (params?.all) sp.set("all", "true");
    const q = sp.toString() ? `?${sp}` : "";
    return get(`/journal/posts${q}`) as Promise<PaginatedList<JournalPostSummary>>;
  },
  /** Alias kept for existing call-sites */
  async getJournal(params?: { page?: number; limit?: number; category?: string }) {
    return cmsApi.getJournalPosts(params);
  },
  async getJournalPost(slug: string) {
    return get(`/journal/posts/${encodeURIComponent(slug)}`) as Promise<JournalPostDetail>;
  },
  async createJournalPost(body: Record<string, unknown>) {
    return post("/journal/posts", body) as Promise<JournalPostDetail>;
  },
  async updateJournalPost(slug: string, body: Record<string, unknown>) {
    return patch(`/journal/posts/${encodeURIComponent(slug)}`, body) as Promise<JournalPostDetail>;
  },
  async deleteJournalPost(slug: string) {
    return del(`/journal/posts/${encodeURIComponent(slug)}`);
  },

  // ── Static pages ──────────────────────────────────────────────────────────
  async getHome() {
    const d = await get("/home") as { content?: Record<string, unknown> } | Record<string, unknown>;
    return pageContent(d) as Record<string, unknown>;
  },
  async updateHome(body: Record<string, unknown>) {
    return patch("/home", { content: body });
  },

  async getAbout() {
    const d = await get("/about") as { content?: Record<string, unknown> } | Record<string, unknown>;
    return pageContent(d) as Record<string, unknown>;
  },
  async updateAbout(body: Record<string, unknown>) {
    return patch("/about", { content: body });
  },

  async getSustainability() {
    const d = await get("/sustainability") as { content?: Record<string, unknown> } | Record<string, unknown>;
    return pageContent(d) as Record<string, unknown>;
  },
  async updateSustainability(body: Record<string, unknown>) {
    return patch("/sustainability", { content: body });
  },

  async getPlanYourSafari() {
    const d = await get("/plan-your-safari") as { content?: Record<string, unknown> } | Record<string, unknown>;
    return pageContent(d) as Record<string, unknown>;
  },
  async updatePlanYourSafari(body: Record<string, unknown>) {
    return patch("/plan-your-safari", { content: body });
  },

  async getLegal(key: "privacy" | "terms" | "cookies") {
    const d = await get(`/legal/${key}`) as { content?: Record<string, unknown> } | Record<string, unknown>;
    return pageContent(d) as Record<string, unknown>;
  },
  async updateLegal(key: "privacy" | "terms" | "cookies", body: Record<string, unknown>) {
    return patch(`/legal/${key}`, body);
  },

  // ── Inquiries ─────────────────────────────────────────────────────────────
  async getInquiries(params?: { page?: number; limit?: number; status?: "new" | "read" | "replied" }) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.limit) sp.set("limit", String(params.limit));
    if (params?.status) sp.set("status", params.status);
    const q = sp.toString() ? `?${sp}` : "";
    return get(`/inquiries${q}`) as Promise<PaginatedList<Inquiry>>;
  },
  async getInquiry(id: string) {
    return get(`/inquiries/${encodeURIComponent(id)}`) as Promise<Inquiry>;
  },
  async updateInquiryStatus(id: string, status: "new" | "read" | "replied") {
    return patch(`/inquiries/${encodeURIComponent(id)}/status`, { status });
  },
  async deleteInquiry(id: string) {
    return del(`/inquiries/${encodeURIComponent(id)}`);
  },
};

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  largeUrl?: string;
  urlWebM?: string;
  type: "image" | "video";
  mimeType?: string;
  altText?: string;
  usage?: string;
  width?: number;
  height?: number;
  size?: number;
  duration?: number;
  status?: "ready" | "processing";
  createdAt?: string;
}

export interface HeroSlide {
  id: string;
  src: string;
  srcWebM?: string;
  alt: string;
  label?: string;
  order: number;
  isActive: boolean;
  media?: { id: string; url: string; type: string };
}

export interface HeroSlideInput {
  mediaId?: string;
  src?: string;
  srcWebM?: string;
  alt: string;
  label?: string;
  order?: number;
  isActive?: boolean;
}

export interface Circuit {
  id: string;
  slug: string;
  name: string;
  heroTitle?: string;
  heroIntro?: string;
  heroImageUrl?: string;
}

export interface CircuitDetail extends Circuit {
  destinations: DestinationSummary[];
}

export interface CircuitInput {
  name: string;
  slug?: string;
  heroImageUrl?: string;
  heroTitle?: string;
  heroIntro?: string;
}

export interface DestinationSummary {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  shortDescription?: string;
  featured?: boolean;
  heroImage?: { id: string; url: string; altText?: string };
  circuit?: { id: string; slug: string; name: string };
}

export interface DestinationDetail extends DestinationSummary {
  fullDescription?: string;
  highlights?: string[];
  bestTime?: string;
  luxuryCamps?: string[];
  mapLat?: number;
  mapLng?: number;
  wildlife?: string;
  ecosystem?: string;
  gallery?: Array<{ id: string; sortOrder: number; media: { url: string } }>;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ExperienceSummary {
  id: string;
  slug: string;
  name: string;
  eyebrow?: string;
  tagline?: string;
  durationDays?: number;
  priceRange?: string;
  featured?: boolean;
  heroImage?: { url: string };
  destinations?: Array<{ slug: string; name: string }>;
}

export interface ExperienceDetail extends ExperienceSummary {
  body?: string;
  highlights?: string[];
  cta?: string;
  gallery?: Array<{ id: string; sortOrder: number; media: { url: string } }>;
  seoTitle?: string;
  seoDescription?: string;
}

export interface JournalPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  author?: string;
  readTime?: string;
  published?: boolean;
  publishedAt?: string;
  category?: { slug: string; label: string };
  featuredImage?: { url: string; altText?: string };
}

export interface JournalPostDetail extends JournalPostSummary {
  body?: string;
  seoTitle?: string;
  metaDescription?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  travelDates?: string;
  guests?: number;
  status: "new" | "read" | "replied";
  createdAt: string;
}
