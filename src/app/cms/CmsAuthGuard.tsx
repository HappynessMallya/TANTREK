"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";

const LOGIN_PATH = "/cms/login";

/**
 * Guards all CMS routes.
 * Reads auth state from the Zustand store (persisted in sessionStorage).
 * Redirects to /cms/login if no token is present.
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

  // Wait for the Zustand store to rehydrate from sessionStorage before checking auth
  const [hydrated, setHydrated] = useState(false);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    // `onFinishHydration` fires once persist middleware has loaded sessionStorage
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    // If already hydrated (e.g. navigating between pages), set immediately
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (pathname === LOGIN_PATH) return;
    if (!token) {
      router.replace(LOGIN_PATH);
    }
  }, [hydrated, token, pathname, router]);

  // Show nothing until we know the hydration state
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-luxury-champagne">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent" />
      </div>
    );
  }

  if (pathname === LOGIN_PATH) return <>{children}</>;
  if (!token) return null;
  return <Shell>{children}</Shell>;
}
