import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      className={`w-full rounded-xl border border-[#D5CAAD] bg-white px-4 py-2.5 text-sm text-[#0D2218] placeholder-[#B0A88C] ring-0 transition-all focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/15 disabled:bg-[#F7F4EF] disabled:opacity-60 ${className}`}
    />
  )
);
Input.displayName = "Input";
