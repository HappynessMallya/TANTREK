"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/cms-api";

const LOGIN_PATH = "/cms/login";

export function CmsAuthGuard({ children, Shell }: { children: React.ReactNode; Shell: React.ComponentType<{ children: React.ReactNode }> }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === LOGIN_PATH) {
      setOk(true);
      return;
    }
    const token = getToken();
    if (token) setOk(true);
    else {
      setOk(false);
      router.replace(LOGIN_PATH);
    }
  }, [pathname, router]);

  if (ok === null) return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-400">Loading…</div>;
  if (pathname === LOGIN_PATH) return <>{children}</>;
  if (!ok) return null;
  return <Shell>{children}</Shell>;
}
