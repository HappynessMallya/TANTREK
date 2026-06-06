"use client";

import { useEffect, useState } from "react";
import { cmsApi } from "@/lib/cms-api";
import { PageHeader } from "../_components/PageHeader";
import { Card, CardSection } from "../_components/Card";
import { Field } from "../_components/Field";
import { Input } from "../_components/Input";
import { Textarea } from "../_components/Textarea";
import { SaveBar } from "../_components/SaveBar";
import { Alert } from "../_components/Alert";
import { PageLoader } from "../_components/Spinner";

type LegalPage = { title: string; metaDescription: string; body: string };
type Tab = "privacy" | "terms" | "cookies";

const TABS: { id: Tab; label: string }[] = [
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms & Conditions" },
  { id: "cookies", label: "Cookie Policy" },
];

const EMPTY: LegalPage = { title: "", metaDescription: "", body: "" };

export default function CmsLegalPage() {
  const [tab, setTab] = useState<Tab>("privacy");
  const [forms, setForms] = useState<Record<Tab, LegalPage>>({
    privacy: EMPTY, terms: EMPTY, cookies: EMPTY,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!cmsApi.isConfigured) { setLoading(false); return; }
    Promise.allSettled([
      cmsApi.getLegal("privacy"),
      cmsApi.getLegal("terms"),
      cmsApi.getLegal("cookies"),
    ]).then(([p, t, c]) => {
      setForms({
        privacy: p.status === "fulfilled" ? { ...EMPTY, ...(p.value as unknown as LegalPage) } : EMPTY,
        terms: t.status === "fulfilled" ? { ...EMPTY, ...(t.value as unknown as LegalPage) } : EMPTY,
        cookies: c.status === "fulfilled" ? { ...EMPTY, ...(c.value as unknown as LegalPage) } : EMPTY,
      });
      setLoading(false);
    });
  }, []);

  const set = <K extends keyof LegalPage>(k: K, v: LegalPage[K]) =>
    setForms((f) => ({ ...f, [tab]: { ...f[tab], [k]: v } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setMessage(null); setSaving(true);
    try {
      await cmsApi.updateLegal(tab, forms[tab] as unknown as Record<string, unknown>);
      setMessage({ type: "success", text: `${TABS.find((t) => t.id === tab)?.label} saved.` });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed." });
    } finally { setSaving(false); }
  };

  if (loading) return <PageLoader />;

  const form = forms[tab];

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <PageHeader title="Legal Pages" description="Edit privacy policy, terms, and cookie policy." />
      {!cmsApi.isConfigured && <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load content." />}

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-[#FAF8F2] p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setTab(t.id); setMessage(null); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? "bg-[#EAE4D0] text-[#0D2218]" : "text-[#6A7B70] hover:text-[#0D2218]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form key={tab} onSubmit={handleSubmit} className="space-y-5">
        <Card>
          <CardSection title={`${TABS.find((t) => t.id === tab)?.label} — metadata`}>
            <div className="space-y-4">
              <Field label="Page title"><Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder={TABS.find((t) => t.id === tab)?.label} /></Field>
              <Field label="Meta description" hint="Max 160 chars."><Textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={2} maxLength={160} /></Field>
            </div>
          </CardSection>
        </Card>

        <Card>
          <CardSection title="Body content" description="Plain text or Markdown. HTML is accepted.">
            <Field label="Content">
              <Textarea value={form.body} onChange={(e) => set("body", e.target.value)} rows={18} placeholder="Enter full legal text here…" className="font-mono text-xs" />
            </Field>
          </CardSection>
        </Card>

        <SaveBar saving={saving} message={message} onDismiss={() => setMessage(null)} disabled={!cmsApi.isConfigured} />
      </form>
    </div>
  );
}
