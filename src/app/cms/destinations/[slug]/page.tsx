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

type Dest = {
  slug: string;
  name: string;
  circuit: string;
  tagline: string;
  short_description: string;
  full_description: string;
  metaDescription: string;
  metaTitle: string;
  highlights: string[];
  bestTime: string;
  luxuryCamps: string[];
  ecosystem?: string;
  avgTemp?: string;
  imageUrl: string;
  gallery: string[];
  mapLat?: string;
  mapLng?: string;
  wildlife_highlights: string[];
  featured: boolean;
  internalLinks: { label: string; href: string }[];
};

const EMPTY: Dest = {
  slug: "",
  name: "",
  circuit: "northern",
  tagline: "",
  short_description: "",
  full_description: "",
  metaDescription: "",
  metaTitle: "",
  highlights: [],
  bestTime: "",
  luxuryCamps: [],
  ecosystem: "",
  avgTemp: "",
  imageUrl: "",
  gallery: [],
  mapLat: "",
  mapLng: "",
  wildlife_highlights: [],
  featured: false,
  internalLinks: [],
};

function toLines(arr: string[]) { return arr.join("\n"); }
function fromLines(s: string) { return s.split("\n").map((l) => l.trim()).filter(Boolean); }

export default function CmsDestinationEditPage() {
  const params = useParams() ?? {};
  const router = useRouter();
  const slug = (params.slug ?? "new") as string;
  const isNew = slug === "new";

  const [form, setForm] = useState<Dest>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (isNew || !cmsApi.isConfigured) {
      setLoading(false);
      return;
    }
    cmsApi.getDestination(slug).then((d) => { setForm({ ...EMPTY, ...(d as unknown as Dest) }); setLoading(false); }).catch(() => setLoading(false));
  }, [slug, isNew]);

  const set = <K extends keyof Dest>(k: K, v: Dest[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      if (isNew) await cmsApi.createDestination(form as unknown as Record<string, unknown>);
      else await cmsApi.updateDestination(slug, form as unknown as Record<string, unknown>);
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
                <Textarea value={form.short_description} onChange={(e) => set("short_description", e.target.value)} rows={2} placeholder="Brief description for cards…" />
              </Field>
              <Field label="Full description" hint="Shown on the destination detail page.">
                <Textarea value={form.full_description} onChange={(e) => set("full_description", e.target.value)} rows={6} placeholder="Full rich description…" />
              </Field>
              <Field label="Best time to visit">
                <Input value={form.bestTime} onChange={(e) => set("bestTime", e.target.value)} placeholder="Year-round. Migration: Dec–Jul…" />
              </Field>
            </div>
          </CardSection>
        </Card>

        {/* Highlights & Wildlife */}
        <Card>
          <CardSection title="Highlights & Wildlife" description="Enter each item on a new line.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Highlights (one per line)">
                <Textarea value={toLines(form.highlights)} onChange={(e) => set("highlights", fromLines(e.target.value))} rows={5} placeholder={"Great Migration\nBig cat capital\nBalloon safaris"} />
              </Field>
              <Field label="Wildlife highlights (one per line)">
                <Textarea value={toLines(form.wildlife_highlights)} onChange={(e) => set("wildlife_highlights", fromLines(e.target.value))} rows={5} placeholder={"Lion\nLeopard\nElephant"} />
              </Field>
              <Field label="Luxury camps (one per line)">
                <Textarea value={toLines(form.luxuryCamps)} onChange={(e) => set("luxuryCamps", fromLines(e.target.value))} rows={4} placeholder={"Singita Grumeti\nAndBeyond"} />
              </Field>
              <div className="space-y-3">
                <Field label="Ecosystem">
                  <Input value={form.ecosystem ?? ""} onChange={(e) => set("ecosystem", e.target.value)} placeholder="Short-grass plains, Acacia woodland" />
                </Field>
                <Field label="Avg temperature">
                  <Input value={form.avgTemp ?? ""} onChange={(e) => set("avgTemp", e.target.value)} placeholder="24°C – 28°C day / 13°C night" />
                </Field>
              </div>
            </div>
          </CardSection>
        </Card>

        {/* Media */}
        <Card>
          <CardSection title="Media" description="Paste CDN URLs from the Media Library.">
            <div className="space-y-4">
              <Field label="Hero image URL">
                <Input type="url" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://cdn.example.com/..." />
              </Field>
              {form.imageUrl && (
                <div className="h-36 w-full rounded-lg overflow-hidden bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <Field label="Gallery image URLs (one per line)">
                <Textarea value={toLines(form.gallery)} onChange={(e) => set("gallery", fromLines(e.target.value))} rows={3} placeholder="https://cdn.example.com/gallery1.jpg" />
              </Field>
            </div>
          </CardSection>
        </Card>

        {/* Map */}
        <Card>
          <CardSection title="Map coordinates (optional)">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude">
                <Input value={form.mapLat ?? ""} onChange={(e) => set("mapLat", e.target.value)} placeholder="-2.3333" />
              </Field>
              <Field label="Longitude">
                <Input value={form.mapLng ?? ""} onChange={(e) => set("mapLng", e.target.value)} placeholder="34.8333" />
              </Field>
            </div>
          </CardSection>
        </Card>

        {/* SEO */}
        <Card>
          <CardSection title="SEO">
            <div className="space-y-4">
              <Field label="Meta title" hint="Leave blank to use the page name.">
                <Input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder="Serengeti National Park Safari | TANTREK 360" />
              </Field>
              <Field label="Meta description" hint="Max 160 characters.">
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
