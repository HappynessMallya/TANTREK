import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  action?: React.ReactNode;
}

export function PageHeader({ title, description, back, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {back && (
          <Link
            href={back.href}
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-luxury-gold hover:text-luxury-gold-hover transition-colors"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {back.label}
          </Link>
        )}
        <h1 className="font-display text-2xl font-bold text-[#0D2218] tracking-tight">{title}</h1>
        {/* Gold accent rule — matching the public site's heading dividers */}
        <div className="mt-2 h-[2px] w-10 bg-luxury-gold rounded-full" />
        {description && (
          <p className="mt-2 text-sm text-[#8A9990] font-body">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 mt-4 sm:mt-0">{action}</div>}
    </div>
  );
}
