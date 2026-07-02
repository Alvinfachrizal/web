'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true, isLoading: false }),

      setAccessToken: (token) =>
        set({ accessToken: token }),

      setUser: (user) =>
        set({ user }),

      setLoading: (loading) =>
        set({ isLoading: loading }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    { name: 'sims-auth-store' },
  ),
);

// ── Register store globally untuk API client interceptor ──
// (menghindari circular import di lib/api/client.ts)
if (typeof globalThis !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).__simsAuthStore = useAuthStore;
}
