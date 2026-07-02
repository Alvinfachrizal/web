'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardCheck,
  Star, Wallet, Megaphone, Settings, LogOut, ChevronRight,
  School, Calendar, FileText, UserCheck,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { authApi } from '@/lib/api/endpoints';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/enums';
import { getInitials, cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: UserRole[];
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    group: 'Utama',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.KEPALA_SEKOLAH] },
      { label: 'Dashboard', href: '/guru/dashboard', icon: LayoutDashboard, roles: [UserRole.GURU] },
      { label: 'Dashboard', href: '/siswa/dashboard', icon: LayoutDashboard, roles: [UserRole.SISWA] },
      { label: 'Dashboard', href: '/ortu/dashboard', icon: LayoutDashboard, roles: [UserRole.ORTU] },
    ],
  },
  {
    group: 'Administrasi',
    items: [
      { label: 'Data Siswa', href: '/admin/siswa', icon: GraduationCap, roles: [UserRole.ADMIN, UserRole.KEPALA_SEKOLAH, UserRole.GURU] },
      { label: 'Data Guru', href: '/admin/guru', icon: UserCheck, roles: [UserRole.ADMIN, UserRole.KEPALA_SEKOLAH] },
      { label: 'Kelas & Mapel', href: '/admin/kelas', icon: School, roles: [UserRole.ADMIN, UserRole.KEPALA_SEKOLAH] },
      { label: 'Tahun Ajaran', href: '/admin/tahun-ajaran', icon: Calendar, roles: [UserRole.ADMIN] },
      { label: 'Pengguna', href: '/admin/pengguna', icon: Users, roles: [UserRole.ADMIN] },
    ],
  },
  {
    group: 'Akademik',
    items: [
      { label: 'Materi & LMS', href: '/admin/lms', icon: BookOpen },
      { label: 'Absensi', href: '/admin/absensi', icon: ClipboardCheck },
      { label: 'Nilai & Rapor', href: '/admin/nilai', icon: Star },
    ],
  },
  {
    group: 'Keuangan & Info',
    items: [
      { label: 'Keuangan', href: '/admin/keuangan', icon: Wallet, roles: [UserRole.ADMIN] },
      { label: 'Pengumuman', href: '/admin/pengumuman', icon: Megaphone },
      { label: 'PPDB Online', href: '/admin/ppdb', icon: FileText, roles: [UserRole.ADMIN] },
    ],
  },
  {
    group: 'Akun',
    items: [
      { label: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const userRole = user?.role as UserRole | undefined;

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* silent */ }
    logout();
    router.replace('/login');
  };

  // Filter nav items by role
  const visibleGroups = NAV.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !item.roles || !userRole || item.roles.includes(userRole),
    ),
  })).filter((g) => g.items.length > 0);

  // Deduplicate dashboard items (multiple Dashboard entries per role)
  const processedGroups = visibleGroups.map((group) => {
    if (group.group === 'Utama') {
      const dashItem = group.items.find((i) => i.label === 'Dashboard');
      return { ...group, items: dashItem ? [dashItem] : group.items };
    }
    return group;
  });

  return (
    <aside className="sidebar">
      {/* ── Brand ─────────────────────────────────────── */}
      <div className="sidebar__brand">
        <div className="sidebar__brand-icon">
          <GraduationCap size={22} color="white" />
        </div>
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">SIMS</span>
          <span className="sidebar__brand-sub">Manajemen Sekolah</span>
        </div>
      </div>

      {/* ── User Card ──────────────────────────────────── */}
      <div className="sidebar__user">
        <div className="sidebar__user-avatar">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} />
          ) : (
            <span>{getInitials(user?.name || 'U')}</span>
          )}
        </div>
        <div className="sidebar__user-info">
          <p className="sidebar__user-name">{user?.name}</p>
          <p className="sidebar__user-role">{user?.role?.replace('_', ' ')}</p>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────── */}
      <nav className="sidebar__nav">
        {processedGroups.map((group) => (
          <div key={group.group} className="sidebar__group">
            <p className="sidebar__group-label">{group.group}</p>
            {group.items.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn('sidebar-item', isActive && 'active')}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                  {isActive && <ChevronRight size={14} className="sidebar-item__arrow" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Logout ────────────────────────────────────── */}
      <div className="sidebar__footer">
        <button
          type="button"
          id="btn-logout"
          className="sidebar-item sidebar__logout"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          <span>Keluar</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: 240px;
          flex-shrink: 0;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          background: hsl(var(--color-surface));
          border-right: 1px solid hsl(var(--color-border));
          overflow-y: auto;
          padding: 20px 12px;
          gap: 8px;
        }

        .sidebar__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 6px 16px;
          border-bottom: 1px solid hsl(var(--color-border));
          margin-bottom: 4px;
        }
        .sidebar__brand-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, hsl(234 89% 56%), hsl(280 65% 60%));
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px hsl(234 89% 56% / 0.30);
        }
        .sidebar__brand-name {
          font-weight: 800; font-size: 1rem; color: hsl(var(--color-text));
          display: block; letter-spacing: -0.02em;
        }
        .sidebar__brand-sub {
          font-size: 0.7rem; color: hsl(var(--color-text-muted));
          display: block;
        }

        .sidebar__user {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 8px;
          background: hsl(var(--color-surface-2));
          border-radius: 10px;
          margin-bottom: 4px;
        }
        .sidebar__user-avatar {
          width: 36px; height: 36px;
          border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, hsl(234 89% 56%), hsl(280 65% 60%));
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 700; color: white;
          overflow: hidden;
        }
        .sidebar__user-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .sidebar__user-name { font-size: 0.85rem; font-weight: 600; color: hsl(var(--color-text)); margin: 0; }
        .sidebar__user-role {
          font-size: 0.72rem; color: hsl(var(--color-text-muted));
          margin: 0; text-transform: capitalize;
        }

        .sidebar__nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .sidebar__group { display: flex; flex-direction: column; gap: 2px; }
        .sidebar__group + .sidebar__group { margin-top: 12px; }
        .sidebar__group-label {
          font-size: 0.67rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: hsl(var(--color-text-muted));
          padding: 0 8px; margin-bottom: 4px;
        }

        .sidebar-item__arrow { margin-left: auto; opacity: 0.6; }

        .sidebar__footer {
          padding-top: 12px;
          border-top: 1px solid hsl(var(--color-border));
          margin-top: auto;
        }
        .sidebar__logout { color: hsl(var(--color-danger)) !important; width: 100%; }
        .sidebar__logout:hover {
          background: hsl(var(--color-danger) / 0.08) !important;
          color: hsl(var(--color-danger)) !important;
        }
      `}</style>
    </aside>
  );
}
