import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
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
    "inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg transition-all duration-200 ";
  const variants = {
    primary:
      "bg-safari-gold text-safari-green hover:bg-safari-gold-light focus:ring-2 focus:ring-safari-gold/50",
    outline:
      "border-2 border-safari-gold text-safari-gold hover:bg-safari-gold/10",
    ghost:
      "text-safari-gold hover:bg-white/5",
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
