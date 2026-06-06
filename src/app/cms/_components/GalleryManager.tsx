"use client";

import { useState } from "react";
import { cmsApi, type MediaItem } from "@/lib/cms-api";
import { Button } from "./Button";
import { Alert } from "./Alert";
import { MediaPicker } from "./MediaPicker";

export type GalleryItem = { id: string; url: string };

/**
 * Manages a destination's or experience's image gallery. Adds/removes happen
 * immediately against the backend gallery endpoints (each item references a
 * Media Library asset by id). Only usable once the parent item exists (has a slug).
 */
export function GalleryManager({
  kind,
  slug,
  initial,
}: {
  kind: "destination" | "experience";
  slug: string;
  initial: GalleryItem[];
}) {
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const flash = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    if (type === "success") setTimeout(() => setMsg(null), 2000);
  };

  const add = async (media: MediaItem) => {
    setBusy(true);
    try {
      const res = (kind === "destination"
        ? await cmsApi.addDestinationGallery(slug, media.id, items.length)
        : await cmsApi.addExperienceGallery(slug, media.id, items.length)) as { id?: string };
      // Endpoint returns { success, id } (the gallery row id).
      setItems((prev) => [...prev, { id: res?.id ?? media.id, url: media.url }]);
      flash("success", "Image added to gallery.");
    } catch (e) {
      flash("error", e instanceof Error ? e.message : "Failed to add image.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (galleryId: string) => {
    setBusy(true);
    try {
      if (kind === "destination") await cmsApi.removeDestinationGallery(slug, galleryId);
      else await cmsApi.removeExperienceGallery(slug, galleryId);
      setItems((prev) => prev.filter((i) => i.id !== galleryId));
      flash("success", "Image removed.");
    } catch (e) {
      flash("error", e instanceof Error ? e.message : "Failed to remove image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      {msg && <Alert type={msg.type} message={msg.text} onDismiss={() => setMsg(null)} />}

      {items.length === 0 ? (
        <p className="text-xs text-[#8A9990] italic">No gallery images yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl border border-[#EAE4D0] bg-[#0D2218]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(item.id)}
                disabled={busy}
                aria-label="Remove image"
                className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100 disabled:opacity-40"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <Button type="button" variant="secondary" size="sm" onClick={() => setPickerOpen(true)} disabled={busy}>
        + Add image
      </Button>

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={add} type="image" />
    </div>
  );
}
