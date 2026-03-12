"use client";

import { Button } from "./Button";
import { Alert } from "./Alert";

interface SaveBarProps {
  saving: boolean;
  message: { type: "success" | "error"; text: string } | null;
  onDismiss: () => void;
  label?: string;
  disabled?: boolean;
}

export function SaveBar({
  saving,
  message,
  onDismiss,
  label = "Save changes",
  disabled = false,
}: SaveBarProps) {
  return (
    <div className="space-y-3 pt-2">
      {message && (
        <Alert type={message.type} message={message.text} onDismiss={onDismiss} />
      )}
      <div className="flex items-center gap-3">
        <Button type="submit" loading={saving} disabled={disabled} size="lg">
          {saving ? "Saving…" : label}
        </Button>
        {saving && (
          <span className="text-xs text-[#8A9990] font-body">Please wait…</span>
        )}
      </div>
    </div>
  );
}
