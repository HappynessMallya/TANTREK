import { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white/5 border border-white/10 backdrop-blur-md rounded-xl ${className}`}
    >
      {children}
    </div>
  );
}
