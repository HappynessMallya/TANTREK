"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cmsApi } from "@/lib/cms-api";
import { PageHeader } from "../../_components/PageHeader";
import { Card, CardSection } from "../../_components/Card";
import { Field } from "../../_components/Field";
import { Input } from "../../_components/Input";
import { Textarea } from "../../_components/Textarea";
import { Toggle } from "../../_components/Toggle";
import { SaveBar } from "../../_components/SaveBar";
import { PageLoader } from "../../_components/Spinner";
import { MediaLibraryHint } from "../../_components/SectionSaveCard";
import { GalleryManager, type GalleryItem } from "../../_components/GalleryManager";

// Field names match the backend Prisma model / ExperienceDto (camelCase).
type Exp = {
  slug: string;
  name: string;
  tagline: string;
  eyebrow: string;
  body: string;
  metaDescription: string;
  seoTitle: string;
  highlights: string[];
  durationDays: string; // string in the form; converted to number on save
  priceRange: string;
  cta: string;
  heroImageUrl: string;
  featured: boolean;
};

const EMPTY: Exp = {
  slug: "", name: "", tagline: "", eyebrow: "", body: "",
  metaDescription: "", seoTitle: "", highlights: [],
  durationDays: "", priceRange: "", cta: "", heroImageUrl: "", featured: false,
};

function toLines(a: string[]) { return a.join("\n"); }
function fromLines(s: string) { return s.split("\n").map((l) => l.trim()).filter(Boolean); }

function fromApi(d: Record<string, unknown>): Exp {
  const heroImage = d.heroImage as { url?: string } | undefined;
  return {
    ...EMPTY,
    slug: (d.slug as string) ?? "",
    name: (d.name as string) ?? "",
    tagline: (d.tagline as string) ?? "",
    eyebrow: (d.eyebrow as string) ?? "",
    body: (d.body as string) ?? "",
    metaDescription: (d.metaDescription as string) ?? "",
    seoTitle: (d.seoTitle as string) ?? "",
    highlights: (d.highlights as string[]) ?? [],
    durationDays: typeof d.durationDays === "number" ? String(d.durationDays) : "",
    priceRange: (d.priceRange as string) ?? "",
    cta: (d.cta as string) ?? "",
    heroImageUrl: heroImage?.url ?? (d.imageUrl as string) ?? "",
    featured: Boolean(d.featured),
  };
}

function toApi(form: Exp): Record<string, unknown> {
  const body: Record<string, unknown> = {
    name: form.name,
    slug: form.slug || undefined,
    eyebrow: form.eyebrow,
    tagline: form.tagline,
    body: form.body,
    metaDescription: form.metaDescription,
    seoTitle: form.seoTitle,
    highlights: form.highlights,
    priceRange: form.priceRange,
    cta: form.cta,
    heroImageUrl: form.heroImageUrl,
    featured: form.featured,
  };
  if (form.durationDays.trim() && !Number.isNaN(Number(form.durationDays))) {
    body.durationDays = parseInt(form.durationDays, 10);
  }
  return body;
}

export default function CmsExperienceEditPage() {
  const params = useParams() ?? {};
  const router = useRouter();
  const slug = (params.slug ?? "new") as string;
  const isNew = slug === "new";

  const [form, setForm] = useState<Exp>(EMPTY);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (isNew || !cmsApi.isConfigured) { setLoading(false); return; }
    cmsApi
      .getExperience(slug)
      .then((d) => {
        const data = d as unknown as Record<string, unknown>;
        setForm(fromApi(data));
        const g = (data.gallery as Array<{ id: string; url?: string; media?: { url?: string } }>) ?? [];
        setGallery(g.map((x) => ({ id: x.id, url: x.url ?? x.media?.url ?? "" })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, isNew]);

  const set = <K extends keyof Exp>(k: K, v: Exp[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const body = toApi(form);
      if (isNew) await cmsApi.createExperience(body);
      else await cmsApi.updateExperience(slug, body);
      setMessage({ type: "success", text: "Experience saved." });
      if (isNew && form.slug) router.push(`/cms/experiences/${form.slug}`);
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
        title={isNew ? "New experience" : form.name || "Edit experience"}
        back={{ href: "/cms/experiences", label: "Experiences" }}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardSection title="Core information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Title" required><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Luxury Fly-in Safari" required /></Field>
              <Field label="Slug" required hint="/experiences/{slug}"><Input value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="luxury-fly-in" required /></Field>
              <Field label="Eyebrow label"><Input value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} placeholder="Ultra-Luxury Aviation" /></Field>
              <Field label="Tagline" hint="Short line used in cards and listings."><Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="From airstrip to wilderness…" /></Field>
              <Field label="Duration (days)"><Input type="number" min="1" max="30" value={form.durationDays} onChange={(e) => set("durationDays", e.target.value)} placeholder="7" /></Field>
              <Field label="Price range"><Input value={form.priceRange} onChange={(e) => set("priceRange", e.target.value)} placeholder="From $8,500 per person" /></Field>
            </div>
          </CardSection>
        </Card>

        <Card>
          <CardSection title="Content">
            <div className="space-y-4">
              <Field label="Full description / body"><Textarea value={form.body} onChange={(e) => set("body", e.target.value)} rows={7} placeholder="Describe the experience in detail…" /></Field>
              <Field label="CTA button text"><Input value={form.cta} onChange={(e) => set("cta", e.target.value)} placeholder="Plan your fly-in safari" /></Field>
              <Field label="Highlights (one per line)"><Textarea value={toLines(form.highlights)} onChange={(e) => set("highlights", fromLines(e.target.value))} rows={5} placeholder={"Private charter flights\nCamp-to-camp logistics"} /></Field>
            </div>
          </CardSection>
        </Card>

        <Card>
          <CardSection title="Hero image" description="Paste a URL from the Media Library.">
            <div className="space-y-4">
              <Field label="Hero image URL" hint={<MediaLibraryHint />}><Input type="url" value={form.heroImageUrl} onChange={(e) => set("heroImageUrl", e.target.value)} placeholder="https://minio.tantrek360safaris.com/cms-media/…" /></Field>
              {form.heroImageUrl && (
                <div className="h-36 rounded-lg overflow-hidden bg-[#0D2218]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.heroImageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </CardSection>
        </Card>

        {/* Gallery (existing experiences only) */}
        {!isNew && (
          <Card>
            <CardSection title="Gallery" description="Pick images from the Media Library. Changes save immediately.">
              <GalleryManager kind="experience" slug={slug} initial={gallery} />
            </CardSection>
          </Card>
        )}

        <Card>
          <CardSection title="SEO">
            <div className="space-y-4">
              <Field label="SEO title"><Input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} /></Field>
              <Field label="Meta description" hint="Max 160 chars."><Textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={2} maxLength={160} /></Field>
            </div>
          </CardSection>
        </Card>

        <Card padded={false}>
          <div className="p-4">
            <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="Featured experience" description="Show on homepage and experiences overview." />
          </div>
        </Card>

        <SaveBar saving={saving} message={message} onDismiss={() => setMessage(null)} disabled={!cmsApi.isConfigured} label={isNew ? "Create experience" : "Save changes"} />
      </form>
    </div>
  );
}
