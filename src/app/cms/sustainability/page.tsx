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

// Matches the SustainabilityContent shape the public page consumes (public-api.ts).
type Data = {
  heroEyebrow: string;
  heroImage: string;
  headline: string;
  subheadline: string;
  commitmentsEyebrow: string;
  fieldQuote: string;
  statsEyebrow: string;
  statsHeadline: string;
  statsNote: string;
  ctaEyebrow: string;
  ctaBody: string;
};

type Item = Record<string, string>;
type ArrayData = { pillars: Item[]; stats: Item[] };

const EMPTY: Data = {
  heroEyebrow: "", heroImage: "", headline: "", subheadline: "",
  commitmentsEyebrow: "", fieldQuote: "",
  statsEyebrow: "", statsHeadline: "", statsNote: "",
  ctaEyebrow: "", ctaBody: "",
};
const EMPTY_ARRAYS: ArrayData = { pillars: [], stats: [] };

const FIELDSETS: Record<keyof ArrayData, { key: string; label: string; textarea?: boolean }[]> = {
  pillars: [
    { key: "number", label: "Number" },
    { key: "title", label: "Title" },
    { key: "body", label: "Body", textarea: true },
    { key: "cta", label: "CTA label" },
    { key: "href", label: "CTA link" },
  ],
  stats: [
    { key: "value", label: "Value" },
    { key: "label", label: "Label" },
  ],
};

const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown) => (Array.isArray(v) ? (v as Item[]) : []);

export default function CmsSustainabilityPage() {
  const [form, setForm] = useState<Data>(EMPTY);
  const [arrays, setArrays] = useState<ArrayData>(EMPTY_ARRAYS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cmsApi.isConfigured) { setLoading(false); return; }
    cmsApi.getSustainability()
      .then((d) => {
        const c = (d ?? {}) as Record<string, unknown>;
        setForm({
          heroEyebrow: str(c.heroEyebrow), heroImage: str(c.heroImage),
          headline: str(c.headline), subheadline: str(c.subheadline),
          commitmentsEyebrow: str(c.commitmentsEyebrow), fieldQuote: str(c.fieldQuote),
          statsEyebrow: str(c.statsEyebrow), statsHeadline: str(c.statsHeadline), statsNote: str(c.statsNote),
          ctaEyebrow: str(c.ctaEyebrow), ctaBody: str(c.ctaBody),
        });
        setArrays({ pillars: arr(c.pillars), stats: arr(c.stats) });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => setForm((f) => ({ ...f, [k]: v }));
  const save = (fields: Record<string, unknown>) => cmsApi.updateSustainability(fields);
  const setArray = (k: keyof ArrayData, items: Item[]) => setArrays((a) => ({ ...a, [k]: items }));

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <PageHeader title="Sustainability Page" description="Each section saves independently." />
      {!cmsApi.isConfigured && <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load content." />}

      <div className="space-y-5">
        <SectionSaveCard
          title="Hero"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ heroEyebrow: form.heroEyebrow, heroImage: form.heroImage, headline: form.headline, subheadline: form.subheadline })}
          successMessage="Hero saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Eyebrow"><Input value={form.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} placeholder="Conservation & Community" /></Field>
            <Field label="Hero image URL" hint={<MediaLibraryHint />}><Input type="url" value={form.heroImage} onChange={(e) => set("heroImage", e.target.value)} /></Field>
            <div className="md:col-span-2"><Field label="Headline"><Input value={form.headline} onChange={(e) => set("headline", e.target.value)} placeholder="Travel that leaves a place better than it found it." /></Field></div>
            <div className="md:col-span-2"><Field label="Subheadline"><Textarea value={form.subheadline} onChange={(e) => set("subheadline", e.target.value)} rows={2} /></Field></div>
          </div>
        </SectionSaveCard>

        <SectionSaveCard
          title="Commitments (pillars)"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ commitmentsEyebrow: form.commitmentsEyebrow, fieldQuote: form.fieldQuote, pillars: arrays.pillars })}
          successMessage="Commitments saved."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Eyebrow"><Input value={form.commitmentsEyebrow} onChange={(e) => set("commitmentsEyebrow", e.target.value)} placeholder="Our Commitments" /></Field>
              <Field label="Field quote" hint="Italic quote over the image."><Input value={form.fieldQuote} onChange={(e) => set("fieldQuote", e.target.value)} /></Field>
            </div>
            <ItemListEditor itemKey="pillars" items={arrays.pillars} onChange={(v) => setArray("pillars", v)} addLabel="pillar" />
          </div>
        </SectionSaveCard>

        <SectionSaveCard
          title="Impact stats"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ statsEyebrow: form.statsEyebrow, statsHeadline: form.statsHeadline, statsNote: form.statsNote, stats: arrays.stats })}
          successMessage="Stats saved."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Eyebrow"><Input value={form.statsEyebrow} onChange={(e) => set("statsEyebrow", e.target.value)} placeholder="The Numbers Behind It" /></Field>
              <Field label="Heading"><Input value={form.statsHeadline} onChange={(e) => set("statsHeadline", e.target.value)} /></Field>
            </div>
            <ItemListEditor itemKey="stats" items={arrays.stats} onChange={(v) => setArray("stats", v)} addLabel="stat" />
            <Field label="Note" hint="Small caption below the stats."><Textarea value={form.statsNote} onChange={(e) => set("statsNote", e.target.value)} rows={2} /></Field>
          </div>
        </SectionSaveCard>

        <SectionSaveCard
          title="Call-to-action"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ ctaEyebrow: form.ctaEyebrow, ctaBody: form.ctaBody })}
          successMessage="CTA saved."
        >
          <div className="space-y-4">
            <Field label="Eyebrow"><Input value={form.ctaEyebrow} onChange={(e) => set("ctaEyebrow", e.target.value)} placeholder="Travel With Purpose" /></Field>
            <Field label="Body"><Textarea value={form.ctaBody} onChange={(e) => set("ctaBody", e.target.value)} rows={3} /></Field>
          </div>
        </SectionSaveCard>
      </div>
    </div>
  );
}

function ItemListEditor({
  itemKey, items, onChange, addLabel,
}: { itemKey: keyof ArrayData; items: Item[]; onChange: (items: Item[]) => void; addLabel: string }) {
  const fields = FIELDSETS[itemKey];
  const update = (i: number, key: string, value: string) => onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: value } : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, Object.fromEntries(fields.map((f) => [f.key, ""]))]);
  const move = (i: number, dir: -1 | 1) => {
    const next = i + dir; if (next < 0 || next >= items.length) return;
    const copy = [...items]; [copy[i], copy[next]] = [copy[next], copy[i]]; onChange(copy);
  };
  return (
    <div className="space-y-4">
      {items.length === 0 && <p className="text-xs text-[#8A9990] italic">Empty — the public site uses its built-in defaults until you add items here.</p>}
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-[#EAE4D0] bg-[#FDFCF9] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold">#{i + 1}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="rounded-lg p-1.5 text-[#6A7B70] hover:bg-[#EAE4D0]/70 disabled:opacity-30"><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down" className="rounded-lg p-1.5 text-[#6A7B70] hover:bg-[#EAE4D0]/70 disabled:opacity-30"><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
              <button type="button" onClick={() => remove(i)} aria-label="Remove" className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.key} className={f.textarea ? "md:col-span-2" : ""}>
                <Field label={f.label}>
                  {f.textarea ? <Textarea value={item[f.key] ?? ""} onChange={(e) => update(i, f.key, e.target.value)} rows={2} /> : <Input value={item[f.key] ?? ""} onChange={(e) => update(i, f.key, e.target.value)} />}
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
