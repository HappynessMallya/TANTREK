import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost" | "navy";
  className?: string;
  type?: "button" | "submit";
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 ";
  const variants = {
    primary:
      "bg-tantrek-orange text-white shadow-[0_8px_20px_rgba(255,122,0,0.28)] hover:bg-tantrek-orange-deep hover:-translate-y-0.5 focus:ring-2 focus:ring-tantrek-orange/40",
    navy:
      "bg-tantrek-navy text-white hover:bg-tantrek-navy-deep hover:-translate-y-0.5 focus:ring-2 focus:ring-tantrek-navy/40",
    outline:
      "border-2 border-tantrek-navy text-tantrek-navy hover:bg-tantrek-navy hover:text-white",
    ghost:
      "text-tantrek-navy hover:bg-tantrek-navy/5",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
