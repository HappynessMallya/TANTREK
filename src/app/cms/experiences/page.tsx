"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cmsApi, type PaginatedList, type ExperienceSummary } from "@/lib/cms-api";
import { PageHeader } from "../_components/PageHeader";
import { Button } from "../_components/Button";
import { Badge } from "../_components/Badge";
import { Alert } from "../_components/Alert";
import { EmptyState } from "../_components/EmptyState";
import { Spinner } from "../_components/Spinner";

type Exp = ExperienceSummary & { imageUrl?: string };

export default function CmsExperiencesPage() {
  const [list, setList] = useState<Exp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    if (!cmsApi.isConfigured) { setLoading(false); return; }
    setLoading(true);
    try {
      const r = await cmsApi.getExperiences() as PaginatedList<Exp>;
      setList(r?.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await cmsApi.deleteExperience(slug);
      setList((prev) => prev.filter((x) => x.slug !== slug));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const filtered = search ? list.filter((x) => x.name.toLowerCase().includes(search.toLowerCase())) : list;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
      <PageHeader
        title="Experiences"
        description="Manage curated safari journeys."
        action={
          <Link href="/cms/experiences/new">
            <Button icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
              Add experience
            </Button>
          </Link>
        }
      />

      {!cmsApi.isConfigured && <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load experiences." />}
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

      <div className="relative">
        <svg className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#8A9990]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="search" placeholder="Search experiences…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[#D5CAAD] bg-[#FAF8F2] pl-9 pr-3 py-2.5 text-sm text-[#0D2218] placeholder-[#B0A88C] focus:border-luxury-gold focus:outline-none" />
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? "No results" : "No experiences yet"}
          action={!search && cmsApi.isConfigured ? <Link href="/cms/experiences/new"><Button>Add experience</Button></Link> : undefined}
          icon={<svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      ) : (
        <div className="rounded-xl border border-[#EAE4D0] overflow-hidden">
          <div className="grid grid-cols-[1fr_2fr_auto_auto_auto] items-center gap-4 bg-[#FAF8F2] px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#6A7B70]">
            <span>Image</span><span>Name</span><span>Duration</span><span>Featured</span><span></span>
          </div>
          {filtered.map((x, i) => (
            <div key={x.slug} className={`grid grid-cols-[1fr_2fr_auto_auto_auto] items-center gap-4 px-4 py-3 border-t border-[#EAE4D0] hover:bg-[#F3EEE2] transition-colors ${i === 0 ? "border-t-0" : ""}`}>
              <div className="h-11 w-16 shrink-0 rounded-md overflow-hidden bg-[#0D2218]">
                {(x.imageUrl ?? x.heroImage?.url) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={x.imageUrl ?? x.heroImage?.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg className="h-5 w-5 text-[#C8BFA8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" /></svg>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-[#0D2218]">{x.name}</p>
                <p className="text-xs text-[#8A9990]">/experiences/{x.slug}</p>
              </div>
              <div>
                {x.durationDays ? (
                  <Badge label={`${x.durationDays}d`} variant="default" />
                ) : (
                  <span className="text-xs text-[#A9A090]">—</span>
                )}
              </div>
              <div className="flex justify-center">
                {x.featured ? (
                  <span className="text-amber-500"><svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg></span>
                ) : <span className="text-[#C8BFA8]"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg></span>}
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/cms/experiences/${x.slug}`}><Button variant="ghost" size="sm">Edit</Button></Link>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(x.slug, x.name)} className="!text-[#A9A090] hover:!text-red-600">
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
