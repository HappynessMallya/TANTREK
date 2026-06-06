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
import { SectionSaveCard } from "../_components/SectionSaveCard";

// Matches the PlanContent shape the public Plan Your Safari page consumes (public-api.ts).
type Data = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubhead: string;
};

type Item = Record<string, string>;
const STEP_FIELDS = [
  { key: "step", label: "Number" },
  { key: "title", label: "Title" },
  { key: "body", label: "Body", textarea: true },
];

const EMPTY: Data = { heroEyebrow: "", heroHeadline: "", heroSubhead: "" };
const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown) => (Array.isArray(v) ? (v as Item[]) : []);

export default function CmsPlanPage() {
  const [form, setForm] = useState<Data>(EMPTY);
  const [steps, setSteps] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cmsApi.isConfigured) { setLoading(false); return; }
    cmsApi.getPlanYourSafari()
      .then((d) => {
        const c = (d ?? {}) as Record<string, unknown>;
        setForm({ heroEyebrow: str(c.heroEyebrow), heroHeadline: str(c.heroHeadline), heroSubhead: str(c.heroSubhead) });
        setSteps(arr(c.steps));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => setForm((f) => ({ ...f, [k]: v }));
  const save = (fields: Record<string, unknown>) => cmsApi.updatePlanYourSafari(fields);

  const updateStep = (i: number, key: string, value: string) => setSteps((s) => s.map((it, idx) => (idx === i ? { ...it, [key]: value } : it)));
  const removeStep = (i: number) => setSteps((s) => s.filter((_, idx) => idx !== i));
  const addStep = () => setSteps((s) => [...s, { step: "", title: "", body: "" }]);
  const moveStep = (i: number, dir: -1 | 1) => {
    const next = i + dir; if (next < 0 || next >= steps.length) return;
    setSteps((s) => { const c = [...s]; [c[i], c[next]] = [c[next], c[i]]; return c; });
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <PageHeader title="Plan Your Safari Page" description="Edit the page hero and the 'what happens next' steps. (The inquiry form itself is fixed and sends to WhatsApp.)" />
      {!cmsApi.isConfigured && <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load content." />}

      <div className="space-y-5">
        <SectionSaveCard
          title="Hero"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ heroEyebrow: form.heroEyebrow, heroHeadline: form.heroHeadline, heroSubhead: form.heroSubhead })}
          successMessage="Hero saved."
        >
          <div className="space-y-4">
            <Field label="Eyebrow"><Input value={form.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} placeholder="Safari Design Studio" /></Field>
            <Field label="Headline"><Input value={form.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} placeholder="Begin your African story." /></Field>
            <Field label="Subheadline"><Textarea value={form.heroSubhead} onChange={(e) => set("heroSubhead", e.target.value)} rows={2} /></Field>
          </div>
        </SectionSaveCard>

        <SectionSaveCard
          title="What happens next (steps)"
          description="The three steps shown below the hero."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ steps })}
          successMessage="Steps saved."
        >
          <div className="space-y-4">
            {steps.length === 0 && <p className="text-xs text-[#8A9990] italic">Empty — the public page uses its built-in defaults until you add steps here.</p>}
            {steps.map((item, i) => (
              <div key={i} className="rounded-xl border border-[#EAE4D0] bg-[#FDFCF9] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold">#{i + 1}</span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveStep(i, -1)} disabled={i === 0} aria-label="Move up" className="rounded-lg p-1.5 text-[#6A7B70] hover:bg-[#EAE4D0]/70 disabled:opacity-30"><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
                    <button type="button" onClick={() => moveStep(i, 1)} disabled={i === steps.length - 1} aria-label="Move down" className="rounded-lg p-1.5 text-[#6A7B70] hover:bg-[#EAE4D0]/70 disabled:opacity-30"><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                    <button type="button" onClick={() => removeStep(i)} aria-label="Remove" className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {STEP_FIELDS.map((f) => (
                    <div key={f.key} className={f.textarea ? "md:col-span-2" : ""}>
                      <Field label={f.label}>
                        {f.textarea ? <Textarea value={item[f.key] ?? ""} onChange={(e) => updateStep(i, f.key, e.target.value)} rows={2} /> : <Input value={item[f.key] ?? ""} onChange={(e) => updateStep(i, f.key, e.target.value)} />}
                      </Field>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={addStep}>+ Add step</Button>
          </div>
        </SectionSaveCard>
      </div>
    </div>
  );
}
