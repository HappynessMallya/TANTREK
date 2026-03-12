"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cmsApi } from "@/lib/cms-api";

type Stat = {
  label: string;
  value: string | number;
  href: string;
  icon: React.ReactNode;
  accent: string;
};

function StatCard({ label, value, href, icon, accent }: Stat) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-[#EAE4D0] bg-white p-6 shadow-sm hover:border-luxury-gold/50 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8A9990]">{label}</p>
          <p className="mt-2 font-display text-4xl font-bold text-[#0D2218] tabular-nums">
            {value}
          </p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
          {icon}
        </div>
      </div>
      {/* Gold accent line at bottom */}
      <div className="mt-5 flex items-center gap-1.5 text-xs text-[#8A9990] group-hover:text-luxury-gold transition-colors">
        <span className="font-medium">Manage</span>
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

type QuickLink = { href: string; label: string; desc: string; icon: string };

const QUICK_LINKS: QuickLink[] = [
  { href: "/cms/media", label: "Upload media", desc: "Add images or videos to the library", icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" },
  { href: "/cms/destinations/new", label: "New destination", desc: "Add a park or circuit", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
  { href: "/cms/experiences/new", label: "New experience", desc: "Create a curated safari journey", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { href: "/cms/journal/new", label: "New journal post", desc: "Write a Safari Journal article", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { href: "/cms/home", label: "Edit homepage", desc: "Update hero, map, and sections", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/cms/settings", label: "Site settings", desc: "Contact info, footer, social links", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function CmsDashboardPage() {
  const [stats, setStats] = useState<{
    destinations: string;
    experiences: string;
    journal: string;
  }>({ destinations: "–", experiences: "–", journal: "–" });
  const configured = cmsApi.isConfigured;

  useEffect(() => {
    if (!configured) return;
    Promise.allSettled([
      cmsApi.getDestinations({ limit: 1 }),
      cmsApi.getExperiences({ limit: 1 }),
      cmsApi.getJournal({ limit: 1 }),
    ]).then(([d, e, j]) => {
      type PageRes = { total?: number; items?: unknown[] };
      const count = (r: PromiseSettledResult<unknown>) =>
        r.status === "fulfilled"
          ? String(
              (r.value as PageRes)?.total ??
              (r.value as PageRes)?.items?.length ??
              "–"
            )
          : "–";
      setStats({
        destinations: count(d),
        experiences: count(e),
        journal: count(j),
      });
    });
  }, [configured]);

  return (
    <div className="p-8 lg:p-10 max-w-5xl space-y-10">

      {/* Page heading */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-luxury-gold font-body">
          Overview
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-[#0D2218] tracking-tight">
          Dashboard
        </h1>
        <div className="mt-2 h-[2px] w-10 rounded-full bg-luxury-gold" />
        <p className="mt-3 text-sm text-[#8A9990]">
          Welcome to the Tanzania Wildmakers content manager.
        </p>
      </div>

      {/* API status banner */}
      {!configured ? (
        <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <svg className="h-4.5 w-4.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-900">Backend API not connected</p>
            <p className="mt-0.5 text-xs text-amber-700 leading-relaxed">
              Set{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-amber-800">
                NEXT_PUBLIC_CMS_API_URL
              </code>{" "}
              in{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-amber-800">
                .env.local
              </code>{" "}
              to connect your backend. All CMS pages are fully built and ready.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Connected to</span>
          <code className="font-mono text-emerald-600">{cmsApi.base}</code>
        </div>
      )}

      {/* Content stats */}
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#8A9990]">
          Content overview
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            label="Destinations"
            value={stats.destinations}
            href="/cms/destinations"
            accent="bg-[#E8F4EE] text-safari-green"
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <StatCard
            label="Experiences"
            value={stats.experiences}
            href="/cms/experiences"
            accent="bg-[#F3EEF8] text-purple-600"
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Journal posts"
            value={stats.journal}
            href="/cms/journal"
            accent="bg-[#FBF3E0] text-[#A67C00]"
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Thin gold divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      {/* Quick actions */}
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#8A9990]">
          Quick actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center gap-3.5 rounded-2xl border border-[#EAE4D0] bg-white p-4 hover:border-luxury-gold/50 hover:shadow-sm transition-all"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-luxury-gold/10 text-luxury-gold group-hover:bg-luxury-gold/20 transition-colors">
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={l.icon} />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0D2218]">{l.label}</p>
                <p className="text-xs text-[#8A9990]">{l.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Media storage note */}
      <div className="rounded-2xl border border-[#EAE4D0] bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F3EEF8]">
            <svg className="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0D2218]">Media storage</p>
            <p className="mt-0.5 text-xs text-[#8A9990] leading-relaxed">
              All uploaded images and videos are stored in{" "}
              <span className="text-[#0D2218] font-medium">MinIO</span>. The backend returns CDN URLs after processing. Upload via{" "}
              <Link href="/cms/media" className="text-luxury-gold hover:text-luxury-gold-hover underline underline-offset-2">
                Media Library
              </Link>
              , then paste URLs into page editors.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
