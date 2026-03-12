export function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#8A9990]">
        {label}
        {required && <span className="ml-1 text-luxury-gold">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-[#A9A090]">{hint}</p>}
    </div>
  );
}
