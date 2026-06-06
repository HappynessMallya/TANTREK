"use client";

import { useEffect, useState } from "react";
import { cmsApi, type HeroSlide } from "@/lib/cms-api";
import { PageHeader } from "../_components/PageHeader";
import { Field } from "../_components/Field";
import { Input } from "../_components/Input";
import { Button } from "../_components/Button";
import { Alert } from "../_components/Alert";
import { Toggle } from "../_components/Toggle";
import { PageLoader } from "../_components/Spinner";
import { EmptyState } from "../_components/EmptyState";
import { MediaLibraryHint } from "../_components/SectionSaveCard";
import { MediaPicker } from "../_components/MediaPicker";
import type { MediaItem } from "@/lib/cms-api";

type Draft = { src: string; srcWebM: string; alt: string; label: string; isActive: boolean };

const EMPTY_DRAFT: Draft = { src: "", srcWebM: "", alt: "", label: "", isActive: true };

export default function CmsHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Choosing an existing asset from the Media Library fills the draft.
  const pickFromLibrary = (media: MediaItem) => {
    setDraft((d) => ({
      ...d,
      src: media.url,
      srcWebM: media.urlWebM ?? d.srcWebM,
      alt: d.alt || media.altText || "",
    }));
  };

  const load = () =>
    cmsApi
      .getAllHeroSlides()
      .then((list) => {
        setSlides([...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
        setLoading(false);
      })
      .catch((e) => {
        setMsg({ type: "error", text: e instanceof Error ? e.message : "Failed to load slides." });
        setLoading(false);
      });

  useEffect(() => {
    if (!cmsApi.isConfigured) {
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flash = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    if (type === "success") setTimeout(() => setMsg(null), 2500);
  };

  // ── Add a new slide ─────────────────────────────────────────────────────────
  const addSlide = async () => {
    if (!draft.src.trim() || !draft.alt.trim()) {
      flash("error", "A media URL and alt text are required.");
      return;
    }
    setAdding(true);
    try {
      await cmsApi.createHeroSlide({
        src: draft.src.trim(),
        srcWebM: draft.srcWebM.trim() || undefined,
        alt: draft.alt.trim(),
        label: draft.label.trim() || undefined,
        order: slides.length,
        isActive: draft.isActive,
      });
      setDraft(EMPTY_DRAFT);
      await load();
      flash("success", "Slide added.");
    } catch (e) {
      flash("error", e instanceof Error ? e.message : "Failed to add slide.");
    } finally {
      setAdding(false);
    }
  };

  // Upload a video file straight into the draft's src.
  const uploadDraftVideo = async (file: File) => {
    setUploading(true);
    try {
      const media = await cmsApi.uploadVideo(file, "hero");
      setDraft((d) => ({ ...d, src: media.url, alt: d.alt || file.name }));
      flash("success", "Video uploaded — URL filled in.");
    } catch (e) {
      flash("error", e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // ── Per-slide actions ────────────────────────────────────────────────────────
  const patchSlide = async (id: string, body: Partial<HeroSlide>) => {
    try {
      await cmsApi.updateHeroSlide(id, body);
      setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...body } : s)));
      flash("success", "Slide saved.");
    } catch (e) {
      flash("error", e instanceof Error ? e.message : "Save failed.");
    }
  };

  const removeSlide = async (id: string) => {
    if (!window.confirm("Delete this slide? This cannot be undone.")) return;
    try {
      await cmsApi.deleteHeroSlide(id);
      setSlides((prev) => prev.filter((s) => s.id !== id));
      flash("success", "Slide deleted.");
    } catch (e) {
      flash("error", e instanceof Error ? e.message : "Delete failed.");
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= slides.length) return;
    const reordered = [...slides];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    setSlides(reordered);
    try {
      await cmsApi.reorderHeroSlides(reordered.map((s, i) => ({ id: s.id, order: i })));
    } catch (e) {
      flash("error", e instanceof Error ? e.message : "Reorder failed.");
      load();
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <PageHeader
        title="Hero Slides"
        description="The full-screen video/image carousel at the top of the homepage. Order matters — the slideshow plays top to bottom."
      />

      {!cmsApi.isConfigured && (
        <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to manage hero slides." />
      )}
      {msg && <Alert type={msg.type} message={msg.text} onDismiss={() => setMsg(null)} />}

      {/* ── Add new slide ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#EAE4D0] bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EAE4D0] bg-[#FDFCF9]">
          <h3 className="font-display text-base font-semibold text-[#0D2218]">Add a slide</h3>
          <p className="mt-0.5 text-xs text-[#8A9990]">
            Upload a video (or paste a URL from the Media Library), then add a caption.
          </p>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Media URL (mp4 or image)" required hint={<MediaLibraryHint />}>
              <Input
                value={draft.src}
                onChange={(e) => setDraft({ ...draft, src: e.target.value })}
                placeholder="https://minio.tantrek360safaris.com/cms-media/…"
              />
            </Field>
            <Field label="WebM URL (optional)" hint="Smaller file for supported browsers.">
              <Input
                value={draft.srcWebM}
                onChange={(e) => setDraft({ ...draft, srcWebM: e.target.value })}
                placeholder="https://…/clip.webm"
              />
            </Field>
            <Field label="Alt text" required hint="Describes the clip for accessibility/SEO.">
              <Input
                value={draft.alt}
                onChange={(e) => setDraft({ ...draft, alt: e.target.value })}
                placeholder="Tarangire elephants at dawn"
              />
            </Field>
            <Field label="Caption label" hint="Small overlay caption, e.g. 'Tarangire · First Light'.">
              <Input
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                placeholder="Tarangire · First Light"
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#D5CAAD] bg-white px-4 py-2 text-sm text-[#0D2218] hover:border-luxury-gold transition-colors">
              <svg className="h-4 w-4 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {uploading ? "Uploading…" : "Upload video"}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                disabled={uploading || !cmsApi.isConfigured}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadDraftVideo(f);
                  e.target.value = "";
                }}
              />
            </label>
            <Button type="button" variant="secondary" onClick={() => setPickerOpen(true)} disabled={!cmsApi.isConfigured}>
              Choose from Library
            </Button>
            <Button type="button" onClick={addSlide} loading={adding} disabled={!cmsApi.isConfigured}>
              Add slide
            </Button>
          </div>
        </div>
      </div>

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={pickFromLibrary} />

      {/* ── Existing slides ────────────────────────────────────────────────── */}
      {slides.length === 0 ? (
        <EmptyState
          title="No hero slides yet"
          description="Add your first slide above. Until then the homepage falls back to its built-in clips."
        />
      ) : (
        <div className="space-y-4">
          {slides.map((slide, i) => (
            <SlideCard
              key={slide.id}
              slide={slide}
              index={i}
              total={slides.length}
              onSave={patchSlide}
              onDelete={removeSlide}
              onMove={move}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Single editable slide ──────────────────────────────────────────────────
function SlideCard({
  slide,
  index,
  total,
  onSave,
  onDelete,
  onMove,
}: {
  slide: HeroSlide;
  index: number;
  total: number;
  onSave: (id: string, body: Partial<HeroSlide>) => Promise<void>;
  onDelete: (id: string) => void;
  onMove: (index: number, dir: -1 | 1) => void;
}) {
  const [local, setLocal] = useState(slide);
  const [saving, setSaving] = useState(false);

  useEffect(() => setLocal(slide), [slide]);

  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(local.src);

  const save = async () => {
    setSaving(true);
    await onSave(slide.id, {
      src: local.src,
      srcWebM: local.srcWebM,
      alt: local.alt,
      label: local.label,
      isActive: local.isActive,
    });
    setSaving(false);
  };

  return (
    <div className="rounded-2xl border border-[#EAE4D0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-stretch gap-4 p-4">
        {/* Preview */}
        <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-xl bg-[#0D2218]">
          {local.src ? (
            isVideo ? (
              <video src={local.src} muted loop playsInline className="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={local.src} alt={local.alt} className="h-full w-full object-cover" />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-white/40">No media</div>
          )}
          <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
            #{index + 1}
          </span>
        </div>

        {/* Fields */}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Media URL">
              <Input value={local.src} onChange={(e) => setLocal({ ...local, src: e.target.value })} />
            </Field>
            <Field label="WebM URL">
              <Input value={local.srcWebM ?? ""} onChange={(e) => setLocal({ ...local, srcWebM: e.target.value })} />
            </Field>
            <Field label="Alt text">
              <Input value={local.alt} onChange={(e) => setLocal({ ...local, alt: e.target.value })} />
            </Field>
            <Field label="Caption label">
              <Input value={local.label ?? ""} onChange={(e) => setLocal({ ...local, label: e.target.value })} />
            </Field>
          </div>
          <Toggle
            checked={local.isActive}
            onChange={(v) => setLocal({ ...local, isActive: v })}
            label="Active"
            description="Inactive slides are hidden from the public homepage."
          />
        </div>

        {/* Order controls */}
        <div className="flex flex-col items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            aria-label="Move up"
            className="rounded-lg p-1.5 text-[#6A7B70] hover:bg-[#EAE4D0]/70 disabled:opacity-30"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === total - 1}
            aria-label="Move down"
            className="rounded-lg p-1.5 text-[#6A7B70] hover:bg-[#EAE4D0]/70 disabled:opacity-30"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#EAE4D0] bg-[#FDFCF9] px-4 py-3">
        <Button variant="danger" size="sm" type="button" onClick={() => onDelete(slide.id)}>
          Delete
        </Button>
        <Button size="sm" type="button" onClick={save} loading={saving}>
          Save slide
        </Button>
      </div>
    </div>
  );
}
