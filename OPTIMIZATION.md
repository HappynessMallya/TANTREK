# Optimization & performance

Best practices and recommendations for production.

---

## Video (hero & map)

### Current setup
- **Hero:** First slide (`tembo.mp4`) uses `preload="auto"`; other slides use `preload="metadata"` so only the visible video loads fully.
- **Map:** `preload="metadata"` so the map video loads when the map phase is shown.
- **All videos:** `muted` + `playsInline` for reliable autoplay on mobile; `disablePictureInPicture` and `disableRemotePlayback` to reduce overhead.

### Recommendations for video files
1. **Resolution:** Export at **1080p** for web; avoid 4K in the browser.
2. **Format:** Prefer **WebM** (with MP4 fallback) for smaller size and better compression.
3. **Size:** Aim for **&lt; 6–8 MB per file** so hero and map load quickly.
4. **Hosting:** Serve videos from a CDN (e.g. Vercel, Cloudflare) for faster delivery.

### Optional: WebM + MP4
In the hero you can add a `<source>` for WebM and keep `<source type="video/mp4">` as fallback; use the same `preload` and other attributes on the `<video>` element.

---

## Next.js

- **Strict mode:** Enabled in `next.config.mjs` for safer React usage.
- **Images:** `next/image` is used across the app for automatic optimization and lazy loading.
- **Static assets:** Long-lived cache headers are set for common static extensions (mp4, webm, images, fonts) in `next.config.mjs`.
- **Map component:** `AnimatedTanzaniaMap` is loaded with `next/dynamic` and `ssr: false` so it’s not in the initial server bundle and only loads when the homepage needs it.

---

## Performance tips

1. **LCP:** The first hero slide uses `preload="auto"` so the browser starts loading it as soon as the homepage mounts. For stronger LCP on the homepage only, you can add `<link rel="preload" href="/tembo.mp4" as="video" type="video/mp4" />` in a layout that wraps only the home route.
2. **Fonts:** `next/font` (Playfair, Manrope) with `display: "swap"` is used to avoid layout shift and limit blocking.
3. **Third-party:** Keep external scripts (analytics, chat) lazy-loaded or in a client component that mounts after first paint.
4. **Build:** Run `next build` and fix any bundle or image size warnings; consider `@next/bundle-analyzer` to trim large dependencies.

---

## Production checklist

- [ ] Run `npm run build` and `npm run start` locally before deploy.
- [ ] Compress video assets (1080p, WebM or optimized MP4, &lt; 8 MB each).
- [ ] Ensure env vars (if any) are set in the hosting dashboard.
- [ ] Enable gzip/Brotli on the host (often default on Vercel/Netlify).
- [ ] Test on slow 3G and mobile to confirm hero and map videos behave well.
