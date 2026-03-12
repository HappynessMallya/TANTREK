"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";

const LOGIN_PATH = "/cms/login";

/**
 * Guards all CMS routes.
 *
 * Pattern: render nothing on the first pass (avoids SSR/hydration mismatch),
 * then after mount the Zustand persist middleware has already synchronously
 * loaded sessionStorage so `token` is correct on the very next render.
 */
export function CmsAuthGuard({
  children,
  Shell,
}: {
  children: React.ReactNode;
  Shell: React.ComponentType<{ children: React.ReactNode }>;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  // Wait for the client to mount before making any auth decisions.
  // This avoids SSR/hydration mismatches and ensures sessionStorage is readable.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (!mounted) return;
    if (pathname === LOGIN_PATH) return;
    if (!token) {
      router.replace(LOGIN_PATH);
    }
  }, [mounted, token, pathname, router]);

  // First pass: render nothing — avoids a flash of wrong content
  if (!mounted) return null;

  // Login page: always accessible (no Shell wrapper)
  if (pathname === LOGIN_PATH) return <>{children}</>;

  // Not authenticated: show nothing while redirect fires
  if (!token) return null;

  // Authenticated: wrap in the CMS shell
  return <Shell>{children}</Shell>;
}
