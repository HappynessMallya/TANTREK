"use client";

import { useCallback, useEffect, useState } from "react";
import { cmsApi, type MediaItem } from "@/lib/cms-api";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { Alert } from "./Alert";

/**
 * Modal that lets an editor pick an image from the Media Library, or upload a
 * new one. Calls `onSelect(media)` with the chosen asset and closes.
 */
export function MediaPicker({
  open,
  onClose,
  onSelect,
  type,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  /** Restrict to one type; omit to show all media. */
  type?: "image" | "video";
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const kindLabel = type ?? "file";

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    cmsApi
      .getMedia(type ? { type, limit: 60 } : { limit: 60 })
      .then((res) => setItems(res.items ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load media."))
      .finally(() => setLoading(false));
  }, [type]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const media = await cmsApi.uploadImage(file, { altText: file.name });
      // New uploads may be PROCESSING; still selectable. Prepend and pick it.
      setItems((prev) => [media, ...prev]);
      onSelect(media);
      onClose();
    } catch (e) {
      setError(
        e instanceof Error
          ? `Upload failed: ${e.message}. (Media uploads require MinIO + Redis to be running.)`
          : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0D2218]/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#EAE4D0] px-6 py-4">
          <div>
            <h3 className="font-display text-base font-semibold text-[#0D2218]">Media Library</h3>
            <p className="text-xs text-[#8A9990]">Pick existing {kindLabel === "file" ? "media" : `${kindLabel}s`} or upload a new image.</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#D5CAAD] bg-white px-3 py-2 text-xs font-medium text-[#0D2218] hover:border-luxury-gold transition-colors">
              {uploading ? <Spinner size="sm" /> : (
                <svg className="h-4 w-4 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v12m0-12l-4 4m4-4l4 4M4 20h16" /></svg>
              )}
              {uploading ? "Uploading…" : "Upload"}
              <input
                type="file"
                accept={type === "video" ? "video/*" : "image/*"}
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                  e.target.value = "";
                }}
              />
            </label>
            <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-[#6A7B70] hover:bg-[#EAE4D0]/70">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && <div className="mb-4"><Alert type="error" message={error} onDismiss={() => setError(null)} /></div>}

          {loading ? (
            <div className="flex h-48 items-center justify-center"><Spinner size="lg" /></div>
          ) : items.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center">
              <p className="text-sm font-medium text-[#0D2218]">No media yet</p>
              <p className="mt-1 text-xs text-[#8A9990] max-w-xs">
                Upload an image with the button above. (Uploads need MinIO + Redis running on the API.)
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { onSelect(m); onClose(); }}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-[#EAE4D0] bg-[#0D2218] focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                  title={m.altText ?? m.id}
                >
                  {m.type === "video" ? (
                    <video src={m.url} muted className="h-full w-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.thumbnailUrl ?? m.url} alt={m.altText ?? ""} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  )}
                  {m.status === "processing" && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-amber-500/90 px-2 py-0.5 text-[9px] font-semibold text-[#0D2218]">processing</span>
                  )}
                  <span className="absolute inset-0 bg-luxury-gold/0 transition-colors group-hover:bg-luxury-gold/10" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-[#EAE4D0] px-6 py-3">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
