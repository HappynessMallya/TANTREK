import { forwardRef } from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      {...props}
      className={`w-full resize-y rounded-xl border border-[#D5CAAD] bg-white px-4 py-2.5 text-sm text-[#0D2218] placeholder-[#B0A88C] transition-all focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/15 disabled:bg-[#F7F4EF] disabled:opacity-60 ${className}`}
    />
  )
);
Textarea.displayName = "Textarea";
