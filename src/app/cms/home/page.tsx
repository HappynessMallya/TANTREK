"use client";

import { useEffect, useState } from "react";
import { cmsApi } from "@/lib/cms-api";
import { PageHeader } from "../_components/PageHeader";
import { Field } from "../_components/Field";
import { Input } from "../_components/Input";
import { Textarea } from "../_components/Textarea";
import { Button } from "../_components/Button";
import { Alert } from "../_components/Alert";
import { PageLoader } from "../_components/Spinner";
import { SectionSaveCard, MediaLibraryHint } from "../_components/SectionSaveCard";

// Flat scalar fields (match the backend `/home` content blob top-level keys,
// plus the per-section eyebrow/intro strings that live inside section objects).
type HomeData = {
  heroEyebrow: string; heroHeadline: string; heroSubhead: string;
  heroCtaPrimary: string; heroCtaPrimaryHref: string;
  heroCtaSecondary: string; heroCtaSecondaryHref: string;
  mapVideoUrl: string; mapVideoWebM: string; mapHeading: string;
  sanctuariesEyebrow: string; sanctuariesTitle: string; sanctuariesBody: string;
  ourStoryQuote: string; ourStoryBody: string; ourStoryBgImage: string;
  finalCtaEyebrow: string; finalCtaHeadline: string; finalCtaSubcopy: string;
  finalCtaButtonLabel: string; finalCtaButtonHref: string;
  // brandStatement.*
  brandEyebrow: string; brandPullquote: string; brandBody1: string; brandBody2: string;
  // section eyebrows / intros
  signatureEyebrow: string; signatureIntro: string;
  whyEyebrow: string;
  accommodationsEyebrow: string; accommodationsIntro: string;
  seasonsEyebrow: string; seasonsIntro: string;
  testimonialsEyebrow: string;
  // conservation.*
  conservationEyebrow: string; conservationWhereItGoes: string; conservationWhoWeWorkWith: string;
};

type Item = Record<string, string>;
type ArrayData = {
  signature: Item[];
  featuredCircuits: Item[];
  why: Item[];
  accommodations: Item[];
  seasons: Item[];
  testimonials: Item[];
  impactStats: Item[];
};

const EMPTY: HomeData = {
  heroEyebrow: "", heroHeadline: "", heroSubhead: "",
  heroCtaPrimary: "", heroCtaPrimaryHref: "",
  heroCtaSecondary: "", heroCtaSecondaryHref: "",
  mapVideoUrl: "", mapVideoWebM: "", mapHeading: "",
  sanctuariesEyebrow: "", sanctuariesTitle: "", sanctuariesBody: "",
  ourStoryQuote: "", ourStoryBody: "", ourStoryBgImage: "",
  finalCtaEyebrow: "", finalCtaHeadline: "", finalCtaSubcopy: "",
  finalCtaButtonLabel: "", finalCtaButtonHref: "",
  brandEyebrow: "", brandPullquote: "", brandBody1: "", brandBody2: "",
  signatureEyebrow: "", signatureIntro: "",
  whyEyebrow: "",
  accommodationsEyebrow: "", accommodationsIntro: "",
  seasonsEyebrow: "", seasonsIntro: "",
  testimonialsEyebrow: "",
  conservationEyebrow: "", conservationWhereItGoes: "", conservationWhoWeWorkWith: "",
};

const EMPTY_ARRAYS: ArrayData = {
  signature: [], featuredCircuits: [], why: [], accommodations: [], seasons: [], testimonials: [], impactStats: [],
};

const FIELDSETS: Record<keyof ArrayData, { key: string; label: string; textarea?: boolean }[]> = {
  signature: [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "title", label: "Title" },
    { key: "blurb", label: "Blurb", textarea: true },
    { key: "href", label: "Link" },
    { key: "image", label: "Image URL" },
  ],
  featuredCircuits: [
    { key: "title", label: "Title" },
    { key: "pullQuote", label: "Pull quote" },
    { key: "body", label: "Body", textarea: true },
    { key: "meta", label: "Meta line" },
    { key: "href", label: "Link" },
    { key: "image", label: "Image URL" },
  ],
  why: [
    { key: "number", label: "Number" },
    { key: "title", label: "Title" },
    { key: "body", label: "Body", textarea: true },
  ],
  accommodations: [
    { key: "name", label: "Name" },
    { key: "region", label: "Region" },
    { key: "blurb", label: "Blurb", textarea: true },
    { key: "image", label: "Image URL" },
  ],
  seasons: [
    { key: "months", label: "Months" },
    { key: "title", label: "Title" },
    { key: "body", label: "Body", textarea: true },
  ],
  testimonials: [
    { key: "quote", label: "Quote", textarea: true },
    { key: "name", label: "Name" },
    { key: "trip", label: "Trip / context" },
    { key: "initials", label: "Initials" },
  ],
  impactStats: [
    { key: "value", label: "Value" },
    { key: "label", label: "Label" },
  ],
};

type Obj = Record<string, unknown>;
const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown) => (Array.isArray(v) ? (v as Item[]) : []);

export default function CmsHomePage() {
  const [form, setForm] = useState<HomeData>(EMPTY);
  const [arrays, setArrays] = useState<ArrayData>(EMPTY_ARRAYS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cmsApi.isConfigured) { setLoading(false); return; }
    cmsApi.getHome()
      .then((d) => {
        const c = (d ?? {}) as Obj;
        const brand = (c.brandStatement ?? {}) as Obj;
        const sig = (c.signatureJourneys ?? {}) as Obj;
        const why = (c.whyTravel ?? {}) as Obj;
        const acc = (c.accommodations ?? {}) as Obj;
        const sea = (c.seasons ?? {}) as Obj;
        const tes = (c.testimonials ?? {}) as Obj;
        const con = (c.conservation ?? {}) as Obj;
        setForm({
          ...EMPTY,
          ...(c as Partial<HomeData>),
          brandEyebrow: str(brand.eyebrow), brandPullquote: str(brand.pullquote), brandBody1: str(brand.body1), brandBody2: str(brand.body2),
          signatureEyebrow: str(sig.eyebrow), signatureIntro: str(sig.intro),
          whyEyebrow: str(why.eyebrow),
          accommodationsEyebrow: str(acc.eyebrow), accommodationsIntro: str(acc.intro),
          seasonsEyebrow: str(sea.eyebrow), seasonsIntro: str(sea.intro),
          testimonialsEyebrow: str(tes.eyebrow),
          conservationEyebrow: str(con.eyebrow), conservationWhereItGoes: str(con.whereItGoes), conservationWhoWeWorkWith: str(con.whoWeWorkWith),
        });
        setArrays({
          signature: arr(sig.items),
          featuredCircuits: arr(c.featuredCircuits),
          why: arr(why.items),
          accommodations: arr(acc.items),
          seasons: arr(sea.items),
          testimonials: arr(tes.items),
          impactStats: arr(c.impactStats),
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const set = <K extends keyof HomeData>(k: K, v: HomeData[K]) => setForm((f) => ({ ...f, [k]: v }));
  const save = (fields: Obj) => cmsApi.updateHome(fields);
  const setArray = (key: keyof ArrayData, items: Item[]) => setArrays((a) => ({ ...a, [key]: items }));

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <PageHeader title="Homepage Editor" description="Each section saves independently — edit only what you need." />
      {!cmsApi.isConfigured && <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load and save homepage content." />}

      <div className="space-y-5">
        {/* Hero copy */}
        <SectionSaveCard
          title="Hero — Slideshow overlay text"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ heroEyebrow: form.heroEyebrow, heroHeadline: form.heroHeadline, heroSubhead: form.heroSubhead })}
          successMessage="Hero copy saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Eyebrow"><Input value={form.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} /></Field>
            <div />
            <div className="md:col-span-2"><Field label="Headline" hint="Use a line break for the accent line."><Input value={form.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} /></Field></div>
            <div className="md:col-span-2"><Field label="Subheading"><Textarea value={form.heroSubhead} onChange={(e) => set("heroSubhead", e.target.value)} rows={2} /></Field></div>
          </div>
        </SectionSaveCard>

        {/* Hero CTAs */}
        <SectionSaveCard
          title="Hero — Call-to-action buttons"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ heroCtaPrimary: form.heroCtaPrimary, heroCtaPrimaryHref: form.heroCtaPrimaryHref, heroCtaSecondary: form.heroCtaSecondary, heroCtaSecondaryHref: form.heroCtaSecondaryHref })}
          successMessage="Hero CTAs saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Primary label"><Input value={form.heroCtaPrimary} onChange={(e) => set("heroCtaPrimary", e.target.value)} /></Field>
            <Field label="Primary link"><Input value={form.heroCtaPrimaryHref} onChange={(e) => set("heroCtaPrimaryHref", e.target.value)} /></Field>
            <Field label="Secondary label"><Input value={form.heroCtaSecondary} onChange={(e) => set("heroCtaSecondary", e.target.value)} /></Field>
            <Field label="Secondary link"><Input value={form.heroCtaSecondaryHref} onChange={(e) => set("heroCtaSecondaryHref", e.target.value)} /></Field>
          </div>
        </SectionSaveCard>

        {/* Brand statement */}
        <SectionSaveCard
          title="Brand statement"
          description="Editorial pull-quote + framing paragraphs near the top of the page."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ brandStatement: { eyebrow: form.brandEyebrow, pullquote: form.brandPullquote, body1: form.brandBody1, body2: form.brandBody2 } })}
          successMessage="Brand statement saved."
        >
          <div className="space-y-4">
            <Field label="Eyebrow"><Input value={form.brandEyebrow} onChange={(e) => set("brandEyebrow", e.target.value)} /></Field>
            <Field label="Pull quote"><Textarea value={form.brandPullquote} onChange={(e) => set("brandPullquote", e.target.value)} rows={2} /></Field>
            <Field label="Paragraph 1"><Textarea value={form.brandBody1} onChange={(e) => set("brandBody1", e.target.value)} rows={3} /></Field>
            <Field label="Paragraph 2"><Textarea value={form.brandBody2} onChange={(e) => set("brandBody2", e.target.value)} rows={3} /></Field>
          </div>
        </SectionSaveCard>

        {/* Signature journeys */}
        <SectionSaveCard
          title="Signature journeys"
          description="Eyebrow, intro and the four feature tiles (first is the large feature)."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ signatureJourneys: { eyebrow: form.signatureEyebrow, intro: form.signatureIntro, items: arrays.signature } })}
          successMessage="Signature journeys saved."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Eyebrow"><Input value={form.signatureEyebrow} onChange={(e) => set("signatureEyebrow", e.target.value)} /></Field>
              <Field label="Intro"><Input value={form.signatureIntro} onChange={(e) => set("signatureIntro", e.target.value)} /></Field>
            </div>
            <ItemListEditor itemKey="signature" items={arrays.signature} onChange={(v) => setArray("signature", v)} addLabel="journey" />
          </div>
        </SectionSaveCard>

        {/* Map */}
        <SectionSaveCard
          title="Tanzania Map — Video section"
          description="Upload the video to the Media Library first, then paste the URL here."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ mapHeading: form.mapHeading, mapVideoUrl: form.mapVideoUrl, mapVideoWebM: form.mapVideoWebM })}
          successMessage="Map section saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><Field label="Section heading"><Input value={form.mapHeading} onChange={(e) => set("mapHeading", e.target.value)} /></Field></div>
            <Field label="Map video — MP4 URL" hint={<MediaLibraryHint />}><Input type="url" value={form.mapVideoUrl} onChange={(e) => set("mapVideoUrl", e.target.value)} /></Field>
            <Field label="Map video — WebM URL (optional)"><Input type="url" value={form.mapVideoWebM} onChange={(e) => set("mapVideoWebM", e.target.value)} /></Field>
          </div>
        </SectionSaveCard>

        {/* Sanctuaries */}
        <SectionSaveCard
          title="Sanctuaries — Destinations section heading"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ sanctuariesEyebrow: form.sanctuariesEyebrow, sanctuariesTitle: form.sanctuariesTitle, sanctuariesBody: form.sanctuariesBody })}
          successMessage="Sanctuaries section saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Eyebrow"><Input value={form.sanctuariesEyebrow} onChange={(e) => set("sanctuariesEyebrow", e.target.value)} /></Field>
            <Field label="Section title"><Input value={form.sanctuariesTitle} onChange={(e) => set("sanctuariesTitle", e.target.value)} /></Field>
            <div className="md:col-span-2"><Field label="Body text"><Textarea value={form.sanctuariesBody} onChange={(e) => set("sanctuariesBody", e.target.value)} rows={3} /></Field></div>
          </div>
        </SectionSaveCard>

        {/* Featured circuits */}
        <SectionSaveCard
          title="Featured circuits"
          description="The three circuit cards in the destinations section."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ featuredCircuits: arrays.featuredCircuits })}
          successMessage="Featured circuits saved."
        >
          <ItemListEditor itemKey="featuredCircuits" items={arrays.featuredCircuits} onChange={(v) => setArray("featuredCircuits", v)} addLabel="circuit" />
        </SectionSaveCard>

        {/* Why travel */}
        <SectionSaveCard
          title="Why travel with us"
          description="Eyebrow + the numbered reasons block."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ whyTravel: { eyebrow: form.whyEyebrow, items: arrays.why } })}
          successMessage="Reasons saved."
        >
          <div className="space-y-4">
            <Field label="Eyebrow"><Input value={form.whyEyebrow} onChange={(e) => set("whyEyebrow", e.target.value)} /></Field>
            <ItemListEditor itemKey="why" items={arrays.why} onChange={(v) => setArray("why", v)} addLabel="reason" />
          </div>
        </SectionSaveCard>

        {/* Accommodations */}
        <SectionSaveCard
          title="Accommodations"
          description="Eyebrow, intro and the lodges/camps (first is the large feature)."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ accommodations: { eyebrow: form.accommodationsEyebrow, intro: form.accommodationsIntro, items: arrays.accommodations } })}
          successMessage="Accommodations saved."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Eyebrow"><Input value={form.accommodationsEyebrow} onChange={(e) => set("accommodationsEyebrow", e.target.value)} /></Field>
              <Field label="Intro"><Input value={form.accommodationsIntro} onChange={(e) => set("accommodationsIntro", e.target.value)} /></Field>
            </div>
            <ItemListEditor itemKey="accommodations" items={arrays.accommodations} onChange={(v) => setArray("accommodations", v)} addLabel="lodge" />
          </div>
        </SectionSaveCard>

        {/* Seasons */}
        <SectionSaveCard
          title="Seasonal calendar"
          description="Eyebrow, intro and the four-season timeline cards."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ seasons: { eyebrow: form.seasonsEyebrow, intro: form.seasonsIntro, items: arrays.seasons } })}
          successMessage="Seasons saved."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Eyebrow"><Input value={form.seasonsEyebrow} onChange={(e) => set("seasonsEyebrow", e.target.value)} /></Field>
              <Field label="Intro"><Input value={form.seasonsIntro} onChange={(e) => set("seasonsIntro", e.target.value)} /></Field>
            </div>
            <ItemListEditor itemKey="seasons" items={arrays.seasons} onChange={(v) => setArray("seasons", v)} addLabel="season" />
          </div>
        </SectionSaveCard>

        {/* Testimonials */}
        <SectionSaveCard
          title="Traveler stories"
          description="Eyebrow + the rotating testimonials."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ testimonials: { eyebrow: form.testimonialsEyebrow, items: arrays.testimonials } })}
          successMessage="Testimonials saved."
        >
          <div className="space-y-4">
            <Field label="Eyebrow"><Input value={form.testimonialsEyebrow} onChange={(e) => set("testimonialsEyebrow", e.target.value)} /></Field>
            <ItemListEditor itemKey="testimonials" items={arrays.testimonials} onChange={(v) => setArray("testimonials", v)} addLabel="testimonial" />
          </div>
        </SectionSaveCard>

        {/* Impact stats */}
        <SectionSaveCard
          title="Impact stats"
          description="The three stat figures beneath the testimonials."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ impactStats: arrays.impactStats })}
          successMessage="Impact stats saved."
        >
          <ItemListEditor itemKey="impactStats" items={arrays.impactStats} onChange={(v) => setArray("impactStats", v)} addLabel="stat" />
        </SectionSaveCard>

        {/* Our Story */}
        <SectionSaveCard
          title="Our Story — Full-bleed quote section"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ ourStoryBgImage: form.ourStoryBgImage, ourStoryQuote: form.ourStoryQuote, ourStoryBody: form.ourStoryBody })}
          successMessage="Our Story section saved."
        >
          <div className="space-y-4">
            <Field label="Background image URL" hint={<MediaLibraryHint />}><Input type="url" value={form.ourStoryBgImage} onChange={(e) => set("ourStoryBgImage", e.target.value)} /></Field>
            <Field label="Pull quote"><Textarea value={form.ourStoryQuote} onChange={(e) => set("ourStoryQuote", e.target.value)} rows={2} /></Field>
            <Field label="Body paragraphs" hint="Separate paragraphs with a blank line."><Textarea value={form.ourStoryBody} onChange={(e) => set("ourStoryBody", e.target.value)} rows={5} /></Field>
          </div>
        </SectionSaveCard>

        {/* Conservation side-notes */}
        <SectionSaveCard
          title="Conservation side-notes"
          description="Eyebrow + the two notes beside the Our Story text."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ conservation: { eyebrow: form.conservationEyebrow, whereItGoes: form.conservationWhereItGoes, whoWeWorkWith: form.conservationWhoWeWorkWith } })}
          successMessage="Conservation notes saved."
        >
          <div className="space-y-4">
            <Field label="Eyebrow"><Input value={form.conservationEyebrow} onChange={(e) => set("conservationEyebrow", e.target.value)} /></Field>
            <Field label="Where it goes"><Textarea value={form.conservationWhereItGoes} onChange={(e) => set("conservationWhereItGoes", e.target.value)} rows={3} /></Field>
            <Field label="Who we work with"><Textarea value={form.conservationWhoWeWorkWith} onChange={(e) => set("conservationWhoWeWorkWith", e.target.value)} rows={3} /></Field>
          </div>
        </SectionSaveCard>

        {/* Final CTA */}
        <SectionSaveCard
          title="Final call-to-action"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ finalCtaEyebrow: form.finalCtaEyebrow, finalCtaHeadline: form.finalCtaHeadline, finalCtaSubcopy: form.finalCtaSubcopy, finalCtaButtonLabel: form.finalCtaButtonLabel, finalCtaButtonHref: form.finalCtaButtonHref })}
          successMessage="Final CTA saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Eyebrow"><Input value={form.finalCtaEyebrow} onChange={(e) => set("finalCtaEyebrow", e.target.value)} /></Field>
            <div />
            <div className="md:col-span-2"><Field label="Headline"><Input value={form.finalCtaHeadline} onChange={(e) => set("finalCtaHeadline", e.target.value)} /></Field></div>
            <div className="md:col-span-2"><Field label="Supporting text"><Textarea value={form.finalCtaSubcopy} onChange={(e) => set("finalCtaSubcopy", e.target.value)} rows={2} /></Field></div>
            <Field label="Button label"><Input value={form.finalCtaButtonLabel} onChange={(e) => set("finalCtaButtonLabel", e.target.value)} /></Field>
            <Field label="Button link"><Input value={form.finalCtaButtonHref} onChange={(e) => set("finalCtaButtonHref", e.target.value)} /></Field>
          </div>
        </SectionSaveCard>
      </div>
    </div>
  );
}

// ─── Generic repeater for an array of items ─────────────────────────────────
function ItemListEditor({
  itemKey,
  items,
  onChange,
  addLabel,
}: {
  itemKey: keyof ArrayData;
  items: Item[];
  onChange: (items: Item[]) => void;
  addLabel: string;
}) {
  const fields = FIELDSETS[itemKey];
  const update = (i: number, key: string, value: string) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: value } : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, Object.fromEntries(fields.map((f) => [f.key, ""]))]);
  const move = (i: number, dir: -1 | 1) => {
    const next = i + dir;
    if (next < 0 || next >= items.length) return;
    const copy = [...items];
    [copy[i], copy[next]] = [copy[next], copy[i]];
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-xs text-[#8A9990] italic">Empty — the public site uses its built-in defaults until you add items here.</p>
      )}
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-[#EAE4D0] bg-[#FDFCF9] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold">#{i + 1}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="rounded-lg p-1.5 text-[#6A7B70] hover:bg-[#EAE4D0]/70 disabled:opacity-30">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down" className="rounded-lg p-1.5 text-[#6A7B70] hover:bg-[#EAE4D0]/70 disabled:opacity-30">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <button type="button" onClick={() => remove(i)} aria-label="Remove" className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.key} className={f.textarea ? "md:col-span-2" : ""}>
                <Field label={f.label}>
                  {f.textarea ? (
                    <Textarea value={item[f.key] ?? ""} onChange={(e) => update(i, f.key, e.target.value)} rows={2} />
                  ) : (
                    <Input value={item[f.key] ?? ""} onChange={(e) => update(i, f.key, e.target.value)} />
                  )}
                </Field>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={add}>+ Add {addLabel}</Button>
    </div>
  );
}
