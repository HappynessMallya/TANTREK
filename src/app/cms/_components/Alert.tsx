"use client";

type AlertType = "success" | "error" | "warn" | "info";

const styles: Record<AlertType, { outer: string; icon: string }> = {
  success: {
    outer: "bg-emerald-50 border-emerald-200 text-emerald-800",
    icon: "text-emerald-600",
  },
  error: {
    outer: "bg-red-50 border-red-200 text-red-800",
    icon: "text-red-500",
  },
  warn: {
    outer: "bg-amber-50 border-[#D4AF37]/40 text-amber-900",
    icon: "text-[#D4AF37]",
  },
  info: {
    outer: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "text-blue-500",
  },
};

const icons: Record<AlertType, React.ReactNode> = {
  success: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warn: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  info: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function Alert({
  type,
  message,
  onDismiss,
}: {
  type: AlertType;
  message: string;
  onDismiss?: () => void;
}) {
  const s = styles[type];
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm font-body ${s.outer}`}
    >
      <span className={`mt-0.5 shrink-0 ${s.icon}`}>{icons[type]}</span>
      <span className="flex-1 leading-relaxed">{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-2 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
