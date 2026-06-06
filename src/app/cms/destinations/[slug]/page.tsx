"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cmsApi } from "@/lib/cms-api";
import { PageHeader } from "../../_components/PageHeader";
import { Card, CardSection } from "../../_components/Card";
import { Field } from "../../_components/Field";
import { Input } from "../../_components/Input";
import { Textarea } from "../../_components/Textarea";
import { Select } from "../../_components/Select";
import { Toggle } from "../../_components/Toggle";
import { SaveBar } from "../../_components/SaveBar";
import { PageLoader } from "../../_components/Spinner";
import { MediaLibraryHint } from "../../_components/SectionSaveCard";
import { GalleryManager, type GalleryItem } from "../../_components/GalleryManager";

// Field names match the backend Prisma model / DestinationDto (camelCase).
type Dest = {
  slug: string;
  name: string;
  circuit: string; // circuit slug
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  metaDescription: string;
  seoTitle: string;
  highlights: string[];
  bestTime: string;
  luxuryCamps: string[];
  migrationNote: string;
  ecosystem: string;
  avgTemp: string;
  wildlife: string; // single text field on the backend (not a list)
  heroImageUrl: string;
  mapLat: string; // kept as string in the form; converted to number on save
  mapLng: string;
  featured: boolean;
  internalLinks: { label: string; href: string }[];
};

const EMPTY: Dest = {
  slug: "",
  name: "",
  circuit: "northern",
  tagline: "",
  shortDescription: "",
  fullDescription: "",
  metaDescription: "",
  seoTitle: "",
  highlights: [],
  bestTime: "",
  luxuryCamps: [],
  migrationNote: "",
  ecosystem: "",
  avgTemp: "",
  wildlife: "",
  heroImageUrl: "",
  mapLat: "",
  mapLng: "",
  featured: false,
  internalLinks: [],
};

function toLines(arr: string[]) { return arr.join("\n"); }
function fromLines(s: string) { return s.split("\n").map((l) => l.trim()).filter(Boolean); }

/** Map the API detail response (serializer) onto the flat form shape. */
function fromApi(d: Record<string, unknown>): Dest {
  const heroImage = d.heroImage as { url?: string } | undefined;
  const circuit = d.circuit as { slug?: string } | undefined;
  const num = (v: unknown) => (typeof v === "number" ? String(v) : typeof v === "string" ? v : "");
  return {
    ...EMPTY,
    slug: (d.slug as string) ?? "",
    name: (d.name as string) ?? "",
    circuit: circuit?.slug ?? "northern",
    tagline: (d.tagline as string) ?? "",
    shortDescription: (d.shortDescription as string) ?? "",
    fullDescription: (d.fullDescription as string) ?? "",
    metaDescription: (d.metaDescription as string) ?? "",
    seoTitle: (d.seoTitle as string) ?? "",
    highlights: (d.highlights as string[]) ?? [],
    bestTime: (d.bestTime as string) ?? "",
    luxuryCamps: (d.luxuryCamps as string[]) ?? [],
    migrationNote: (d.migrationNote as string) ?? "",
    ecosystem: (d.ecosystem as string) ?? "",
    avgTemp: (d.avgTemp as string) ?? "",
    wildlife: (d.wildlife as string) ?? "",
    heroImageUrl: heroImage?.url ?? "",
    mapLat: num(d.mapLat),
    mapLng: num(d.mapLng),
    featured: Boolean(d.featured),
    internalLinks: (d.internalLinks as { label: string; href: string }[]) ?? [],
  };
}

/** Build the request body in the exact shape the backend DTO accepts. */
function toApi(form: Dest): Record<string, unknown> {
  const body: Record<string, unknown> = {
    name: form.name,
    slug: form.slug || undefined,
    circuit: form.circuit || undefined,
    tagline: form.tagline,
    shortDescription: form.shortDescription,
    fullDescription: form.fullDescription,
    metaDescription: form.metaDescription,
    seoTitle: form.seoTitle,
    highlights: form.highlights,
    bestTime: form.bestTime,
    luxuryCamps: form.luxuryCamps,
    migrationNote: form.migrationNote,
    ecosystem: form.ecosystem,
    avgTemp: form.avgTemp,
    wildlife: form.wildlife,
    heroImageUrl: form.heroImageUrl,
    internalLinks: form.internalLinks,
    featured: form.featured,
  };
  // mapLat/mapLng are numbers on the backend — only send when provided & valid.
  if (form.mapLat.trim() && !Number.isNaN(Number(form.mapLat))) body.mapLat = Number(form.mapLat);
  if (form.mapLng.trim() && !Number.isNaN(Number(form.mapLng))) body.mapLng = Number(form.mapLng);
  return body;
}

export default function CmsDestinationEditPage() {
  const params = useParams() ?? {};
  const router = useRouter();
  const slug = (params.slug ?? "new") as string;
  const isNew = slug === "new";

  const [form, setForm] = useState<Dest>(EMPTY);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (isNew || !cmsApi.isConfigured) {
      setLoading(false);
      return;
    }
    cmsApi
      .getDestination(slug)
      .then((d) => {
        const data = d as unknown as Record<string, unknown>;
        setForm(fromApi(data));
        const g = (data.gallery as Array<{ id: string; url?: string; media?: { url?: string } }>) ?? [];
        setGallery(g.map((x) => ({ id: x.id, url: x.url ?? x.media?.url ?? "" })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, isNew]);

  const set = <K extends keyof Dest>(k: K, v: Dest[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const body = toApi(form);
      if (isNew) await cmsApi.createDestination(body);
      else await cmsApi.updateDestination(slug, body);
      setMessage({ type: "success", text: "Destination saved." });
      if (isNew && form.slug) router.push(`/cms/destinations/${form.slug}`);
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <PageHeader
        title={isNew ? "New destination" : form.name || "Edit destination"}
        description={isNew ? "Create a new park or circuit destination." : `Editing /destinations/${slug}`}
        back={{ href: "/cms/destinations", label: "Destinations" }}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core */}
        <Card>
          <CardSection title="Core information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Name" required>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Serengeti National Park" required />
              </Field>
              <Field label="Slug" required hint="URL: /destinations/{slug}">
                <Input value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="serengeti" required />
              </Field>
              <Field label="Circuit" required>
                <Select
                  value={form.circuit}
                  onChange={(e) => set("circuit", e.target.value)}
                  options={[
                    { value: "northern", label: "Northern Circuit" },
                    { value: "southern", label: "Southern Circuit" },
                    { value: "western", label: "Western Circuit" },
                  ]}
                />
              </Field>
              <Field label="Tagline">
                <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="The endless plains…" />
              </Field>
            </div>
          </CardSection>
        </Card>

        {/* Descriptions */}
        <Card>
          <CardSection title="Descriptions">
            <div className="space-y-4">
              <Field label="Short description" hint="Used in cards and listings.">
                <Textarea value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} rows={2} placeholder="Brief description for cards…" />
              </Field>
              <Field label="Full description" hint="Shown on the destination detail page.">
                <Textarea value={form.fullDescription} onChange={(e) => set("fullDescription", e.target.value)} rows={6} placeholder="Full rich description…" />
              </Field>
              <Field label="Best time to visit">
                <Input value={form.bestTime} onChange={(e) => set("bestTime", e.target.value)} placeholder="Year-round. Migration: Dec–Jul…" />
              </Field>
              <Field label="Migration note" hint="Optional note about the migration / seasonal highlight.">
                <Textarea value={form.migrationNote} onChange={(e) => set("migrationNote", e.target.value)} rows={2} />
              </Field>
            </div>
          </CardSection>
        </Card>

        {/* Highlights & Wildlife */}
        <Card>
          <CardSection title="Highlights & Fast Facts" description="Enter list items one per line.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Highlights (one per line)">
                <Textarea value={toLines(form.highlights)} onChange={(e) => set("highlights", fromLines(e.target.value))} rows={5} placeholder={"Great Migration\nBig cat capital\nBalloon safaris"} />
              </Field>
              <Field label="Luxury camps (one per line)">
                <Textarea value={toLines(form.luxuryCamps)} onChange={(e) => set("luxuryCamps", fromLines(e.target.value))} rows={5} placeholder={"Singita Grumeti\nandBeyond"} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Wildlife" hint="Free text describing the wildlife (single field).">
                  <Textarea value={form.wildlife} onChange={(e) => set("wildlife", e.target.value)} rows={2} placeholder="Lion, leopard, cheetah, elephant…" />
                </Field>
              </div>
              <Field label="Ecosystem">
                <Input value={form.ecosystem} onChange={(e) => set("ecosystem", e.target.value)} placeholder="Short-grass plains, Acacia woodland" />
              </Field>
              <Field label="Avg temperature">
                <Input value={form.avgTemp} onChange={(e) => set("avgTemp", e.target.value)} placeholder="24°C – 28°C day / 13°C night" />
              </Field>
            </div>
          </CardSection>
        </Card>

        {/* Media */}
        <Card>
          <CardSection title="Hero image" description="Paste a URL from the Media Library.">
            <div className="space-y-4">
              <Field label="Hero image URL" hint={<MediaLibraryHint />}>
                <Input type="url" value={form.heroImageUrl} onChange={(e) => set("heroImageUrl", e.target.value)} placeholder="https://minio.tantrek360safaris.com/cms-media/…" />
              </Field>
              {form.heroImageUrl && (
                <div className="h-36 w-full rounded-lg overflow-hidden bg-[#0D2218]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.heroImageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </CardSection>
        </Card>

        {/* Gallery (existing destinations only) */}
        {!isNew && (
          <Card>
            <CardSection title="Gallery" description="Pick images from the Media Library. Changes save immediately.">
              <GalleryManager kind="destination" slug={slug} initial={gallery} />
            </CardSection>
          </Card>
        )}

        {/* Map */}
        <Card>
          <CardSection title="Map coordinates (optional)">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude">
                <Input value={form.mapLat} onChange={(e) => set("mapLat", e.target.value)} placeholder="-2.3333" inputMode="decimal" />
              </Field>
              <Field label="Longitude">
                <Input value={form.mapLng} onChange={(e) => set("mapLng", e.target.value)} placeholder="34.8333" inputMode="decimal" />
              </Field>
            </div>
          </CardSection>
        </Card>

        {/* SEO */}
        <Card>
          <CardSection title="SEO">
            <div className="space-y-4">
              <Field label="SEO title" hint="Leave blank to use the page name.">
                <Input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder="Serengeti National Park Safari | TANTREK 360" />
              </Field>
              <Field label="Meta description" hint="Max 160 characters. Used for cards and search results.">
                <Textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={2} placeholder="Luxury safari in Serengeti…" maxLength={160} />
              </Field>
            </div>
          </CardSection>
        </Card>

        {/* Featured */}
        <Card padded={false}>
          <div className="p-4">
            <Toggle
              checked={form.featured}
              onChange={(v) => set("featured", v)}
              label="Featured destination"
              description="Show on homepage and destinations overview."
            />
          </div>
        </Card>

        <SaveBar
          saving={saving}
          message={message}
          onDismiss={() => setMessage(null)}
          disabled={!cmsApi.isConfigured}
          label={isNew ? "Create destination" : "Save changes"}
        />
      </form>
    </div>
  );
}
