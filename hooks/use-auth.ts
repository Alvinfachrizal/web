'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { authApi } from '@/lib/api/endpoints';
import { ROLE_DASHBOARD_PATH, UserRole } from '@/types/enums';

/**
 * Hook untuk inisialisasi session saat app pertama kali dimuat.
 * Mencoba refresh token untuk restore session jika user sudah pernah login.
 */
export function useInitAuth() {
  const { setAuth, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const initSession = async () => {
      try {
        // Coba ambil data user dengan access token yang ada
        const response = await authApi.me();
        if (response.data?.data) {
          // me() berhasil — tapi kita butuh token baru juga, coba refresh dulu
          const refreshResponse = await authApi.refresh();
          const newToken = refreshResponse.data?.data?.accessToken;
          if (newToken) {
            setAuth(response.data.data, newToken);
          }
        }
      } catch {
        // Token expired atau belum login — silent fail
        logout();
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [setAuth, setLoading, logout]);
}

/**
 * Hook untuk memastikan halaman hanya bisa diakses oleh role tertentu.
 */
export function useRequireAuth(allowedRoles?: UserRole[]) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role as UserRole)) {
        // Redirect ke dashboard sesuai role
        const dashboardPath = ROLE_DASHBOARD_PATH[user.role as UserRole] || '/login';
        router.replace(dashboardPath);
      }
    }
  }, [isAuthenticated, isLoading, user, router, allowedRoles]);

  return { user, isLoading };
}
