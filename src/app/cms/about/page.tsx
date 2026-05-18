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

type AboutData = {
  heroImage: string; heroHeadline: string; heroSubheadline: string;
  storyBody: string; founderQuote: string; founderName: string;
  founderTitle: string; founderImage: string;
  valuesTitle: string; value1Icon: string; value1Title: string; value1Body: string;
  value2Icon: string; value2Title: string; value2Body: string;
  value3Icon: string; value3Title: string; value3Body: string;
  teamIntro: string; metaTitle: string; metaDescription: string;
};

const EMPTY: AboutData = {
  heroImage: "", heroHeadline: "", heroSubheadline: "", storyBody: "",
  founderQuote: "", founderName: "", founderTitle: "", founderImage: "",
  valuesTitle: "Why Choose TANTREK 360",
  value1Icon: "", value1Title: "", value1Body: "",
  value2Icon: "", value2Title: "", value2Body: "",
  value3Icon: "", value3Title: "", value3Body: "",
  teamIntro: "", metaTitle: "", metaDescription: "",
};

export default function CmsAboutPage() {
  const [form, setForm] = useState<AboutData>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cmsApi.isConfigured) { setLoading(false); return; }
    cmsApi.getAbout()
      .then((d) => { setForm({ ...EMPTY, ...(d as Partial<AboutData>) }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = <K extends keyof AboutData>(k: K, v: AboutData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = (fields: Partial<AboutData>) =>
    cmsApi.updateAbout(fields as Record<string, unknown>);

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <PageHeader
        title="About Page"
        description="Each section saves independently — edit only what you need."
      />
      {!cmsApi.isConfigured && (
        <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load content." />
      )}

      <div className="space-y-5">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <SectionSaveCard
          title="Hero — Page header"
          description="The large header image and headline at the top of the About page."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ heroHeadline: form.heroHeadline, heroSubheadline: form.heroSubheadline, heroImage: form.heroImage })}
          successMessage="Hero section saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Headline">
              <Input value={form.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} placeholder="Born in the Wild" />
            </Field>
            <Field label="Subheadline">
              <Input value={form.heroSubheadline} onChange={(e) => set("heroSubheadline", e.target.value)} placeholder="A story rooted in Tanzania's wilderness" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Hero image URL" hint={<MediaLibraryHint />}>
                <Input type="url" value={form.heroImage} onChange={(e) => set("heroImage", e.target.value)} placeholder="https://cdn…/about-hero.jpg" />
              </Field>
            </div>
          </div>
        </SectionSaveCard>

        {/* ── Our Story ────────────────────────────────────────────────── */}
        <SectionSaveCard
          title="Our Story — Brand narrative"
          description="The main story text about how TANTREK 360 came to be."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ storyBody: form.storyBody })}
          successMessage="Our Story section saved."
        >
          <Field label="Story text" hint="Supports multiple paragraphs — separate with a blank line.">
            <Textarea value={form.storyBody} onChange={(e) => set("storyBody", e.target.value)} rows={8} placeholder="It began with a single morning in Ruaha…" />
          </Field>
        </SectionSaveCard>

        {/* ── Founder ──────────────────────────────────────────────────── */}
        <SectionSaveCard
          title="Founder — Profile section"
          description="The founder portrait and quote shown on the About page."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ founderName: form.founderName, founderTitle: form.founderTitle, founderQuote: form.founderQuote, founderImage: form.founderImage })}
          successMessage="Founder section saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full name">
              <Input value={form.founderName} onChange={(e) => set("founderName", e.target.value)} placeholder="Juma Mollel" />
            </Field>
            <Field label="Role / Title">
              <Input value={form.founderTitle} onChange={(e) => set("founderTitle", e.target.value)} placeholder="Founder & Lead Safari Guide" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Founder quote" hint="A personal quote displayed prominently.">
                <Textarea value={form.founderQuote} onChange={(e) => set("founderQuote", e.target.value)} rows={2} placeholder="Tanzania changed me. I want it to change you too." />
              </Field>
            </div>
            <Field label="Portrait photo URL" hint={<MediaLibraryHint />}>
              <Input type="url" value={form.founderImage} onChange={(e) => set("founderImage", e.target.value)} placeholder="https://cdn…/founder.jpg" />
            </Field>
          </div>
        </SectionSaveCard>

        {/* ── Values ───────────────────────────────────────────────────── */}
        <SectionSaveCard
          title="Values — Three pillars of our philosophy"
          description="Three statements that define what Wildmakers stands for."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({
            valuesTitle: form.valuesTitle,
            value1Title: form.value1Title, value1Body: form.value1Body,
            value2Title: form.value2Title, value2Body: form.value2Body,
            value3Title: form.value3Title, value3Body: form.value3Body,
          })}
          successMessage="Values section saved."
        >
          <div className="space-y-4">
            <Field label="Section heading">
              <Input value={form.valuesTitle} onChange={(e) => set("valuesTitle", e.target.value)} placeholder="Why Choose TANTREK 360" />
            </Field>
            {([1, 2, 3] as const).map((n) => (
              <div key={n} className="rounded-xl border border-[#EAE4D0] bg-[#FDFCF9] p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold">Value {n}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Field label="Title">
                    <Input
                      value={form[`value${n}Title` as keyof AboutData] as string}
                      onChange={(e) => set(`value${n}Title` as keyof AboutData, e.target.value)}
                      placeholder={["Authenticity", "Conservation", "Excellence"][n - 1]}
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Description">
                      <Input
                        value={form[`value${n}Body` as keyof AboutData] as string}
                        onChange={(e) => set(`value${n}Body` as keyof AboutData, e.target.value)}
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
          <div className="space-y-4">
            <Field label="Meta title" hint="Ideal length 50–60 characters.">
              <Input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder="About Us — TANTREK 360 Safaris" />
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
