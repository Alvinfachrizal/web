'use client';

import {
  Users, GraduationCap, UserCheck, BookOpen,
  ClipboardCheck, Wallet, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle2, Clock, School,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

// ── Mock data (akan diganti API call) ───────────────────
const stats = [
  {
    id: 'total-siswa',
    label: 'Total Siswa',
    value: '1.248',
    change: '+24',
    trend: 'up',
    icon: GraduationCap,
    color: 'blue',
  },
  {
    id: 'total-guru',
    label: 'Total Guru',
    value: '86',
    change: '+3',
    trend: 'up',
    icon: UserCheck,
    color: 'purple',
  },
  {
    id: 'kehadiran',
    label: 'Kehadiran Hari Ini',
    value: '94.2%',
    change: '-1.3%',
    trend: 'down',
    icon: ClipboardCheck,
    color: 'green',
  },
  {
    id: 'tagihan',
    label: 'Tagihan Belum Bayar',
    value: '127',
    change: 'Rp 45,2 Jt',
    trend: 'neutral',
    icon: Wallet,
    color: 'amber',
  },
];

const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
  blue:   { bg: 'hsl(234 89% 56% / 0.08)', icon: 'hsl(234 89% 56%)', badge: 'badge-blue' },
  purple: { bg: 'hsl(280 65% 60% / 0.08)', icon: 'hsl(280 65% 55%)', badge: 'badge-purple' },
  green:  { bg: 'hsl(142 71% 45% / 0.08)', icon: 'hsl(142 71% 40%)', badge: 'badge-green' },
  amber:  { bg: 'hsl(38 92% 50% / 0.08)',  icon: 'hsl(38 72% 45%)',  badge: 'badge-amber' },
};

const recentActivities = [
  { id: 1, type: 'siswa', text: 'Andi Pratama ditambahkan ke Kelas X IPA 1', time: '5 menit lalu', icon: GraduationCap, color: 'blue' },
  { id: 2, type: 'nilai', text: 'Nilai UTS Matematika kelas XI IPS 2 telah diinput', time: '32 menit lalu', icon: BookOpen, color: 'purple' },
  { id: 3, type: 'absensi', text: '12 siswa tidak hadir hari ini', time: '1 jam lalu', icon: ClipboardCheck, color: 'amber' },
  { id: 4, type: 'pembayaran', text: 'Sri Wahyuni membayar SPP bulan Juli', time: '2 jam lalu', icon: Wallet, color: 'green' },
  { id: 5, type: 'pengumuman', text: 'Pengumuman libur Idul Adha dipublikasikan', time: '3 jam lalu', icon: School, color: 'blue' },
];

const quickActions = [
  { id: 'tambah-siswa', label: 'Tambah Siswa', icon: GraduationCap, href: '/admin/siswa/tambah', color: 'blue' },
  { id: 'input-absensi', label: 'Input Absensi', icon: ClipboardCheck, href: '/admin/absensi', color: 'green' },
  { id: 'input-nilai', label: 'Input Nilai', icon: BookOpen, href: '/admin/nilai', color: 'purple' },
  { id: 'tagihan-spp', label: 'Tagihan SPP', icon: Wallet, href: '/admin/keuangan', color: 'amber' },
];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : 'Selamat Sore';

  return (
    <div className="admin-dashboard">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">
            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="dash-subtitle">
            Berikut ringkasan aktivitas sekolah hari ini,{' '}
            {new Intl.DateTimeFormat('id-ID', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            }).format(new Date())}
          </p>
        </div>

        <div className="dash-school-badge">
          <School size={15} />
          <span>SMA Negeri 1 Contoh</span>
          <span className="badge badge-green">Aktif</span>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────── */}
      <div className="dash-stats">
        {stats.map(({ id, label, value, change, trend, icon: Icon, color }) => {
          const c = colorMap[color];
          return (
            <div key={id} id={id} className="stat-card card">
              <div className="stat-card__header">
                <div className="stat-card__icon" style={{ background: c.bg, color: c.icon }}>
                  <Icon size={20} />
                </div>
                <div className={cn('badge', trend === 'up' ? 'badge-green' : trend === 'down' ? 'badge-red' : 'badge-amber')}>
                  {trend === 'up' && <TrendingUp size={11} />}
                  {trend === 'down' && <TrendingDown size={11} />}
                  {change}
                </div>
              </div>
              <p className="stat-card__value">{value}</p>
              <p className="stat-card__label">{label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions ────────────────────────────────── */}
      <div className="dash-section">
        <h2 className="dash-section-title">Aksi Cepat</h2>
        <div className="quick-actions">
          {quickActions.map(({ id, label, icon: Icon, href, color }) => {
            const c = colorMap[color];
            return (
              <a key={id} id={id} href={href} className="quick-action card">
                <div className="quick-action__icon" style={{ background: c.bg, color: c.icon }}>
                  <Icon size={22} />
                </div>
                <span className="quick-action__label">{label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Content Grid ────────────────────────────────── */}
      <div className="dash-grid">
        {/* Recent Activity */}
        <div className="card dash-activity">
          <div className="dash-card-header">
            <h3>Aktivitas Terkini</h3>
            <a href="/admin/aktivitas" className="dash-see-all">Lihat Semua</a>
          </div>
          <div className="activity-list">
            {recentActivities.map(({ id, text, time, icon: Icon, color }) => {
              const c = colorMap[color];
              return (
                <div key={id} className="activity-item">
                  <div className="activity-item__icon" style={{ background: c.bg, color: c.icon }}>
                    <Icon size={15} />
                  </div>
                  <div className="activity-item__content">
                    <p className="activity-item__text">{text}</p>
                    <p className="activity-item__time">
                      <Clock size={11} />
                      {time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Panel */}
        <div className="dash-status-col">
          {/* Kehadiran */}
          <div className="card dash-status-card">
            <div className="dash-card-header">
              <h3>Status Kehadiran Hari Ini</h3>
            </div>
            <div className="attendance-bars">
              {[
                { label: 'Hadir', count: 1176, total: 1248, color: 'hsl(142 71% 45%)' },
                { label: 'Sakit', count: 38, total: 1248, color: 'hsl(38 92% 50%)' },
                { label: 'Izin', count: 24, total: 1248, color: 'hsl(199 89% 48%)' },
                { label: 'Alfa', count: 10, total: 1248, color: 'hsl(0 84% 60%)' },
              ].map(({ label, count, total, color }) => (
                <div key={label} className="att-bar">
                  <div className="att-bar__info">
                    <span className="att-bar__label">{label}</span>
                    <span className="att-bar__count">{count}</span>
                  </div>
                  <div className="att-bar__track">
                    <div
                      className="att-bar__fill"
                      style={{ width: `${(count / total) * 100}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="card dash-status-card">
            <div className="dash-card-header">
              <h3>Status Sistem</h3>
            </div>
            <div className="sys-status-list">
              {[
                { label: 'API Server', ok: true },
                { label: 'Database', ok: true },
                { label: 'File Storage', ok: true },
                { label: 'Email Service', ok: false },
              ].map(({ label, ok }) => (
                <div key={label} className="sys-status-item">
                  {ok
                    ? <CheckCircle2 size={15} style={{ color: 'hsl(142 71% 45%)' }} />
                    : <AlertCircle size={15} style={{ color: 'hsl(0 84% 60%)' }} />
                  }
                  <span>{label}</span>
                  <span className={cn('badge', ok ? 'badge-green' : 'badge-red')}>
                    {ok ? 'Online' : 'Offline'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard { display: flex; flex-direction: column; gap: 24px; }

        .dash-header {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
          flex-wrap: wrap;
        }
        .dash-title { font-size: 1.625rem; font-weight: 800; margin-bottom: 4px; letter-spacing: -0.02em; }
        .dash-subtitle { color: hsl(var(--color-text-muted)); font-size: 0.9rem; }
        .dash-school-badge {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px; border-radius: 10px;
          background: hsl(var(--color-surface));
          border: 1px solid hsl(var(--color-border));
          font-size: 0.85rem; font-weight: 500; color: hsl(var(--color-text));
          flex-shrink: 0;
        }

        /* ── Stat Cards ─────────────────────────────── */
        .dash-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .stat-card { padding: 20px; }
        .stat-card__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
        .stat-card__icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .stat-card__value { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.03em; color: hsl(var(--color-text)); margin-bottom: 4px; }
        .stat-card__label { font-size: 0.82rem; color: hsl(var(--color-text-muted)); }

        /* ── Quick Actions ─────────────────────────── */
        .dash-section-title { font-size: 1rem; font-weight: 700; margin-bottom: 12px; }
        .quick-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .quick-action {
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; padding: 20px 16px; text-align: center;
          text-decoration: none; transition: all 0.2s;
        }
        .quick-action:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .quick-action__icon {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
        }
        .quick-action__label { font-size: 0.82rem; font-weight: 600; color: hsl(var(--color-text)); }

        /* ── Content Grid ──────────────────────────── */
        .dash-grid { display: grid; grid-template-columns: 1fr 380px; gap: 20px; }

        /* Activity */
        .dash-activity { padding: 20px; }
        .dash-card-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;
        }
        .dash-card-header h3 { font-size: 0.95rem; font-weight: 700; }
        .dash-see-all { font-size: 0.8rem; color: hsl(var(--color-primary)); text-decoration: none; font-weight: 600; }
        .dash-see-all:hover { text-decoration: underline; }

        .activity-list { display: flex; flex-direction: column; gap: 16px; }
        .activity-item { display: flex; gap: 12px; align-items: flex-start; }
        .activity-item__icon {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .activity-item__text { font-size: 0.85rem; color: hsl(var(--color-text)); margin-bottom: 3px; line-height: 1.4; }
        .activity-item__time {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.75rem; color: hsl(var(--color-text-muted));
        }

        /* Status col */
        .dash-status-col { display: flex; flex-direction: column; gap: 16px; }
        .dash-status-card { padding: 20px; }

        .attendance-bars { display: flex; flex-direction: column; gap: 14px; }
        .att-bar { display: flex; flex-direction: column; gap: 6px; }
        .att-bar__info { display: flex; justify-content: space-between; }
        .att-bar__label { font-size: 0.82rem; color: hsl(var(--color-text)); font-weight: 500; }
        .att-bar__count { font-size: 0.82rem; font-weight: 700; color: hsl(var(--color-text)); }
        .att-bar__track {
          height: 7px; border-radius: 9999px;
          background: hsl(var(--color-surface-2));
          overflow: hidden;
        }
        .att-bar__fill { height: 100%; border-radius: 9999px; transition: width 0.5s; }

        .sys-status-list { display: flex; flex-direction: column; gap: 12px; }
        .sys-status-item {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.875rem; color: hsl(var(--color-text));
        }
        .sys-status-item .badge { margin-left: auto; }

        /* Responsive */
        @media (max-width: 1100px) {
          .dash-stats { grid-template-columns: repeat(2, 1fr); }
          .quick-actions { grid-template-columns: repeat(2, 1fr); }
          .dash-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .dash-stats { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
