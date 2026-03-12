"use client";

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#EAE4D0] bg-[#FAF8F2] p-4 transition-colors hover:border-[#D4AF37]/40">
      <div>
        <p className="text-sm font-medium text-[#0D2218]">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-[#8A9990]">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-luxury-gold/40 focus:ring-offset-2 focus:ring-offset-white ${
          checked ? "bg-luxury-gold" : "bg-[#C8BFA8]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
