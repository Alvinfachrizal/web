'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell, Search, LayoutDashboard, GraduationCap,
  BookOpen, ClipboardCheck, Settings, Menu, X,
} from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuthStore } from '@/stores/auth.store';
import { authApi } from '@/lib/api/endpoints';
import { UserRole } from '@/types/enums';
import { getInitials, cn } from '@/lib/utils';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

// Bottom nav items (mobile)
const BOTTOM_NAV = [
  { label: 'Beranda', icon: LayoutDashboard, hrefBase: 'dashboard' },
  { label: 'Siswa',   icon: GraduationCap,   hrefBase: 'siswa' },
  { label: 'Akademik',icon: BookOpen,        hrefBase: 'lms' },
  { label: 'Absensi', icon: ClipboardCheck,  hrefBase: 'absensi' },
  { label: 'Lainnya', icon: Settings,        hrefBase: 'pengaturan' },
];

export default function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, setAuth, logout, setLoading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);

  // Restore session
  useEffect(() => {
    if (isAuthenticated) return;
    const restoreSession = async () => {
      try {
        const [refreshRes, meRes] = await Promise.all([authApi.refresh(), authApi.me()]);
        const token = refreshRes.data?.data?.accessToken;
        const userData = meRes.data?.data;
        if (token && userData) setAuth(userData, token);
      } catch {
        logout();
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, [isAuthenticated, setAuth, logout, router, setLoading]);

  // Role guard
  useEffect(() => {
    if (isLoading || !user) return;
    if (allowedRoles && user.role && !allowedRoles.includes(user.role as UserRole)) {
      router.replace('/login');
    }
  }, [isLoading, user, allowedRoles, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-page)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse"
               style={{ background: 'var(--color-brand)' }}>
            <div className="w-4 h-4 rounded-full bg-white/50" />
          </div>
          <div className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Memuat...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-page)' }}>
      {/* ── Desktop Sidebar ──────────────────────────────── */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* ── Mobile Sidebar Overlay ───────────────────────── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative h-full animate-slideUp">
            <Sidebar />
          </div>
          <button
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white z-10"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ── Main Content ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* ── Topbar ───────────────────────────────────────── */}
        <header className="h-14 sticky top-0 z-30 flex items-center px-4 gap-3 backdrop-blur-md"
                style={{ background: 'rgba(255,255,255,0.85)', borderBottom: '0.5px solid var(--color-border)' }}>
          
          {/* Mobile menu button */}
          <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                  style={{ color: 'var(--color-muted)' }}
                  onClick={() => setSidebarOpen(true)}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-section)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Menu size={18} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-xs">
            {searchOpen ? (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
                <input autoFocus type="text" placeholder="Cari..."
                       className="w-full pl-9 pr-3 py-2 text-xs rounded-xl outline-none transition-all duration-200"
                       style={{ background: 'var(--color-section)', color: 'var(--color-text)', border: '0.5px solid transparent' }}
                       onBlur={() => setSearchOpen(false)}
                       onFocus={e => {
                         e.currentTarget.style.background = '#fff';
                         e.currentTarget.style.borderColor = 'var(--color-brand)';
                       }} />
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)}
                      className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors w-48"
                      style={{ background: 'var(--color-section)', color: 'var(--color-muted)' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#E8E6E0'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--color-section)'}>
                <Search size={14} /><span>Cari data...</span>
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Search mobile */}
            <button className="sm:hidden w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
                    style={{ color: 'var(--color-muted)' }}
                    onClick={() => setSearchOpen(true)}>
              <Search size={17} />
            </button>

            {/* Notification */}
            <button className="relative w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
                    style={{ color: 'var(--color-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-section)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--color-danger)' }} />
            </button>

            {/* User */}
            <div className="flex items-center gap-2 pl-1 border-l ml-1" style={{ borderColor: 'var(--color-border)' }}>
              <div className="hidden sm:block text-right">
                <p className="text-[11px] font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
                  {user.name?.split(' ')[0]}
                </p>
                <p className="text-[9px] capitalize mt-0.5" style={{ color: 'var(--color-muted)' }}>
                  {user.role?.replace('_', ' ')}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                   style={{ background: 'var(--color-brand)' }}>
                {getInitials(user.name || 'U')}
              </div>
            </div>
          </div>
        </header>

        {/* ── Page Content ──────────────────────────────────── */}
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6 overflow-auto animate-fadeIn">
          {children}
        </main>

        {/* ── Mobile Bottom Navigation ──────────────────────── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30"
             style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderTop: '0.5px solid var(--color-border)' }}>
          <div className="px-2 pt-1.5 pb-safe">
            <div className="flex items-center justify-around">
              {BOTTOM_NAV.map(({ label, icon: Icon, hrefBase }) => {
                const isActive = pathname.includes(hrefBase);
                return (
                  <Link key={hrefBase} href={`#`}
                        className="flex flex-col items-center gap-0.5 px-2 py-1 min-w-[50px]">
                    <div className={cn(
                           'w-9 h-7 flex items-center justify-center rounded-xl transition-all duration-200',
                         )}
                         style={isActive ? { background: 'var(--color-brand-soft)', color: 'var(--color-brand)' } : { color: 'var(--color-muted)' }}>
                      <Icon size={17} />
                    </div>
                    <span className="text-[9px] font-semibold leading-none"
                          style={{ color: isActive ? 'var(--color-brand)' : 'var(--color-muted)' }}>
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="h-1" />
          </div>
        </nav>
      </div>
    </div>
  );
}
