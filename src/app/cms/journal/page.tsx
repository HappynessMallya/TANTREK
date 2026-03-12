"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cmsApi, type PaginatedList, type JournalPostSummary } from "@/lib/cms-api";
import { PageHeader } from "../_components/PageHeader";
import { Button } from "../_components/Button";
import { Badge } from "../_components/Badge";
import { Alert } from "../_components/Alert";
import { EmptyState } from "../_components/EmptyState";
import { Spinner } from "../_components/Spinner";

type Post = JournalPostSummary;

const catColors: Record<string, "green" | "blue" | "amber" | "purple"> = {
  wildlife: "green", travel: "blue", conservation: "amber", culture: "purple",
};

export default function CmsJournalPage() {
  const [list, setList] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    if (!cmsApi.isConfigured) { setLoading(false); return; }
    setLoading(true);
    try {
      const r = await cmsApi.getJournal() as PaginatedList<Post>;
      setList(r?.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await cmsApi.deleteJournalPost(slug);
      setList((prev) => prev.filter((p) => p.slug !== slug));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const filtered = search ? list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())) : list;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
      <PageHeader
        title="Safari Journal"
        description="Manage blog posts and field notes."
        action={
          <Link href="/cms/journal/new">
            <Button icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
              New post
            </Button>
          </Link>
        }
      />

      {!cmsApi.isConfigured && <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load journal posts." />}
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

      <div className="relative">
        <svg className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="search" placeholder="Search posts…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800/60 pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500/80 focus:outline-none" />
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? "No results" : "No posts yet"}
          action={!search && cmsApi.isConfigured ? <Link href="/cms/journal/new"><Button>New post</Button></Link> : undefined}
          icon={<svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        />
      ) : (
        <div className="rounded-xl border border-slate-700/60 overflow-hidden">
          <div className="grid grid-cols-[3fr_auto_auto_auto] items-center gap-4 bg-slate-800/60 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span>Title</span><span>Category</span><span>Read time</span><span></span>
          </div>
          {filtered.map((p, i) => (
            <div key={p.slug} className={`grid grid-cols-[3fr_auto_auto_auto] items-center gap-4 px-4 py-3 border-t border-slate-700/40 hover:bg-slate-800/30 transition-colors ${i === 0 ? "border-t-0" : ""}`}>
              <div>
                <p className="text-sm font-medium text-white">{p.title}</p>
                <p className="text-xs text-slate-500">/journal/{p.slug}</p>
                {p.excerpt && <p className="mt-0.5 text-xs text-slate-600 line-clamp-1">{p.excerpt}</p>}
              </div>
              <div>{p.category ? <Badge label={p.category.label} variant={catColors[p.category.slug] ?? "default"} /> : <span className="text-xs text-slate-600">—</span>}</div>
              <div className="text-xs text-slate-500">{p.readTime ?? "—"}</div>
              <div className="flex items-center gap-1">
                <Link href={`/cms/journal/${p.slug}`}><Button variant="ghost" size="sm">Edit</Button></Link>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(p.slug, p.title)} className="!text-slate-600 hover:!text-red-400">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
