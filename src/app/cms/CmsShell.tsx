"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

function Icon({ d }: { d: string }) {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
    </svg>
  );
}

const GROUPS: NavGroup[] = [
  {
    label: "Content",
    items: [
      { href: "/cms/home", label: "Homepage", icon: <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
      { href: "/cms/destinations", label: "Destinations", icon: <Icon d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /> },
      { href: "/cms/experiences", label: "Experiences", icon: <Icon d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
      { href: "/cms/journal", label: "Journal / Blog", icon: <Icon d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
    ],
  },
  {
    label: "Media",
    items: [
      { href: "/cms/media", label: "Media Library", icon: <Icon d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    ],
  },
  {
    label: "Pages",
    items: [
      { href: "/cms/about", label: "About", icon: <Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
      { href: "/cms/plan-your-safari", label: "Plan Your Safari", icon: <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
      { href: "/cms/sustainability", label: "Sustainability", icon: <Icon d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /> },
    ],
  },
  {
    label: "Inquiries",
    items: [
      { href: "/cms/inquiries", label: "Safari Inquiries", icon: <Icon d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/cms/settings", label: "Settings", icon: <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> },
      { href: "/cms/legal", label: "Legal", icon: <Icon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
    ],
  },
];

function NavLink({ href, label, icon, active }: NavItem & { active: boolean }) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all ${
        active
          ? "bg-luxury-gold/10 text-luxury-gold font-medium"
          : "text-safari-cream/60 hover:bg-white/5 hover:text-safari-cream"
      }`}
    >
      {/* Active left accent bar */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-luxury-gold" />
      )}
      <span className={`shrink-0 transition-colors ${active ? "text-luxury-gold" : "text-safari-cream/40 group-hover:text-safari-cream/70"}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}

export function CmsShell({ children }: { children: React.ReactNode }) {
  const rawPathname = usePathname();
  const pathname = rawPathname ?? "";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, clearAuth } = useAuthStore();

  const sidebar = (
    <div className="flex h-full flex-col bg-luxury-dark-emerald">
      {/* Branding */}
      <div className="px-4 py-4 border-b border-white/8">
        <Link
          href="/cms/dashboard"
          className="flex flex-col gap-1.5"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="TANTREK 360 Safaris"
            width={200}
            height={56}
            className="h-10 w-auto object-contain object-left"
            priority
          />
          <p className="text-[10px] text-safari-cream/35 font-body tracking-[0.18em] uppercase pl-0.5">
            Content Manager
          </p>
        </Link>
      </div>

      {/* Dashboard link */}
      <div className="px-3 pt-3 pb-1">
        <NavLink
          href="/cms/dashboard"
          label="Dashboard"
          icon={<Icon d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />}
          active={pathname === "/cms/dashboard"}
        />
      </div>

      {/* Gold divider */}
      <div className="mx-4 my-2 h-px bg-luxury-gold/10" />

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-4">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[9px] font-bold uppercase tracking-[0.15em] text-luxury-gold/40">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  active={
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/")
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logged-in user chip */}
      {user && (
        <div className="mx-3 mb-1 rounded-lg bg-white/5 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-luxury-gold/50 mb-0.5">Signed in as</p>
          <p className="text-xs font-medium text-safari-cream/80 truncate">{user.name}</p>
          <p className="text-[10px] text-safari-cream/35 truncate">{user.email}</p>
        </div>
      )}

      {/* Footer actions */}
      <div className="border-t border-white/8 px-3 py-3 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-safari-cream/40 hover:text-safari-cream/70 hover:bg-white/5 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View public site
        </Link>
        <button
          type="button"
          onClick={() => {
            clearAuth();
            window.location.href = "/cms/login";
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-safari-cream/40 hover:text-red-400 hover:bg-red-400/5 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex bg-luxury-champagne">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 lg:block shadow-xl">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[110] flex lg:hidden">
          <div
            className="absolute inset-0 bg-luxury-dark-emerald/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative z-10 w-60">{sidebar}</aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex h-14 items-center border-b border-[#EAE4D0] bg-white px-4 lg:hidden shadow-sm">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="text-[#6A7B70] hover:text-[#0D2218] transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Image
            src="/logo.png"
            alt="TANTREK 360 Safaris"
            width={160}
            height={44}
            className="ml-3 h-8 w-auto object-contain"
          />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-luxury-champagne">
          {children}
        </main>
      </div>
    </div>
  );
}
