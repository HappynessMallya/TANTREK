"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cmsApi, type PaginatedList, type DestinationSummary } from "@/lib/cms-api";
import { PageHeader } from "../_components/PageHeader";
import { Button } from "../_components/Button";
import { Badge } from "../_components/Badge";
import { Alert } from "../_components/Alert";
import { EmptyState } from "../_components/EmptyState";
import { Spinner } from "../_components/Spinner";

type Dest = DestinationSummary & { imageUrl?: string };

const circuitColor: Record<string, "green" | "amber" | "blue"> = {
  northern: "blue",
  southern: "green",
  western: "amber",
};

function destImage(d: Dest): string | undefined {
  return d.imageUrl ?? d.heroImage?.url;
}

function destCircuitSlug(d: Dest): string | undefined {
  if (typeof d.circuit === "string") return d.circuit as string;
  return (d.circuit as { slug?: string })?.slug;
}

export default function CmsDestinationsPage() {
  const [list, setList] = useState<Dest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    if (!cmsApi.isConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const r = await cmsApi.getDestinations() as PaginatedList<Dest>;
      setList(r?.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await cmsApi.deleteDestination(slug);
      setList((prev) => prev.filter((d) => d.slug !== slug));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const filtered = search
    ? list.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.slug.includes(search))
    : list;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
      <PageHeader
        title="Destinations"
        description="Manage safari parks and circuits."
        action={
          <Link href="/cms/destinations/new">
            <Button icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
              Add destination
            </Button>
          </Link>
        }
      />

      {!cmsApi.isConfigured && (
        <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load destinations." />
      )}
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

      {/* Search */}
      <div className="relative">
        <svg className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search destinations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/60 pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500/80 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
        />
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? "No results" : "No destinations yet"}
          description={search ? "Try a different search." : cmsApi.isConfigured ? "Add your first destination." : "Connect the API to load destinations."}
          action={!search && cmsApi.isConfigured ? <Link href="/cms/destinations/new"><Button>Add destination</Button></Link> : undefined}
          icon={
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      ) : (
        <div className="rounded-xl border border-slate-700/60 overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_2fr_auto_auto_auto] items-center gap-4 bg-slate-800/60 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span>Image</span>
            <span>Name / Slug</span>
            <span>Circuit</span>
            <span>Featured</span>
            <span></span>
          </div>

          {filtered.map((d, i) => (
            <div
              key={d.slug}
              className={`grid grid-cols-[1fr_2fr_auto_auto_auto] items-center gap-4 px-4 py-3 border-t border-slate-700/40 hover:bg-slate-800/30 transition-colors ${i === 0 ? "border-t-0" : ""}`}
            >
              {/* Thumbnail */}
              <div className="h-11 w-16 shrink-0 rounded-md overflow-hidden bg-slate-900">
                {destImage(d) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={destImage(d)} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <p className="text-sm font-medium text-white">{d.name}</p>
                <p className="text-xs text-slate-500">/destinations/{d.slug}</p>
              </div>

              {/* Circuit */}
              <div>
                {destCircuitSlug(d) ? (
                  <Badge label={destCircuitSlug(d)!} variant={circuitColor[destCircuitSlug(d)!] ?? "default"} />
                ) : (
                  <span className="text-xs text-slate-600">—</span>
                )}
              </div>

              {/* Featured */}
              <div className="flex justify-center">
                {d.featured ? (
                  <span className="text-amber-400" title="Featured">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  </span>
                ) : (
                  <span className="text-slate-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Link href={`/cms/destinations/${d.slug}`}>
                  <Button variant="ghost" size="sm">Edit</Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(d.slug, d.name)}
                  className="!text-slate-600 hover:!text-red-400"
                >
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
