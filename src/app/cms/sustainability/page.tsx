"use client";

import { useEffect, useState } from "react";
import { cmsApi } from "@/lib/cms-api";
import { PageHeader } from "../_components/PageHeader";
import { Field } from "../_components/Field";
import { Input } from "../_components/Input";
import { Textarea } from "../_components/Textarea";
import { Alert } from "../_components/Alert";
import { PageLoader } from "../_components/Spinner";
import { SectionSaveCard, MediaLibraryHint } from "../_components/SectionSaveCard";

type SustainData = {
  heroImage: string; headline: string; subheadline: string;
  intro: string;
  pillar1Title: string; pillar1Body: string;
  pillar2Title: string; pillar2Body: string;
  pillar3Title: string; pillar3Body: string;
  ctaText: string; metaTitle: string; metaDescription: string;
};

const EMPTY: SustainData = {
  heroImage: "", headline: "Committed to Conservation",
  subheadline: "", intro: "",
  pillar1Title: "Low-Impact Travel", pillar1Body: "",
  pillar2Title: "Community Partnerships", pillar2Body: "",
  pillar3Title: "Wildlife Protection", pillar3Body: "",
  ctaText: "", metaTitle: "", metaDescription: "",
};

export default function CmsSustainabilityPage() {
  const [form, setForm] = useState<SustainData>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cmsApi.isConfigured) { setLoading(false); return; }
    cmsApi.getSustainability()
      .then((d) => { setForm({ ...EMPTY, ...(d as Partial<SustainData>) }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = <K extends keyof SustainData>(k: K, v: SustainData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = (fields: Partial<SustainData>) =>
    cmsApi.updateSustainability(fields as Record<string, unknown>);

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <PageHeader
        title="Sustainability Page"
        description="Each section saves independently — edit only what you need."
      />
      {!cmsApi.isConfigured && (
        <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load content." />
      )}

      <div className="space-y-5">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <SectionSaveCard
          title="Hero — Page header"
          description="The headline, subheadline, intro text, and hero background image."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ headline: form.headline, subheadline: form.subheadline, heroImage: form.heroImage, intro: form.intro })}
          successMessage="Hero section saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Headline">
              <Input value={form.headline} onChange={(e) => set("headline", e.target.value)} placeholder="Committed to Conservation" />
            </Field>
            <Field label="Subheadline">
              <Input value={form.subheadline} onChange={(e) => set("subheadline", e.target.value)} placeholder="Safari that gives back to the land" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Hero image URL" hint={<MediaLibraryHint />}>
                <Input type="url" value={form.heroImage} onChange={(e) => set("heroImage", e.target.value)} placeholder="https://cdn…/sustainability-hero.jpg" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Introduction paragraph" hint="Opening statement shown below the headline.">
                <Textarea value={form.intro} onChange={(e) => set("intro", e.target.value)} rows={3} />
              </Field>
            </div>
          </div>
        </SectionSaveCard>

        {/* ── Three Pillars ────────────────────────────────────────────── */}
        <SectionSaveCard
          title="Three pillars of our sustainability commitment"
          description="Each pillar has a title and a description paragraph."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({
            pillar1Title: form.pillar1Title, pillar1Body: form.pillar1Body,
            pillar2Title: form.pillar2Title, pillar2Body: form.pillar2Body,
            pillar3Title: form.pillar3Title, pillar3Body: form.pillar3Body,
          })}
          successMessage="Pillars saved."
        >
          <div className="space-y-4">
            {(["1", "2", "3"] as const).map((n) => (
              <div key={n} className="rounded-xl border border-[#EAE4D0] bg-[#FDFCF9] p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold">Pillar {n}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Field label="Title">
                    <Input
                      value={form[`pillar${n}Title` as keyof SustainData] as string}
                      onChange={(e) => set(`pillar${n}Title` as keyof SustainData, e.target.value)}
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Description">
                      <Textarea
                        value={form[`pillar${n}Body` as keyof SustainData] as string}
                        onChange={(e) => set(`pillar${n}Body` as keyof SustainData, e.target.value)}
                        rows={2}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionSaveCard>

        {/* ── SEO ──────────────────────────────────────────────────────── */}
        <SectionSaveCard
          title="SEO — Search engine metadata"
          description="Controls how this page appears in Google search results."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ metaTitle: form.metaTitle, metaDescription: form.metaDescription })}
          successMessage="SEO metadata saved."
        >
          <div className="space-y-3">
            <Field label="Meta title" hint="Ideal length 50–60 characters.">
              <Input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder="Sustainability — TANTREK 360 Safaris" />
            </Field>
            <Field label="Meta description" hint="Max 160 characters.">
              <Textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={2} maxLength={160} />
            </Field>
          </div>
        </SectionSaveCard>

      </div>
    </div>
  );
}
