'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuthStore } from '@/stores/auth.store';
import { authApi } from '@/lib/api/endpoints';
import { UserRole } from '@/types/enums';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setAuth, logout, setLoading } = useAuthStore();

  // ── Restore session on mount ─────────────────────────
  useEffect(() => {
    if (isAuthenticated) return;

    const restoreSession = async () => {
      try {
        const [refreshRes, meRes] = await Promise.all([
          authApi.refresh(),
          authApi.me(),
        ]);
        const token = refreshRes.data?.data?.accessToken;
        const userData = meRes.data?.data;
        if (token && userData) {
          setAuth(userData, token);
        }
      } catch {
        logout();
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [isAuthenticated, setAuth, logout, router, setLoading]);

  // ── Role guard ───────────────────────────────────────
  useEffect(() => {
    if (isLoading || !user) return;
    if (allowedRoles && user.role && !allowedRoles.includes(user.role as UserRole)) {
      router.replace('/login');
    }
  }, [isLoading, user, allowedRoles, router]);

  // ── Loading state ────────────────────────────────────
  if (isLoading || !user) {
    return (
      <div className="layout-loading">
        <div className="layout-loading__spinner" />
        <style jsx>{`
          .layout-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: hsl(var(--color-bg));
          }
          .layout-loading__spinner {
            width: 40px; height: 40px;
            border: 3px solid hsl(var(--color-border));
            border-top-color: hsl(var(--color-primary));
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        {/* ── Topbar ──────────────────────────────────── */}
        <header className="topbar">
          <div className="topbar__search">
            <Search size={16} className="topbar__search-icon" />
            <input
              type="text"
              placeholder="Cari siswa, guru, kelas..."
              className="topbar__search-input"
            />
          </div>

          <div className="topbar__actions">
            <button type="button" className="topbar__notif" aria-label="Notifikasi">
              <Bell size={19} />
              <span className="topbar__notif-dot" />
            </button>
            <div className="topbar__user">
              <div className="topbar__avatar">
                {user.name?.slice(0, 1).toUpperCase()}
              </div>
              <div className="topbar__user-info">
                <p className="topbar__user-name">{user.name}</p>
                <p className="topbar__user-role">{user.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Page Content ────────────────────────────── */}
        <main className="dashboard-content fade-in">
          {children}
        </main>
      </div>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: hsl(var(--color-bg));
        }

        .dashboard-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }

        /* ── Topbar ──────────────────────────────────── */
        .topbar {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          background: hsl(var(--color-surface));
          border-bottom: 1px solid hsl(var(--color-border));
          gap: 16px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .topbar__search {
          position: relative;
          flex: 1;
          max-width: 380px;
        }
        .topbar__search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(var(--color-text-muted));
        }
        .topbar__search-input {
          width: 100%;
          padding: 8px 12px 8px 36px;
          border-radius: 8px;
          border: 1.5px solid hsl(var(--color-border));
          background: hsl(var(--color-bg));
          color: hsl(var(--color-text));
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .topbar__search-input:focus { border-color: hsl(var(--color-primary)); }
        .topbar__search-input::placeholder { color: hsl(var(--color-text-muted)); }

        .topbar__actions { display: flex; align-items: center; gap: 16px; }

        .topbar__notif {
          position: relative;
          width: 38px; height: 38px;
          border-radius: 10px;
          background: hsl(var(--color-bg));
          border: 1.5px solid hsl(var(--color-border));
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: hsl(var(--color-text-muted));
          transition: all 0.15s;
        }
        .topbar__notif:hover {
          border-color: hsl(var(--color-primary));
          color: hsl(var(--color-primary));
        }
        .topbar__notif-dot {
          position: absolute; top: 8px; right: 8px;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: hsl(var(--color-danger));
          border: 2px solid hsl(var(--color-surface));
        }

        .topbar__user { display: flex; align-items: center; gap: 10px; }
        .topbar__avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, hsl(234 89% 56%), hsl(280 65% 60%));
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 700; color: white;
          flex-shrink: 0;
        }
        .topbar__user-name { font-size: 0.85rem; font-weight: 600; color: hsl(var(--color-text)); margin: 0; }
        .topbar__user-role {
          font-size: 0.72rem; color: hsl(var(--color-text-muted));
          margin: 0; text-transform: capitalize;
        }

        /* ── Content ─────────────────────────────────── */
        .dashboard-content {
          flex: 1;
          padding: 28px;
          overflow-y: auto;
        }

        /* ── Responsive ──────────────────────────────── */
        @media (max-width: 768px) {
          .dashboard-content { padding: 16px; }
          .topbar__user-info { display: none; }
          .topbar__search { max-width: 200px; }
        }
      `}</style>
    </div>
  );
}
