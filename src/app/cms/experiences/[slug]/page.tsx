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

type Exp = {
  slug: string;
  name: string;
  tagline: string;
  eyebrow: string;
  short_description: string;
  body: string;
  metaDescription: string;
  metaTitle: string;
  highlights: string[];
  destinations_included: string[];
  duration_days: string;
  price_range: string;
  cta: string;
  imageUrl: string;
  gallery: string[];
  featured: boolean;
};

const EMPTY: Exp = {
  slug: "", name: "", tagline: "", eyebrow: "", short_description: "", body: "",
  metaDescription: "", metaTitle: "", highlights: [], destinations_included: [],
  duration_days: "", price_range: "", cta: "", imageUrl: "", gallery: [], featured: false,
};

function toLines(a: string[]) { return a.join("\n"); }
function fromLines(s: string) { return s.split("\n").map((l) => l.trim()).filter(Boolean); }

export default function CmsExperienceEditPage() {
  const params = useParams() ?? {};
  const router = useRouter();
  const slug = (params.slug ?? "new") as string;
  const isNew = slug === "new";

  const [form, setForm] = useState<Exp>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (isNew || !cmsApi.isConfigured) { setLoading(false); return; }
    cmsApi.getExperience(slug).then((d) => { setForm({ ...EMPTY, ...(d as unknown as Exp) }); setLoading(false); }).catch(() => setLoading(false));
  }, [slug, isNew]);

  const set = <K extends keyof Exp>(k: K, v: Exp[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      if (isNew) await cmsApi.createExperience(form as unknown as Record<string, unknown>);
      else await cmsApi.updateExperience(slug, form as unknown as Record<string, unknown>);
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
              <Field label="Tagline"><Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="From airstrip to wilderness…" /></Field>
              <Field label="Duration (days)"><Input type="number" min="1" max="30" value={form.duration_days} onChange={(e) => set("duration_days", e.target.value)} placeholder="7" /></Field>
              <Field label="Price range"><Input value={form.price_range} onChange={(e) => set("price_range", e.target.value)} placeholder="From $8,500 per person" /></Field>
            </div>
          </CardSection>
        </Card>

        <Card>
          <CardSection title="Content">
            <div className="space-y-4">
              <Field label="Short description" hint="Used in listings and cards."><Textarea value={form.short_description} onChange={(e) => set("short_description", e.target.value)} rows={2} /></Field>
              <Field label="Full description / body"><Textarea value={form.body} onChange={(e) => set("body", e.target.value)} rows={7} placeholder="Describe the experience in detail…" /></Field>
              <Field label="CTA button text"><Input value={form.cta} onChange={(e) => set("cta", e.target.value)} placeholder="Plan your fly-in safari" /></Field>
            </div>
          </CardSection>
        </Card>

        <Card>
          <CardSection title="Highlights & Destinations" description="One item per line.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Highlights"><Textarea value={toLines(form.highlights)} onChange={(e) => set("highlights", fromLines(e.target.value))} rows={5} placeholder={"Private charter flights\nCamp-to-camp logistics"} /></Field>
              <Field label="Destinations included" hint="Slugs or names."><Textarea value={toLines(form.destinations_included)} onChange={(e) => set("destinations_included", fromLines(e.target.value))} rows={5} placeholder={"Ruaha\nKatavi"} /></Field>
            </div>
          </CardSection>
        </Card>

        <Card>
          <CardSection title="Media" description="Paste CDN URLs from Media Library.">
            <div className="space-y-4">
              <Field label="Hero image URL"><Input type="url" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://cdn…" /></Field>
              {form.imageUrl && (
                <div className="h-36 rounded-lg overflow-hidden bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <Field label="Gallery URLs (one per line)"><Textarea value={toLines(form.gallery)} onChange={(e) => set("gallery", fromLines(e.target.value))} rows={3} /></Field>
            </div>
          </CardSection>
        </Card>

        <Card>
          <CardSection title="SEO">
            <div className="space-y-4">
              <Field label="Meta title"><Input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} /></Field>
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
