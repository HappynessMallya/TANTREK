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

// Matches the AboutContent shape the public About page consumes (public-api.ts).
type AboutData = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  foundationEyebrow: string;
  foundationHeadline: string;
  storyBody: string;
  foundationTags: string[];
  foundationImage: string;
  commitmentsEyebrow: string;
  commitmentsHeadline: string;
  commitmentsIntro: string;
  teamEyebrow: string;
  teamHeadline: string;
  teamIntro: string;
  teamNote: string;
  founderQuote: string;
  founderName: string;
  founderTitle: string;
  ctaEyebrow: string;
  ctaHeadline: string;
  ctaBody: string;
};

type Item = Record<string, string>;
type ArrayData = { commitments: Item[]; team: Item[]; testimonials: Item[] };

const EMPTY: AboutData = {
  heroEyebrow: "", heroHeadline: "", heroSubheadline: "", heroImage: "",
  foundationEyebrow: "", foundationHeadline: "", storyBody: "", foundationTags: [], foundationImage: "",
  commitmentsEyebrow: "", commitmentsHeadline: "", commitmentsIntro: "",
  teamEyebrow: "", teamHeadline: "", teamIntro: "", teamNote: "",
  founderQuote: "", founderName: "", founderTitle: "",
  ctaEyebrow: "", ctaHeadline: "", ctaBody: "",
};

const EMPTY_ARRAYS: ArrayData = { commitments: [], team: [], testimonials: [] };

const FIELDSETS: Record<keyof ArrayData, { key: string; label: string; textarea?: boolean }[]> = {
  commitments: [
    { key: "number", label: "Number" },
    { key: "title", label: "Title" },
    { key: "body", label: "Body", textarea: true },
  ],
  team: [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "imageUrl", label: "Photo URL" },
    { key: "alt", label: "Photo alt text" },
  ],
  testimonials: [
    { key: "quote", label: "Quote", textarea: true },
    { key: "name", label: "Name" },
    { key: "location", label: "Location" },
  ],
};

function toLines(a: string[]) { return a.join("\n"); }
function fromLines(s: string) { return s.split("\n").map((l) => l.trim()).filter(Boolean); }

export default function CmsAboutPage() {
  const [form, setForm] = useState<AboutData>(EMPTY);
  const [arrays, setArrays] = useState<ArrayData>(EMPTY_ARRAYS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cmsApi.isConfigured) { setLoading(false); return; }
    cmsApi.getAbout()
      .then((d) => {
        const data = (d ?? {}) as Record<string, unknown>;
        setForm({ ...EMPTY, ...(data as Partial<AboutData>) });
        setArrays({
          commitments: (data.commitments as Item[]) ?? [],
          team: (data.team as Item[]) ?? [],
          testimonials: (data.testimonials as Item[]) ?? [],
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const set = <K extends keyof AboutData>(k: K, v: AboutData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = (fields: Partial<AboutData>) =>
    cmsApi.updateAbout(fields as Record<string, unknown>);

  const setArray = (key: keyof ArrayData, items: Item[]) =>
    setArrays((a) => ({ ...a, [key]: items }));
  const saveArray = (key: keyof ArrayData) =>
    cmsApi.updateAbout({ [key]: arrays[key] } as Record<string, unknown>);

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <PageHeader title="About Page" description="Each section saves independently — edit only what you need." />
      {!cmsApi.isConfigured && <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load content." />}

      <div className="space-y-5">
        {/* Hero */}
        <SectionSaveCard
          title="Hero"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ heroEyebrow: form.heroEyebrow, heroHeadline: form.heroHeadline, heroSubheadline: form.heroSubheadline, heroImage: form.heroImage })}
          successMessage="Hero saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Eyebrow"><Input value={form.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} placeholder="About Tantrek" /></Field>
            <Field label="Headline"><Input value={form.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} placeholder="Travel, trade, and trust." /></Field>
            <div className="md:col-span-2"><Field label="Subheadline"><Textarea value={form.heroSubheadline} onChange={(e) => set("heroSubheadline", e.target.value)} rows={2} /></Field></div>
            <div className="md:col-span-2"><Field label="Hero image URL" hint={<MediaLibraryHint />}><Input type="url" value={form.heroImage} onChange={(e) => set("heroImage", e.target.value)} /></Field></div>
          </div>
        </SectionSaveCard>

        {/* Foundation */}
        <SectionSaveCard
          title="Foundation — story"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ foundationEyebrow: form.foundationEyebrow, foundationHeadline: form.foundationHeadline, storyBody: form.storyBody, foundationTags: form.foundationTags, foundationImage: form.foundationImage })}
          successMessage="Foundation saved."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Eyebrow"><Input value={form.foundationEyebrow} onChange={(e) => set("foundationEyebrow", e.target.value)} placeholder="Our Foundation" /></Field>
              <Field label="Headline"><Input value={form.foundationHeadline} onChange={(e) => set("foundationHeadline", e.target.value)} placeholder="Built on unwavering honesty & integrity." /></Field>
            </div>
            <Field label="Story body" hint="Separate paragraphs with a blank line."><Textarea value={form.storyBody} onChange={(e) => set("storyBody", e.target.value)} rows={6} /></Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Tags (one per line)"><Textarea value={toLines(form.foundationTags)} onChange={(e) => set("foundationTags", fromLines(e.target.value))} rows={3} placeholder={"Tourism\nSafaris\nInvestment"} /></Field>
              <Field label="Foundation image URL" hint={<MediaLibraryHint />}><Input type="url" value={form.foundationImage} onChange={(e) => set("foundationImage", e.target.value)} /></Field>
            </div>
          </div>
        </SectionSaveCard>

        {/* Commitments */}
        <SectionSaveCard
          title="Commitments (Travel / Trade / Trust)"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ commitmentsEyebrow: form.commitmentsEyebrow, commitmentsHeadline: form.commitmentsHeadline, commitmentsIntro: form.commitmentsIntro }).then(() => saveArray("commitments"))}
          successMessage="Commitments saved."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Eyebrow"><Input value={form.commitmentsEyebrow} onChange={(e) => set("commitmentsEyebrow", e.target.value)} placeholder="What We Do" /></Field>
              <Field label="Headline"><Input value={form.commitmentsHeadline} onChange={(e) => set("commitmentsHeadline", e.target.value)} placeholder="Three commitments, one journey." /></Field>
            </div>
            <Field label="Intro"><Textarea value={form.commitmentsIntro} onChange={(e) => set("commitmentsIntro", e.target.value)} rows={2} /></Field>
            <ItemListEditor itemKey="commitments" items={arrays.commitments} onChange={(v) => setArray("commitments", v)} addLabel="commitment" />
          </div>
        </SectionSaveCard>

        {/* Team */}
        <SectionSaveCard
          title="Team"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ teamEyebrow: form.teamEyebrow, teamHeadline: form.teamHeadline, teamIntro: form.teamIntro, teamNote: form.teamNote }).then(() => saveArray("team"))}
          successMessage="Team saved."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Eyebrow"><Input value={form.teamEyebrow} onChange={(e) => set("teamEyebrow", e.target.value)} placeholder="The Team" /></Field>
              <Field label="Headline"><Input value={form.teamHeadline} onChange={(e) => set("teamHeadline", e.target.value)} placeholder="The people behind the 360°." /></Field>
            </div>
            <Field label="Intro"><Textarea value={form.teamIntro} onChange={(e) => set("teamIntro", e.target.value)} rows={2} /></Field>
            <Field label="Note" hint="Small caption below the team grid."><Input value={form.teamNote} onChange={(e) => set("teamNote", e.target.value)} /></Field>
            <ItemListEditor itemKey="team" items={arrays.team} onChange={(v) => setArray("team", v)} addLabel="member" />
          </div>
        </SectionSaveCard>

        {/* Testimonials */}
        <SectionSaveCard
          title="Testimonials"
          disabled={!cmsApi.isConfigured}
          onSave={() => saveArray("testimonials")}
          successMessage="Testimonials saved."
        >
          <ItemListEditor itemKey="testimonials" items={arrays.testimonials} onChange={(v) => setArray("testimonials", v)} addLabel="testimonial" />
        </SectionSaveCard>

        {/* Founder */}
        <SectionSaveCard
          title="Founder quote"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ founderQuote: form.founderQuote, founderName: form.founderName, founderTitle: form.founderTitle })}
          successMessage="Founder section saved."
        >
          <div className="space-y-4">
            <Field label="Quote"><Textarea value={form.founderQuote} onChange={(e) => set("founderQuote", e.target.value)} rows={4} /></Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Name"><Input value={form.founderName} onChange={(e) => set("founderName", e.target.value)} placeholder="Tantrek Founders" /></Field>
              <Field label="Title"><Input value={form.founderTitle} onChange={(e) => set("founderTitle", e.target.value)} placeholder="Vision & Leadership" /></Field>
            </div>
          </div>
        </SectionSaveCard>

        {/* CTA */}
        <SectionSaveCard
          title="Call-to-action"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ ctaEyebrow: form.ctaEyebrow, ctaHeadline: form.ctaHeadline, ctaBody: form.ctaBody })}
          successMessage="CTA saved."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Eyebrow"><Input value={form.ctaEyebrow} onChange={(e) => set("ctaEyebrow", e.target.value)} placeholder="Begin a Conversation" /></Field>
              <Field label="Headline"><Input value={form.ctaHeadline} onChange={(e) => set("ctaHeadline", e.target.value)} placeholder="Impact, community, and the long view." /></Field>
            </div>
            <Field label="Body"><Textarea value={form.ctaBody} onChange={(e) => set("ctaBody", e.target.value)} rows={3} /></Field>
          </div>
        </SectionSaveCard>
      </div>
    </div>
  );
}

// ─── Generic repeater (shared shape with the home editor) ───────────────────
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
