export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#EAE4D0] bg-white shadow-sm ${padded ? "p-6" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-5">
        <h3 className="font-display text-base font-semibold text-[#0D2218]">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-[#8A9990]">{description}</p>
        )}
        <div className="mt-2 h-px w-full bg-[#EAE4D0]" />
      </div>
      {children}
    </div>
  );
}
