# CMS Dashboard (frontend)

The CMS dashboard is a **lightweight admin UI** under `/cms`. It is **code-split**: dashboard code loads only when you visit `/cms/*`, so the main website bundle stays small and the site is not heavy.

---

## How to use

1. **Run the app:** `npm run dev` (or build and start).
2. **Open the dashboard:** Go to **`/cms`** (redirects to `/cms/dashboard`).
3. **Login:** Placeholder auth: set `NEXT_PUBLIC_CMS_PASSWORD` in `.env.local` (default is `admin`). Backend will replace this with real auth (e.g. JWT).
4. **Connect the API:** Set **`NEXT_PUBLIC_CMS_API_URL`** in `.env.local` to your CMS API base URL (e.g. `https://api.example.com/v1`). Until then, the dashboard shows “API not configured” and forms won’t save.

---

## Routes

| Path | Purpose |
|------|--------|
| `/cms` | Redirects to dashboard (or login if not authenticated). |
| `/cms/login` | Placeholder login (password from env). |
| `/cms/dashboard` | Overview, API status, quick links. |
| `/cms/settings` | Site title, description, contact email, WhatsApp, footer. |
| `/cms/home` | Homepage: hero copy, map heading, etc. |
| `/cms/destinations` | List destinations; link to add/edit. |
| `/cms/destinations/[slug]` | Edit destination (or `new`). |
| `/cms/experiences` | List experiences; add/edit. |
| `/cms/experiences/[slug]` | Edit experience (or `new`). |
| `/cms/journal` | List Safari Journal posts; add/edit. |
| `/cms/journal/[slug]` | Edit post (or `new`). |
| `/cms/about` | About page content. |
| `/cms/sustainability` | Sustainability page content. |
| `/cms/plan-your-safari` | Plan Your Safari page content. |
| `/cms/legal` | Privacy, Terms, Cookies (tabs). |
| `/cms/media` | Upload images or videos (calls POST /media/images or /media/videos). |

---

## Backend integration

- **API client:** All requests go through **`src/lib/cms-api.ts`**. It uses `NEXT_PUBLIC_CMS_API_URL` and the endpoints described in **CMS_BACKEND_API_SPEC.md**.
- **What backend does:** Implement the REST API from the spec. Set CORS so the frontend origin can call the API. When ready, set `NEXT_PUBLIC_CMS_API_URL` (and optionally real auth); the dashboard will then load and save content.
- **Auth:** Dashboard currently stores a simple flag in `sessionStorage` after login. Backend can add a proper login endpoint that returns a JWT; the frontend would send `Authorization: Bearer <token>` on each request (see comment in `cms-api.ts`).

---

## Optimizations

- **No impact on main site:** The `/cms` layout and all dashboard pages live under `src/app/cms/`. They are not imported by the main layout or marketing pages, so the main bundle does not include dashboard code.
- **No extra dependencies:** Dashboard uses existing Tailwind and React; no heavy admin UI library.
- **Metadata:** CMS layout sets `robots: noindex, nofollow` so the dashboard is not indexed.

---

## Env vars (see `.env.example`)

- **`NEXT_PUBLIC_CMS_API_URL`** — Base URL of the CMS API (e.g. `https://api.example.com/v1`). Required for save/load.
- **`NEXT_PUBLIC_CMS_PASSWORD`** — Optional; password for placeholder login. Default `admin` if unset.
