"use client";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-luxury-gold text-[#0D2218] hover:bg-luxury-gold-hover focus:ring-luxury-gold/40 font-semibold shadow-sm",
  secondary:
    "bg-white text-[#0D2218] border border-[#D5CAAD] hover:border-luxury-gold hover:bg-luxury-gold/5 focus:ring-luxury-gold/30",
  danger:
    "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 focus:ring-red-300/50",
  ghost:
    "text-[#6A7B70] hover:text-[#0D2218] hover:bg-[#EAE4D0]/70 focus:ring-[#D5CAAD]/50",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-6 py-2.5 text-sm rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 font-body font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="h-4 w-4 shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
