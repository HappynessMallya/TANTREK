export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D5CAAD] bg-[#FAF8F2] py-20 px-8 text-center">
      {icon && (
        <div className="mb-4 text-[#C8BFA8]">{icon}</div>
      )}
      <h3 className="font-display text-base font-semibold text-[#0D2218]">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-[#8A9990] max-w-xs leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
