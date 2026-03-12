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

type HomeData = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubhead: string;
  heroCtaPrimary: string;
  heroCtaPrimaryHref: string;
  heroCtaSecondary: string;
  heroCtaSecondaryHref: string;
  mapVideoUrl: string;
  mapVideoWebM: string;
  mapHeading: string;
  sanctuariesEyebrow: string;
  sanctuariesTitle: string;
  sanctuariesBody: string;
  ourStoryQuote: string;
  ourStoryBody: string;
  ourStoryBgImage: string;
  finalCtaHeadline: string;
  finalCtaSubcopy: string;
  finalCtaButtonLabel: string;
  finalCtaButtonHref: string;
};

const EMPTY: HomeData = {
  heroEyebrow: "", heroHeadline: "", heroSubhead: "",
  heroCtaPrimary: "", heroCtaPrimaryHref: "",
  heroCtaSecondary: "", heroCtaSecondaryHref: "",
  mapVideoUrl: "", mapVideoWebM: "",
  mapHeading: "Discover Tanzania's Untamed Frontiers",
  sanctuariesEyebrow: "Our destinations",
  sanctuariesTitle: "Sanctuaries of The Wild",
  sanctuariesBody: "",
  ourStoryQuote: "", ourStoryBody: "", ourStoryBgImage: "",
  finalCtaHeadline: "", finalCtaSubcopy: "", finalCtaButtonLabel: "", finalCtaButtonHref: "",
};

export default function CmsHomePage() {
  const [form, setForm] = useState<HomeData>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cmsApi.isConfigured) { setLoading(false); return; }
    cmsApi.getHome()
      .then((d) => { setForm({ ...EMPTY, ...(d as Partial<HomeData>) }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = <K extends keyof HomeData>(k: K, v: HomeData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  /** Save only the fields that belong to a specific section */
  const save = (fields: Partial<HomeData>) =>
    cmsApi.updateHome(fields as Record<string, unknown>);

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <PageHeader
        title="Homepage Editor"
        description="Each section saves independently — edit only what you need."
      />

      {!cmsApi.isConfigured && (
        <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load and save homepage content." />
      )}

      <div className="space-y-5">

        {/* ── Section 1: Hero copy ───────────────────────────────────────── */}
        <SectionSaveCard
          title="Hero — Slideshow overlay text"
          description="Text shown on top of the hero video slideshow on the homepage."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({
            heroEyebrow: form.heroEyebrow,
            heroHeadline: form.heroHeadline,
            heroSubhead: form.heroSubhead,
          })}
          successMessage="Hero copy saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Eyebrow" hint="Small label above the headline e.g. 'Est. 2010 · Private & Exclusive'">
              <Input value={form.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} placeholder="Est. 2010 • Private & Exclusive" />
            </Field>
            <div />
            <div className="md:col-span-2">
              <Field label="Headline">
                <Input value={form.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} placeholder="Where Untamed Wild Meets Refined Luxury" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Subheading" hint="One or two supporting sentences beneath the headline.">
                <Textarea value={form.heroSubhead} onChange={(e) => set("heroSubhead", e.target.value)} rows={2} placeholder="Private safaris across Serengeti, Ruaha, and Katavi…" />
              </Field>
            </div>
          </div>
        </SectionSaveCard>

        {/* ── Section 2: Hero CTAs ──────────────────────────────────────── */}
        <SectionSaveCard
          title="Hero — Call-to-action buttons"
          description="The two buttons shown in the hero section."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({
            heroCtaPrimary: form.heroCtaPrimary,
            heroCtaPrimaryHref: form.heroCtaPrimaryHref,
            heroCtaSecondary: form.heroCtaSecondary,
            heroCtaSecondaryHref: form.heroCtaSecondaryHref,
          })}
          successMessage="Hero CTAs saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Primary button label">
              <Input value={form.heroCtaPrimary} onChange={(e) => set("heroCtaPrimary", e.target.value)} placeholder="Begin Your Journey" />
            </Field>
            <Field label="Primary button link">
              <Input value={form.heroCtaPrimaryHref} onChange={(e) => set("heroCtaPrimaryHref", e.target.value)} placeholder="/plan-your-safari" />
            </Field>
            <Field label="Secondary button label">
              <Input value={form.heroCtaSecondary} onChange={(e) => set("heroCtaSecondary", e.target.value)} placeholder="Explore Our Sanctuaries" />
            </Field>
            <Field label="Secondary button link">
              <Input value={form.heroCtaSecondaryHref} onChange={(e) => set("heroCtaSecondaryHref", e.target.value)} placeholder="/destinations" />
            </Field>
          </div>
        </SectionSaveCard>

        {/* ── Section 3: Tanzania Map ───────────────────────────────────── */}
        <SectionSaveCard
          title="Tanzania Map — Video section"
          description="The animated map section that shows circuit locations. Upload the video to Media Library first, then paste the URL here."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({
            mapHeading: form.mapHeading,
            mapVideoUrl: form.mapVideoUrl,
            mapVideoWebM: form.mapVideoWebM,
          })}
          successMessage="Map section saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Field label="Section heading">
                <Input value={form.mapHeading} onChange={(e) => set("mapHeading", e.target.value)} placeholder="Discover Tanzania's Untamed Frontiers" />
              </Field>
            </div>
            <Field label="Map video — MP4 URL" hint={<MediaLibraryHint />}>
              <Input type="url" value={form.mapVideoUrl} onChange={(e) => set("mapVideoUrl", e.target.value)} placeholder="https://cdn…/map.mp4" />
            </Field>
            <Field label="Map video — WebM URL (optional)" hint="Smaller file, better browser performance.">
              <Input type="url" value={form.mapVideoWebM} onChange={(e) => set("mapVideoWebM", e.target.value)} placeholder="https://cdn…/map.webm" />
            </Field>
          </div>
        </SectionSaveCard>

        {/* ── Section 4: Sanctuaries ───────────────────────────────────── */}
        <SectionSaveCard
          title="Sanctuaries — Destinations section"
          description="The section that introduces the destination cards grid."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({
            sanctuariesEyebrow: form.sanctuariesEyebrow,
            sanctuariesTitle: form.sanctuariesTitle,
            sanctuariesBody: form.sanctuariesBody,
          })}
          successMessage="Sanctuaries section saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Eyebrow" hint="Small label above the title e.g. 'Our destinations'">
              <Input value={form.sanctuariesEyebrow} onChange={(e) => set("sanctuariesEyebrow", e.target.value)} />
            </Field>
            <Field label="Section title">
              <Input value={form.sanctuariesTitle} onChange={(e) => set("sanctuariesTitle", e.target.value)} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Body text">
                <Textarea value={form.sanctuariesBody} onChange={(e) => set("sanctuariesBody", e.target.value)} rows={3} />
              </Field>
            </div>
          </div>
        </SectionSaveCard>

        {/* ── Section 5: Our Story ─────────────────────────────────────── */}
        <SectionSaveCard
          title="Our Story — Full-bleed quote section"
          description="The dramatic full-screen section with a background image and founder quote."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({
            ourStoryBgImage: form.ourStoryBgImage,
            ourStoryQuote: form.ourStoryQuote,
            ourStoryBody: form.ourStoryBody,
          })}
          successMessage="Our Story section saved."
        >
          <div className="space-y-4">
            <Field label="Background image URL" hint={<MediaLibraryHint />}>
              <Input type="url" value={form.ourStoryBgImage} onChange={(e) => set("ourStoryBgImage", e.target.value)} placeholder="https://cdn…/story-bg.jpg" />
            </Field>
            <Field label="Pull quote" hint="Displayed large and bold over the background.">
              <Textarea value={form.ourStoryQuote} onChange={(e) => set("ourStoryQuote", e.target.value)} rows={2} placeholder="We are wilderness architects." />
            </Field>
            <Field label="Body paragraphs">
              <Textarea value={form.ourStoryBody} onChange={(e) => set("ourStoryBody", e.target.value)} rows={5} />
            </Field>
          </div>
        </SectionSaveCard>

        {/* ── Section 6: Final CTA ─────────────────────────────────────── */}
        <SectionSaveCard
          title="Final call-to-action — Bottom of page"
          description="The closing section encouraging visitors to start planning their safari."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({
            finalCtaHeadline: form.finalCtaHeadline,
            finalCtaSubcopy: form.finalCtaSubcopy,
            finalCtaButtonLabel: form.finalCtaButtonLabel,
            finalCtaButtonHref: form.finalCtaButtonHref,
          })}
          successMessage="Final CTA saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Field label="Headline">
                <Input value={form.finalCtaHeadline} onChange={(e) => set("finalCtaHeadline", e.target.value)} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Supporting text">
                <Textarea value={form.finalCtaSubcopy} onChange={(e) => set("finalCtaSubcopy", e.target.value)} rows={2} />
              </Field>
            </div>
            <Field label="Button label">
              <Input value={form.finalCtaButtonLabel} onChange={(e) => set("finalCtaButtonLabel", e.target.value)} placeholder="Begin Your Journey" />
            </Field>
            <Field label="Button link">
              <Input value={form.finalCtaButtonHref} onChange={(e) => set("finalCtaButtonHref", e.target.value)} placeholder="/plan-your-safari" />
            </Field>
          </div>
        </SectionSaveCard>

      </div>
    </div>
  );
}
