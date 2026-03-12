"use client";

import { useState } from "react";
import { Alert } from "./Alert";
import { Button } from "./Button";

interface SectionSaveCardProps {
  title: string;
  description?: string;
  /** Called when the user clicks "Save section". Should send only this section's fields. */
  onSave: () => Promise<unknown>;
  successMessage?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

/**
 * A self-contained card that wraps one section of a content page.
 * Has its own independent save button, saving state, and feedback — so
 * an editor can update a single section without touching anything else.
 */
export function SectionSaveCard({
  title,
  description,
  onSave,
  successMessage = "Section saved.",
  disabled = false,
  children,
}: SectionSaveCardProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async () => {
    if (disabled) return;
    setSaving(true);
    setMessage(null);
    try {
      await onSave();
      setMessage({ type: "success", text: successMessage });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Save failed.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#EAE4D0] bg-white shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-[#EAE4D0] bg-[#FDFCF9]">
        <div>
          <h3 className="font-display text-base font-semibold text-[#0D2218]">{title}</h3>
          {description && (
            <p className="mt-0.5 text-xs text-[#8A9990]">{description}</p>
          )}
        </div>
        <Button
          type="button"
          size="sm"
          loading={saving}
          disabled={disabled}
          onClick={handleSave}
          className="shrink-0"
        >
          {saving ? "Saving…" : "Save section"}
        </Button>
      </div>

      {/* Form fields */}
      <div className="px-6 py-5">{children}</div>

      {/* Inline feedback */}
      {message && (
        <div className="px-6 pb-5">
          <Alert
            type={message.type}
            message={message.text}
            onDismiss={() => setMessage(null)}
          />
        </div>
      )}
    </div>
  );
}

/** Small helper shown next to image URL fields so editors know where to get CDN URLs */
export function MediaLibraryHint() {
  return (
    <a
      href="/cms/media"
      target="_blank"
      className="inline-flex items-center gap-1 text-[10px] text-luxury-gold hover:text-luxury-gold-hover transition-colors"
    >
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Get URL from Media Library ↗
    </a>
  );
}
