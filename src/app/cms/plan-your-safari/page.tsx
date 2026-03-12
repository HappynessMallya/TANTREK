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

type PlanData = {
  heroImage: string; eyebrow: string; headline: string; intro: string;
  step1Title: string; step1Body: string;
  step2Title: string; step2Body: string;
  step3Title: string; step3Body: string;
  formHeadline: string; formSubtext: string;
  metaTitle: string; metaDescription: string;
};

const EMPTY: PlanData = {
  heroImage: "", eyebrow: "Plan Your Safari", headline: "Design Your Perfect Wild Journey",
  intro: "", step1Title: "", step1Body: "", step2Title: "", step2Body: "",
  step3Title: "", step3Body: "", formHeadline: "", formSubtext: "",
  metaTitle: "", metaDescription: "",
};

export default function CmsPlanYourSafariPage() {
  const [form, setForm] = useState<PlanData>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cmsApi.isConfigured) { setLoading(false); return; }
    cmsApi.getPlanYourSafari()
      .then((d) => { setForm({ ...EMPTY, ...(d as Partial<PlanData>) }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = <K extends keyof PlanData>(k: K, v: PlanData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = (fields: Partial<PlanData>) =>
    cmsApi.updatePlanYourSafari(fields as Record<string, unknown>);

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <PageHeader
        title="Plan Your Safari Page"
        description="Each section saves independently — edit only what you need."
      />
      {!cmsApi.isConfigured && (
        <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load content." />
      )}

      <div className="space-y-5">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <SectionSaveCard
          title="Hero — Page header"
          description="The eyebrow, headline, intro paragraph, and hero background image."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ eyebrow: form.eyebrow, headline: form.headline, intro: form.intro, heroImage: form.heroImage })}
          successMessage="Hero section saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Eyebrow" hint="Small label above the headline.">
              <Input value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} placeholder="Plan Your Safari" />
            </Field>
            <Field label="Headline">
              <Input value={form.headline} onChange={(e) => set("headline", e.target.value)} placeholder="Design Your Perfect Wild Journey" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Intro paragraph">
                <Textarea value={form.intro} onChange={(e) => set("intro", e.target.value)} rows={3} placeholder="Tell us your dream and we'll craft an experience…" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Hero image URL" hint={<MediaLibraryHint />}>
                <Input type="url" value={form.heroImage} onChange={(e) => set("heroImage", e.target.value)} placeholder="https://cdn…/plan-hero.jpg" />
              </Field>
            </div>
          </div>
        </SectionSaveCard>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <SectionSaveCard
          title="How it works — 3-step process"
          description="Three numbered steps showing how the safari planning process works."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({
            step1Title: form.step1Title, step1Body: form.step1Body,
            step2Title: form.step2Title, step2Body: form.step2Body,
            step3Title: form.step3Title, step3Body: form.step3Body,
          })}
          successMessage="Steps saved."
        >
          <div className="space-y-4">
            {([1, 2, 3] as const).map((n) => (
              <div key={n} className="rounded-xl border border-[#EAE4D0] bg-[#FDFCF9] p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold">Step {n}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Field label="Title">
                    <Input
                      value={form[`step${n}Title` as keyof PlanData] as string}
                      onChange={(e) => set(`step${n}Title` as keyof PlanData, e.target.value)}
                      placeholder={["Share Your Vision", "We Design Your Safari", "Experience the Wild"][n - 1]}
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Description">
                      <Input
                        value={form[`step${n}Body` as keyof PlanData] as string}
                        onChange={(e) => set(`step${n}Body` as keyof PlanData, e.target.value)}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionSaveCard>

        {/* ── Contact form section ─────────────────────────────────────── */}
        <SectionSaveCard
          title="Inquiry form — Introductory copy"
          description="The headline and supporting text shown above the inquiry submission form."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ formHeadline: form.formHeadline, formSubtext: form.formSubtext })}
          successMessage="Inquiry form copy saved."
        >
          <div className="space-y-3">
            <Field label="Headline">
              <Input value={form.formHeadline} onChange={(e) => set("formHeadline", e.target.value)} placeholder="Begin Your Safari Journey" />
            </Field>
            <Field label="Supporting text">
              <Textarea value={form.formSubtext} onChange={(e) => set("formSubtext", e.target.value)} rows={2} placeholder="Fill in your details and one of our specialists will be in touch within 24 hours." />
            </Field>
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
              <Input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder="Plan Your Safari — Tanzania Wildmakers Safaris" />
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
