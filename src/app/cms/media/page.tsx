"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cmsApi, type PaginatedList, type MediaItem as ApiMediaItem } from "@/lib/cms-api";
import { PageHeader } from "../_components/PageHeader";
import { Button } from "../_components/Button";
import { Alert } from "../_components/Alert";
import { Badge } from "../_components/Badge";
import { EmptyState } from "../_components/EmptyState";
import { Spinner } from "../_components/Spinner";
import { Field } from "../_components/Field";
import { Input } from "../_components/Input";

type MediaItem = ApiMediaItem & { alt?: string; filename?: string };
type UploadState = "idle" | "uploading" | "done" | "error";
type Filter = "all" | "image" | "video";

/** Images: specific page + section options so editors always know exactly where a file belongs */
const IMAGE_USAGE_OPTIONS: { value: string; label: string; group: string }[] = [
  // Homepage
  { group: "Homepage", value: "homepage-hero-slide",    label: "Homepage — Hero Slide (static fallback)" },
  { group: "Homepage", value: "homepage-story-bg",      label: "Homepage — Our Story background image" },
  { group: "Homepage", value: "homepage-final-cta-bg",  label: "Homepage — Final CTA background image" },
  // Destinations
  { group: "Destinations",  value: "destinations-hero",    label: "Destinations — Destination hero image" },
  { group: "Destinations",  value: "destinations-gallery", label: "Destinations — Destination gallery image" },
  // Experiences
  { group: "Experiences", value: "experiences-hero",    label: "Experiences — Experience hero image" },
  { group: "Experiences", value: "experiences-gallery", label: "Experiences — Experience gallery image" },
  // Journal
  { group: "Journal", value: "journal-featured", label: "Journal — Article featured image" },
  // About
  { group: "About",  value: "about-hero",    label: "About — Page hero image" },
  { group: "About",  value: "about-founder", label: "About — Founder portrait" },
  { group: "About",  value: "about-team",    label: "About — Team member photo" },
  // Other pages
  { group: "Sustainability",   value: "sustainability-hero",   label: "Sustainability — Page hero image" },
  { group: "Plan Your Safari", value: "plan-safari-hero",      label: "Plan Your Safari — Page hero image" },
  // Site-wide
  { group: "Site-wide", value: "logo",     label: "Site — Logo" },
  { group: "Site-wide", value: "og-image", label: "Site — Social share image (OG)" },
  { group: "Site-wide", value: "general",  label: "General / Other" },
];

/** Videos: only two locations use video on the site */
const VIDEO_USAGE_OPTIONS: { value: string; label: string }[] = [
  { value: "homepage-hero-slide", label: "Homepage — Hero Slide video (MP4 / WebM)" },
  { value: "map-background",      label: "Homepage — Tanzania Map background video" },
];

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

/** Find the human-readable label for a usage value */
function usageLabel(usage: string): string {
  return (
    IMAGE_USAGE_OPTIONS.find((o) => o.value === usage)?.label ??
    VIDEO_USAGE_OPTIONS.find((o) => o.value === usage)?.label ??
    usage
  );
}

function MediaCard({
  item,
  onDelete,
  onCopy,
}: {
  item: MediaItem;
  onDelete: (id: string) => void;
  onCopy: (url: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="group relative rounded-xl border border-[#EAE4D0] bg-white overflow-hidden hover:border-luxury-gold/40 hover:shadow-md transition-all">
      {/* Preview */}
      <div className="relative aspect-video bg-[#F6F3EB] overflow-hidden">
        {item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.altText ?? item.alt ?? ""}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-8 w-8 text-[#C0B8A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <Badge label={item.type} variant={item.type === "image" ? "blue" : "purple"} />
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#0D2218]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={() => onCopy(item.url)}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-[#0D2218] hover:bg-white/20 backdrop-blur transition-colors"
          >
            Copy URL
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <p className="text-xs font-medium text-[#0D2218] truncate">
          {item.filename ?? item.url.split("/").pop()}
        </p>

        {/* Usage — full label so editor knows exactly where this file goes */}
        {item.usage && (
          <p className="text-[10px] text-luxury-gold font-medium leading-tight">
            {usageLabel(item.usage)}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {item.size !== undefined && (
            <span className="text-[10px] text-[#8A9990]">{formatBytes(item.size)}</span>
          )}
          {item.width && item.height && (
            <span className="text-[10px] text-[#8A9990]">{item.width}×{item.height}</span>
          )}
        </div>
        {(item.altText ?? item.alt) && (
          <p className="text-[10px] text-[#8A9990] truncate" title={item.altText ?? item.alt}>
            Alt: {item.altText ?? item.alt}
          </p>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-1 border-t border-[#F0EBE0]">
          <button
            type="button"
            onClick={() => onCopy(item.url)}
            className="text-[10px] text-luxury-gold hover:underline"
          >
            Copy URL
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#8A9990]">Delete?</span>
              <button type="button" onClick={() => onDelete(item.id)} className="text-[10px] text-red-500 hover:text-red-600 font-medium">Yes</button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="text-[10px] text-[#8A9990]">No</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-[10px] text-[#C0B8A0] hover:text-red-500 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CmsMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [upFile, setUpFile] = useState<File | null>(null);
  const [upAlt, setUpAlt] = useState("");
  const [upUsage, setUpUsage] = useState<string>(IMAGE_USAGE_OPTIONS[0].value);
  const [upType, setUpType] = useState<"image" | "video">("image");

  const load = useCallback(async () => {
    if (!cmsApi.isConfigured) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await cmsApi.getMedia(filter !== "all" ? { type: filter } : undefined) as PaginatedList<MediaItem>;
      setItems(res?.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    try {
      await cmsApi.deleteMedia(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upFile) return;
    setUploading(true);
    setUploadError(null);
    setUploadState("uploading");
    try {
      let res: MediaItem;
      if (upType === "image") {
        res = await cmsApi.uploadImage(upFile, { altText: upAlt || undefined, usage: upUsage }) as MediaItem;
      } else {
        res = await cmsApi.uploadVideo(upFile, upUsage as "hero" | "map") as MediaItem;
      }
      setItems((prev) => [{ ...res, type: upType }, ...prev]);
      setUpFile(null);
      setUpAlt("");
      setUploadState("done");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setUploadState("error");
    } finally {
      setUploading(false);
    }
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      <PageHeader
        title="Media Library"
        description="Upload images and videos. Each file is tagged to a specific page section so nothing gets mixed up."
      />

      {!cmsApi.isConfigured && (
        <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to enable uploads and library browsing." />
      )}

      {/* ── Upload panel ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#EAE4D0] bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EAE4D0] bg-[#FDFCF9]">
          <h3 className="font-display text-base font-semibold text-[#0D2218]">Upload a new file</h3>
          <p className="mt-0.5 text-xs text-[#8A9990]">
            Uploading here <span className="font-semibold text-[#6A7B70]">stores and tags</span> the file — it does not place it on the site yet.
            To make it appear, open that section&apos;s editor (e.g. <span className="text-luxury-gold">Hero Slides → “Choose from Library”</span>) and select it.
          </p>
        </div>

        <form onSubmit={handleUpload} className="px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* File type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A7B70] mb-1.5">File type</label>
              <select
                value={upType}
                onChange={(e) => {
                  const t = e.target.value as "image" | "video";
                  setUpType(t);
                  setUpUsage(t === "image" ? IMAGE_USAGE_OPTIONS[0].value : VIDEO_USAGE_OPTIONS[0].value);
                }}
                className="w-full rounded-xl border border-[#EAE4D0] bg-white px-3 py-2.5 text-sm text-[#0D2218] focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/20"
              >
                <option value="image">Image (JPG / PNG / WebP)</option>
                <option value="video">Video (MP4 / WebM)</option>
              </select>
            </div>

            {/* Usage — specific page + section */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A7B70] mb-1.5">
                Page &amp; section this file is for
              </label>
              {upType === "image" ? (
                <select
                  value={upUsage}
                  onChange={(e) => setUpUsage(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE4D0] bg-white px-3 py-2.5 text-sm text-[#0D2218] focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/20"
                >
                  {/* Group options by page */}
                  {Array.from(new Set(IMAGE_USAGE_OPTIONS.map((o) => o.group))).map((group) => (
                    <optgroup key={group} label={group}>
                      {IMAGE_USAGE_OPTIONS.filter((o) => o.group === group).map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              ) : (
                <select
                  value={upUsage}
                  onChange={(e) => setUpUsage(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE4D0] bg-white px-3 py-2.5 text-sm text-[#0D2218] focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/20"
                >
                  {VIDEO_USAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Alt text — images only */}
            {upType === "image" && (
              <div className="sm:col-span-2 lg:col-span-3">
                <Field label="Alt text" hint="Describe the image for accessibility and SEO. Keep it concise and specific.">
                  <Input
                    value={upAlt}
                    onChange={(e) => setUpAlt(e.target.value)}
                    placeholder={`e.g. Lion resting in golden grass, Serengeti at sunset`}
                  />
                </Field>
              </div>
            )}

            {/* File picker + upload button */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A7B70] mb-1.5">File</label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <input
                    ref={fileRef}
                    type="file"
                    accept={upType === "image" ? "image/jpeg,image/png,image/webp,image/svg+xml" : "video/mp4,video/webm"}
                    onChange={(e) => setUpFile(e.target.files?.[0] ?? null)}
                    className="sr-only"
                    required
                  />
                  <div className="flex items-center gap-2 rounded-xl border border-dashed border-[#C0B8A0] bg-[#FDFCF9] px-4 py-3 text-sm text-[#8A9990] hover:border-luxury-gold hover:text-[#0D2218] transition-colors">
                    <svg className="h-4 w-4 shrink-0 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="truncate">
                      {upFile ? `${upFile.name} — ${formatBytes(upFile.size)}` : "Click to choose file…"}
                    </span>
                  </div>
                </label>
                <Button type="submit" loading={uploading} disabled={!upFile || !cmsApi.isConfigured}>
                  Upload
                </Button>
              </div>

              {/* Size warnings */}
              {upFile && upType === "image" && upFile.size > 800 * 1024 && (
                <p className="mt-1.5 text-xs text-amber-600">
                  ⚠ This image is over 800 KB. Hero and card images should be compressed before uploading.
                </p>
              )}
              {upFile && upType === "video" && upFile.size > 8 * 1024 * 1024 && (
                <p className="mt-1.5 text-xs text-amber-600">
                  ⚠ This video is over 8 MB. Compress it first for better performance.
                </p>
              )}
            </div>
          </div>

          {uploadState === "done" && (
            <div className="mt-4">
              <Alert type="success" message="Uploaded to the library. To put it live, open the matching section editor (e.g. Hero Slides → “Choose from Library”) and select it." onDismiss={() => setUploadState("idle")} />
            </div>
          )}
          {uploadError && (
            <div className="mt-4">
              <Alert type="error" message={uploadError} onDismiss={() => setUploadError(null)} />
            </div>
          )}
        </form>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "image", "video"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors capitalize ${
              filter === f
                ? "bg-luxury-dark-emerald text-[#0D2218]"
                : "bg-white border border-[#EAE4D0] text-[#8A9990] hover:text-[#0D2218] hover:border-[#C0B8A0]"
            }`}
          >
            {f === "all" ? `All files (${items.length})` : f === "image" ? `Images (${items.filter((i) => i.type === "image").length})` : `Videos (${items.filter((i) => i.type === "video").length})`}
          </button>
        ))}
        {copied && (
          <span className="ml-auto text-xs text-emerald-600 font-medium">✓ URL copied to clipboard</span>
        )}
      </div>

      {/* ── Media grid ───────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No media files yet"
          description={
            cmsApi.isConfigured
              ? "Upload your first image or video using the form above."
              : "Configure the API URL to see uploaded files."
          }
          icon={
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <MediaCard key={item.id} item={item} onDelete={handleDelete} onCopy={handleCopy} />
          ))}
        </div>
      )}
    </div>
  );
}
