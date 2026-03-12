"use client";

import { useCallback, useEffect, useState } from "react";
import { cmsApi, type Inquiry, type PaginatedList } from "@/lib/cms-api";
import { PageHeader } from "../_components/PageHeader";
import { Badge } from "../_components/Badge";
import { Alert } from "../_components/Alert";
import { Button } from "../_components/Button";
import { EmptyState } from "../_components/EmptyState";
import { Spinner } from "../_components/Spinner";

type StatusFilter = "all" | "new" | "read" | "replied";

const STATUS_COLORS: Record<Inquiry["status"], "amber" | "blue" | "green"> = {
  new: "amber",
  read: "blue",
  replied: "green",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function InquiryRow({ inquiry, onStatusChange, onDelete }: {
  inquiry: Inquiry;
  onStatusChange: (id: string, status: Inquiry["status"]) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="border-t border-slate-700/40 first:border-t-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full grid grid-cols-[2fr_1.5fr_auto_auto_auto] items-center gap-4 px-4 py-3 text-left hover:bg-slate-800/30 transition-colors"
      >
        <div>
          <p className="text-sm font-medium text-white">{inquiry.name}</p>
          <p className="text-xs text-slate-500 truncate">{inquiry.email}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 truncate">{inquiry.travelDates ?? "—"}</p>
          {inquiry.guests && <p className="text-xs text-slate-600">{inquiry.guests} guest{inquiry.guests !== 1 ? "s" : ""}</p>}
        </div>
        <div>
          <Badge label={inquiry.status} variant={STATUS_COLORS[inquiry.status]} />
        </div>
        <div className="text-xs text-slate-500 whitespace-nowrap">{formatDate(inquiry.createdAt)}</div>
        <svg className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          <div className="rounded-lg border border-slate-700/40 bg-slate-900/40 p-4 space-y-3">
            {inquiry.phone && (
              <p className="text-sm text-slate-300">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-2">Phone</span>
                {inquiry.phone}
              </p>
            )}
            {inquiry.message && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Message</p>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{inquiry.message}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1">Mark as</p>
            {(["new", "read", "replied"] as Inquiry["status"][]).map((s) => (
              <button
                key={s}
                type="button"
                disabled={inquiry.status === s}
                onClick={() => onStatusChange(inquiry.id, s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  inquiry.status === s
                    ? "bg-slate-700 text-slate-300 cursor-default"
                    : "bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}

            <div className="ml-auto">
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Delete permanently?</span>
                  <button type="button" onClick={() => onDelete(inquiry.id)} className="text-xs text-red-400 hover:text-red-300 font-medium">Yes, delete</button>
                  <button type="button" onClick={() => setConfirmDelete(false)} className="text-xs text-slate-400 hover:text-slate-200">Cancel</button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="text-xs text-slate-600 hover:text-red-400 transition-colors">
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CmsInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    if (!cmsApi.isConfigured) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await cmsApi.getInquiries(
        filter !== "all" ? { status: filter } : undefined
      ) as PaginatedList<Inquiry>;
      setInquiries(res.items ?? []);
      setTotal(res.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id: string, status: Inquiry["status"]) => {
    try {
      await cmsApi.updateInquiryStatus(id, status);
      setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await cmsApi.deleteInquiry(id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      setTotal((t) => t - 1);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
      <PageHeader
        title="Safari Inquiries"
        description="View and manage contact form submissions from prospective guests."
        action={
          newCount > 0 ? (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              {newCount} new
            </span>
          ) : undefined
        }
      />

      {!cmsApi.isConfigured && (
        <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load inquiries." />
      )}
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "new", "read", "replied"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === f
                ? "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40"
                : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
            }`}
          >
            {f === "all" ? `All (${total})` : f}
          </button>
        ))}
        <Button variant="ghost" size="sm" onClick={load} className="ml-auto">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center"><Spinner size="lg" /></div>
      ) : inquiries.length === 0 ? (
        <EmptyState
          title={filter !== "all" ? `No ${filter} inquiries` : "No inquiries yet"}
          description={
            cmsApi.isConfigured
              ? filter !== "all" ? "Try a different filter." : "Inquiries from the contact form will appear here."
              : "Connect the API to see inquiries."
          }
          icon={
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
      ) : (
        <div className="rounded-xl border border-slate-700/60 overflow-hidden">
          <div className="grid grid-cols-[2fr_1.5fr_auto_auto_auto] items-center gap-4 bg-slate-800/60 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span>Contact</span>
            <span>Travel dates / Guests</span>
            <span>Status</span>
            <span>Date</span>
            <span />
          </div>
          {inquiries.map((inquiry) => (
            <InquiryRow
              key={inquiry.id}
              inquiry={inquiry}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
