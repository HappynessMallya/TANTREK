import { forwardRef } from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, className = "", ...props }, ref) => (
    <select
      ref={ref}
      {...props}
      className={`w-full rounded-xl border border-[#D5CAAD] bg-white px-4 py-2.5 text-sm text-[#0D2218] transition-all focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/15 disabled:bg-[#F7F4EF] disabled:opacity-60 ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
);
Select.displayName = "Select";
