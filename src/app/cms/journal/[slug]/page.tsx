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
import { SaveBar } from "../../_components/SaveBar";
import { PageLoader } from "../../_components/Spinner";

type Post = {
  slug: string; title: string; excerpt: string; category: string;
  imageUrl: string; imageAlt: string; readTime: string; body: string;
  metaTitle: string; metaDescription: string;
};

const EMPTY: Post = {
  slug: "", title: "", excerpt: "", category: "", imageUrl: "",
  imageAlt: "", readTime: "", body: "", metaTitle: "", metaDescription: "",
};

const CATEGORIES = [
  { value: "wildlife", label: "Wildlife" },
  { value: "travel", label: "Travel" },
  { value: "conservation", label: "Conservation" },
  { value: "culture", label: "Culture" },
  { value: "guides", label: "Expert Guides" },
];

export default function CmsJournalEditPage() {
  const params = useParams() ?? {};
  const router = useRouter();
  const slug = (params.slug ?? "new") as string;
  const isNew = slug === "new";

  const [form, setForm] = useState<Post>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (isNew || !cmsApi.isConfigured) { setLoading(false); return; }
    cmsApi.getJournalPost(slug).then((d) => { setForm({ ...EMPTY, ...(d as unknown as Post) }); setLoading(false); }).catch(() => setLoading(false));
  }, [slug, isNew]);

  const set = <K extends keyof Post>(k: K, v: Post[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      if (isNew) await cmsApi.createJournalPost(form as unknown as Record<string, unknown>);
      else await cmsApi.updateJournalPost(slug, form as unknown as Record<string, unknown>);
      setMessage({ type: "success", text: "Post saved." });
      if (isNew && form.slug) router.push(`/cms/journal/${form.slug}`);
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
        title={isNew ? "New post" : form.title || "Edit post"}
        back={{ href: "/cms/journal", label: "Journal" }}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardSection title="Post details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><Field label="Title" required><Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Dawn over the Serengeti" required /></Field></div>
              <Field label="Slug" required hint="/journal/{slug}"><Input value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="dawn-over-serengeti" required /></Field>
              <Field label="Category"><Select value={form.category} onChange={(e) => set("category", e.target.value)} options={CATEGORIES} placeholder="Select category" /></Field>
              <div className="md:col-span-2"><Field label="Excerpt" hint="Shown in cards and listings."><Textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} placeholder="A short teaser for this post…" /></Field></div>
              <Field label="Read time (minutes)"><Input type="number" min="1" value={form.readTime} onChange={(e) => set("readTime", e.target.value)} placeholder="5" /></Field>
            </div>
          </CardSection>
        </Card>

        <Card>
          <CardSection title="Body content">
            <Field label="Article body" hint="Plain text or Markdown.">
              <Textarea value={form.body} onChange={(e) => set("body", e.target.value)} rows={14} placeholder="Write your article here…" className="font-mono text-xs" />
            </Field>
          </CardSection>
        </Card>

        <Card>
          <CardSection title="Cover image">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Image URL" hint="Paste CDN URL from Media Library."><Input type="url" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://cdn.example.com/…" /></Field>
              <Field label="Image alt text"><Input value={form.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} placeholder="Wildebeest migration at sunrise" /></Field>
            </div>
            {form.imageUrl && (
              <div className="mt-3 h-36 rounded-lg overflow-hidden bg-[#0D2218]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.imageUrl} alt={form.imageAlt} className="h-full w-full object-cover" />
              </div>
            )}
          </CardSection>
        </Card>

        <Card>
          <CardSection title="SEO">
            <div className="space-y-4">
              <Field label="Meta title"><Input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} /></Field>
              <Field label="Meta description" hint="Max 160 chars."><Textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={2} maxLength={160} /></Field>
            </div>
          </CardSection>
        </Card>

        <SaveBar saving={saving} message={message} onDismiss={() => setMessage(null)} disabled={!cmsApi.isConfigured} label={isNew ? "Publish post" : "Save changes"} />
      </form>
    </div>
  );
}
