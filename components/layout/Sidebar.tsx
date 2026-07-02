'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardCheck,
  Star, Wallet, Megaphone, Settings, LogOut, School, Calendar,
  FileText, UserCheck, ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/stores/auth.store';
import { authApi } from '@/lib/api/endpoints';
import { UserRole } from '@/types/enums';
import { getInitials, cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: UserRole[];
}
interface NavGroup { group: string; items: NavItem[]; }

const NAV: NavGroup[] = [
  {
    group: 'Utama',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard',  icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.KEPALA_SEKOLAH, UserRole.SUPER_ADMIN] },
      { label: 'Dashboard', href: '/guru/dashboard',   icon: LayoutDashboard, roles: [UserRole.GURU] },
      { label: 'Dashboard', href: '/siswa/dashboard',  icon: LayoutDashboard, roles: [UserRole.SISWA] },
      { label: 'Dashboard', href: '/ortu/dashboard',   icon: LayoutDashboard, roles: [UserRole.ORTU] },
    ],
  },
  {
    group: 'Administrasi',
    items: [
      { label: 'Data Siswa',   href: '/admin/siswa',        icon: GraduationCap, roles: [UserRole.ADMIN, UserRole.KEPALA_SEKOLAH, UserRole.GURU] },
      { label: 'Data Guru',    href: '/admin/guru',         icon: UserCheck,     roles: [UserRole.ADMIN, UserRole.KEPALA_SEKOLAH] },
      { label: 'Kelas & Mapel',href: '/admin/kelas',        icon: School,        roles: [UserRole.ADMIN, UserRole.KEPALA_SEKOLAH] },
      { label: 'Tahun Ajaran', href: '/admin/tahun-ajaran', icon: Calendar,      roles: [UserRole.ADMIN] },
      { label: 'Pengguna',     href: '/admin/pengguna',     icon: Users,         roles: [UserRole.ADMIN] },
    ],
  },
  {
    group: 'Akademik',
    items: [
      { label: 'Materi & LMS', href: '/admin/lms',     icon: BookOpen },
      { label: 'Absensi',      href: '/admin/absensi',  icon: ClipboardCheck },
      { label: 'Nilai & Rapor',href: '/admin/nilai',    icon: Star },
    ],
  },
  {
    group: 'Lainnya',
    items: [
      { label: 'Keuangan',   href: '/admin/keuangan',   icon: Wallet,    roles: [UserRole.ADMIN] },
      { label: 'Pengumuman', href: '/admin/pengumuman', icon: Megaphone },
      { label: 'PPDB Online',href: '/admin/ppdb',       icon: FileText,  roles: [UserRole.ADMIN] },
      { label: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, logout } = useAuthStore();
  const userRole  = user?.role as UserRole | undefined;

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* silent */ }
    logout();
    router.replace('/login');
  };

  // Filter + deduplicate Dashboard
  const processedGroups = NAV.map(group => {
    let items = group.items.filter(item => !item.roles || !userRole || item.roles.includes(userRole));
    if (group.group === 'Utama') {
      const dash = items.find(i => i.label === 'Dashboard');
      items = dash ? [dash] : items;
    }
    return { ...group, items };
  }).filter(g => g.items.length > 0);

  return (
    <aside className="w-58 flex-shrink-0 h-screen sticky top-0 flex flex-col overflow-y-auto no-scrollbar"
           style={{ background: 'var(--color-surface)', borderRight: '0.5px solid var(--color-border)', width: 228 }}>

      {/* Brand */}
      <div className="px-4 py-4" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm flex-shrink-0"
               style={{ border: '0.5px solid var(--color-border)' }}>
            <Image src="/school-logo.png" alt="Logo" width={32} height={32} className="object-contain" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-[13px] leading-tight truncate" style={{ color: 'var(--color-text)' }}>
              SMA N 1 Contoh
            </p>
            <p className="text-[10px]" style={{ color: 'var(--color-muted)' }}>Sistem Informasi</p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-3 py-3" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl"
             style={{ background: 'var(--color-brand-soft)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
               style={{ background: 'var(--color-brand)' }}>
            {getInitials(user?.name || 'U')}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-brand-dark)' }}>
              {user?.name}
            </p>
            <p className="text-[10px] capitalize" style={{ color: 'var(--color-brand)' }}>
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-4">
        {processedGroups.map(group => (
          <div key={group.group}>
            <p className="text-[9px] font-bold uppercase tracking-widest px-2 mb-1"
               style={{ color: 'var(--color-muted)' }}>
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link key={href} href={href}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150',
                          'group'
                        )}
                        style={isActive ? {
                          background: 'var(--color-brand-soft)',
                          color:      'var(--color-brand)',
                        } : {
                          color: '#4A4A48',
                        }}
                        onMouseEnter={e => !isActive && (e.currentTarget.style.background = 'var(--color-page)')}
                        onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
                  >
                    <Icon size={15} className="flex-shrink-0" />
                    <span className="truncate">{label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full"
                           style={{ background: 'var(--color-brand)' }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3" style={{ borderTop: '0.5px solid var(--color-border)' }}>
        <button type="button" id="btn-logout" onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium w-full transition-all duration-150"
                style={{ color: 'var(--color-danger)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-danger-soft)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <LogOut size={15} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
