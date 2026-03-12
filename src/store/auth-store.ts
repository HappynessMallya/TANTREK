/**
 * Zustand auth store for the CMS.
 *
 * - Persists token + user to sessionStorage so the session survives page
 *   refreshes within the same browser tab, but clears when the tab is closed.
 * - Exposes `getAuthToken()` — a plain function (not a hook) used by the API
 *   client to attach `Authorization: Bearer <token>` to every request.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  /** Raw JWT returned by the login endpoint */
  token: string | null;
  /** Decoded user info from the login response */
  user: AuthUser | null;

  // ── Actions ──────────────────────────────────────────────────────────────
  /** Called after a successful login — stores token + user */
  setAuth: (token: string, user: AuthUser) => void;
  /** Called on logout or when the server returns 401 */
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "cms-auth-v1", // key used in sessionStorage
      storage: createJSONStorage(() =>
        // sessionStorage is only available in the browser
        typeof window !== "undefined" ? sessionStorage : sessionStorage
      ),
      // Only persist what we need — never persist action functions
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

/**
 * Read the current auth token OUTSIDE a React component.
 * Used by the API client so every fetch call gets the latest token.
 */
export function getAuthToken(): string | null {
  return useAuthStore.getState().token;
}
