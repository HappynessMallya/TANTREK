# Optimization & performance

Best practices and recommendations for production.

---

## Video (hero & map)

### Why production felt “stuck”
**Large video files** (e.g. a 31 MB map) cause longer buffering and can make the map or hero feel stuck. The app now shows a **“Loading map”** state until the map video is ready. You can **keep full 1080p quality** and still reduce file size using WebM or better encoding (see below); if you prefer to keep a larger file for quality, the loading state handles the wait.

### Current setup
- **Hero:** All four slides are kept in the DOM with `preload="auto"` so once a video has loaded it stays in buffer; only the active slide is visible and playing (others are paused). Revisiting a slide uses the existing buffer — no re-download.
- **Map:** The map video element stays mounted when you leave the map phase (hidden + paused). When you return, it’s shown and played from the existing buffer so it doesn’t reload.
- **All videos:** `muted` + `playsInline` for reliable autoplay on mobile; `disablePictureInPicture` and `disableRemotePlayback` to reduce overhead.

### Size vs quality
- **Target:** **&lt; 6–8 MB per file** keeps load times short. If you keep a larger map (e.g. 15–20 MB) to preserve quality, the **“Loading map”** state covers the wait — no need to sacrifice clarity for a number.
- **You can keep quality and still shrink size:** Use the same **1080p resolution** and reduce file size with better encoding, not by lowering resolution.

### Reducing size without compromising quality
1. **Keep 1080p** — don’t drop to 720p; keep the same resolution for a sharp map and hero.
2. **Use WebM (VP9)** — often **30–50% smaller** than H.264 at similar visual quality. Offer `<source src="map.webm">` with `<source type="video/mp4" src="map.mp4">` as fallback.
3. **Re-encode, don’t just re-save** — use a quality-based encode (e.g. FFmpeg with `-crf 23` for H.264 or `-crf 30` for VP9) so the encoder finds savings without obvious loss.
4. **Trim duration only if needed** — shorten the clip only if you’re okay with less runtime; otherwise focus on codec and bitrate.
5. **Tools:** FFmpeg (two-pass VP9 or H.264 CRF) or HandBrake with “Quality” preset instead of a fixed low bitrate.

### If you keep a larger map
Keeping **map.mp4** at 15–30 MB for full quality is fine. The loading spinner will show until enough has buffered to play. For the best of both worlds, add a **WebM version** of the same 1080p map — same look, smaller file — and reference it first in the `<video>` element.

### Hosting
Serve videos from a **CDN** (e.g. Vercel, Cloudflare) so they’re cached at the edge and don’t hit your app server for every request.

### Optional: WebM + MP4
In the hero you can add a `<source>` for WebM and keep `<source type="video/mp4">` as fallback; use the same `preload` and other attributes on the `<video>` element.

---

## Buffer / memo and media best practices

### Videos (buffer retention)
- **Hero:** All hero videos are rendered once and kept in the DOM. The active slide is visible and playing; others are hidden and paused. Buffered data is retained, so when the slideshow loops or returns to a slide, playback starts from buffer instead of re-fetching.
- **Map:** The map `<video>` is never unmounted. When the map phase ends, the component hides and pauses the video; when the user enters the map phase again, it shows and plays from the same element, so the buffer is reused.
- **Retry:** Only the map “Retry” action creates a new video element (new `key`); normal phase changes do not remount.

### Images
- **`next/image`** is used across the app: automatic optimization, lazy loading, and correct `sizes` for responsive layout.
- **Above-the-fold heroes:** Use `priority` so the LCP image is not lazy-loaded and decoding doesn’t block paint. Hero images on key routes (home, destinations, experiences, about, etc.) already use `priority` and `sizes="100vw"` where appropriate.
- **Cards and grids:** Use `sizes` so the browser fetches the right width (e.g. `(max-width: 768px) 100vw, 50vw` for two-column grids). This avoids loading oversized images.
- **External images:** For URLs (e.g. Unsplash), configure `remotePatterns` in `next.config.mjs` and use `next/image` so they are optimized and cached.

### Map (video) optimization
- **Single element, always mounted:** The map is one `<video>` that stays in the DOM; visibility and play state are toggled. This keeps the buffer and avoids re-requesting the file when the user sees the map again.
- **Loading state:** Shown only while the video hasn’t reached a playable state (`canplay`). If the user returns to the map and the video is already buffered (`readyState >= 3`), the loading state is skipped.
- **Preload:** `preload="auto"` so the map video can start loading as soon as the homepage (and thus the map component) is mounted, even before the first map phase.

---

## Scalability & concurrent requests

- **Many requests at once:** The app is built for **Next.js on a platform like Vercel**: each request is handled by serverless functions (or static pages), and **static assets (JS, CSS, images, videos) are served from a global CDN**. So the system can accommodate many concurrent users; limits are set by your hosting plan, not by a single server process.
- **Recommendation:** Keep **large videos on the CDN** (e.g. in `public/` on Vercel so they’re edge-cached). Avoid serving big files through custom API routes so the app server stays fast for HTML and API only.

---

## Stability (won’t crash or get stuck)

- **Map video:** If the map video fails to load (network, 404, etc.), the app shows a message with **Retry** and **Continue** so the user is never stuck on a blank or frozen map. **Continue** returns to the hero and the rest of the site works.
- **React errors:** A root **error boundary** wraps the main content. If any component throws, the app shows “Something went wrong” and a **Reload page** button instead of a white crash screen.

---

## Next.js

- **Strict mode:** Enabled in `next.config.mjs` for safer React usage.
- **Images:** `next/image` is used across the app for automatic optimization and lazy loading.
- **Static assets:** Long-lived cache headers are set for common static extensions (mp4, webm, images, fonts) in `next.config.mjs`.
- **Map component:** `AnimatedTanzaniaMap` is loaded with `next/dynamic` and `ssr: false` so it’s not in the initial server bundle and only loads when the homepage needs it.

---

## Performance tips

1. **LCP:** All hero videos use `preload="auto"` and stay in the DOM, so the first slide loads immediately and later slides reuse their buffer. Optional: `<link rel="preload" href="/tembo.mp4" as="video" type="video/mp4" />` in the home layout can hint the browser to start even earlier.
2. **Fonts:** `next/font` (Playfair, Manrope) with `display: "swap"` is used to avoid layout shift and limit blocking.
3. **Third-party:** Keep external scripts (analytics, chat) lazy-loaded or in a client component that mounts after first paint.
4. **Build:** Run `next build` and fix any bundle or image size warnings; consider `@next/bundle-analyzer` to trim large dependencies.

---

## Production checklist

- [ ] Run `npm run build` and `npm run start` locally before deploy.
- [ ] **Optimize videos:** Prefer WebM (same 1080p quality, smaller size). If you keep a larger map for quality, the loading state handles the wait; no need to compromise resolution.
- [ ] Ensure env vars (if any) are set in the hosting dashboard.
- [ ] Enable gzip/Brotli on the host (often default on Vercel/Netlify).
- [ ] Test on slow 3G and mobile to confirm hero and map videos behave well.
