type BadgeVariant = "default" | "green" | "amber" | "red" | "blue" | "purple";

const variants: Record<BadgeVariant, string> = {
  default: "bg-stone-100 text-stone-600 border border-stone-200",
  green:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  amber:   "bg-amber-50 text-amber-800 border border-amber-200",
  red:     "bg-red-50 text-red-700 border border-red-200",
  blue:    "bg-blue-50 text-blue-700 border border-blue-200",
  purple:  "bg-purple-50 text-purple-700 border border-purple-200",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-stone-400",
  green:   "bg-emerald-500",
  amber:   "bg-amber-500",
  red:     "bg-red-500",
  blue:    "bg-blue-500",
  purple:  "bg-purple-500",
};

export function Badge({
  label,
  variant = "default",
  dot,
}: {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${variants[variant]}`}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {label}
    </span>
  );
}
