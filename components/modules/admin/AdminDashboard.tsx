'use client';

import {
  GraduationCap, UserCheck, ClipboardCheck, Wallet,
  TrendingUp, TrendingDown, BookOpen, School, Clock,
  CheckCircle2, AlertCircle, ArrowRight, Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

// ── Mock data ─────────────────────────────────────────────
const stats = [
  { id: 'siswa',     label: 'Total Siswa',     value: '1.248', change: '+24', trend: 'up',      icon: GraduationCap },
  { id: 'guru',      label: 'Total Guru',      value: '86',    change: '+3',  trend: 'up',      icon: UserCheck },
  { id: 'kehadiran', label: 'Kehadiran (H)',   value: '94.2%', change: '-1.3%', trend: 'down',    icon: ClipboardCheck },
  { id: 'tagihan',   label: 'Tagihan Belum',   value: '127',   change: 'Rp 45jt', trend: 'neutral', icon: Wallet },
];

const activities = [
  { id: 1, text: 'Andi Pratama ditambahkan ke Kelas X IPA 1', time: '5 mnt lalu', icon: GraduationCap, color: 'var(--color-info)' },
  { id: 2, text: 'Nilai UTS Matematika kelas XI IPS 2 telah diinput', time: '32 mnt lalu', icon: BookOpen, color: 'var(--color-success)' },
  { id: 3, text: '12 siswa alfa hari ini', time: '1 jam lalu', icon: ClipboardCheck, color: 'var(--color-danger)' },
  { id: 4, text: 'Sri Wahyuni membayar SPP bulan Juli', time: '2 jam lalu', icon: Wallet, color: 'var(--color-success)' },
  { id: 5, text: 'Pengumuman libur Idul Adha dipublikasikan', time: '3 jam lalu', icon: School, color: 'var(--color-info)' },
];

const quickActions = [
  { id: 'tambah-siswa',  label: 'Tambah Siswa',  icon: GraduationCap },
  { id: 'input-absensi', label: 'Input Absensi', icon: ClipboardCheck },
  { id: 'input-nilai',   label: 'Input Nilai',   icon: BookOpen },
  { id: 'tagihan-spp',   label: 'Tagihan SPP',   icon: Wallet },
];

const attendance = [
  { label: 'Hadir', count: 1176, total: 1248, color: 'var(--color-success)' },
  { label: 'Izin',  count: 38,   total: 1248, color: 'var(--color-info)' },
  { label: 'Sakit', count: 24,   total: 1248, color: 'var(--color-warning)' },
  { label: 'Alfa',  count: 10,   total: 1248, color: 'var(--color-danger)' },
];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : 'Selamat Sore';

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            {greeting},{' '}
            <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-[11px] sm:text-xs mt-1 font-medium" style={{ color: 'var(--color-muted)' }}>
            {new Intl.DateTimeFormat('id-ID', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            }).format(new Date())}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-sm text-xs font-semibold"
             style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', color: 'var(--color-text)' }}>
          <School size={14} style={{ color: 'var(--color-brand)' }} />
          SMA N 1 Contoh
          <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background: 'var(--color-success-soft)', color: 'var(--color-success-dark)' }}>
            Aktif
          </span>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ id, label, value, change, trend, icon: Icon }) => (
          <div key={id} id={id} className="rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand-dark)' }}>
                <Icon size={18} />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{
                      background: trend === 'up' ? 'var(--color-success-soft)' : trend === 'down' ? 'var(--color-danger-soft)' : 'var(--color-warning-soft)',
                      color:      trend === 'up' ? 'var(--color-success-dark)' : trend === 'down' ? 'var(--color-danger-dark)' : 'var(--color-warning-dark)'
                    }}>
                {trend === 'up' && <TrendingUp size={10} />}
                {trend === 'down' && <TrendingDown size={10} />}
                {change}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--color-text)' }}>{value}</p>
            <p className="text-[11px] mt-0.5 font-semibold" style={{ color: 'var(--color-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ─────────────────────────────────── */}
      <div>
        <h2 className="font-bold text-[13px] mb-2.5" style={{ color: 'var(--color-text)' }}>Aksi Cepat</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ id, label, icon: Icon }) => (
            <button key={id} id={id}
                    className="group rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center gap-2.5 text-center"
                    style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                   style={{ background: 'var(--color-section)', color: 'var(--color-brand)' }}>
                <Icon size={18} />
              </div>
              <span className="text-[11px] font-bold" style={{ color: 'var(--color-text)' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Content Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Activity Feed */}
        <div className="xl:col-span-2 rounded-2xl shadow-sm overflow-hidden"
             style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
          <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
            <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Aktivitas Terkini</h3>
            <button className="flex items-center gap-1 text-[11px] font-bold transition-colors hover:opacity-80"
                    style={{ color: 'var(--color-brand)' }}>
              Lihat Semua <ArrowRight size={12} />
            </button>
          </div>
          <div>
            {activities.map(({ id, text, time, icon: Icon, color }, idx) => (
              <div key={id} className="flex items-start gap-3.5 px-5 py-3"
                   style={{ borderBottom: idx !== activities.length -1 ? '0.5px solid var(--color-section)' : 'none' }}>
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium leading-relaxed" style={{ color: 'var(--color-text)' }}>{text}</p>
                  <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: 'var(--color-muted)' }}>
                    <Clock size={10} /> {time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          
          {/* Attendance Chart */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Kehadiran Hari Ini</h3>
            </div>
            <div className="px-5 py-4 space-y-3.5">
              {attendance.map(({ label, count, total, color }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--color-muted)' }}>{label}</span>
                    <span className="text-[11px] font-bold" style={{ color: 'var(--color-text)' }}>{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-section)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                         style={{ width: `${(count / total) * 100}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Status Sistem</h3>
            </div>
            <div className="px-5 py-3 space-y-2">
              {[
                { label: 'API Server', ok: true },
                { label: 'Database', ok: true },
                { label: 'Email Service', ok: false },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    {ok
                      ? <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />
                      : <AlertCircle size={14} style={{ color: 'var(--color-danger)' }} />
                    }
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--color-text)' }}>{label}</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: ok ? 'var(--color-success-soft)' : 'var(--color-danger-soft)',
                          color:      ok ? 'var(--color-success-dark)' : 'var(--color-danger-dark)'
                        }}>
                    {ok ? 'Online' : 'Offline'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Single Primary CTA */}
          <button className="w-full rounded-xl py-3 font-bold text-[12px] text-white flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: 'var(--color-brand)', boxShadow: '0 2px 10px rgba(55,138,221,0.2)' }}>
            <Plus size={16} />
            Tambah Data Baru
          </button>
        </div>
      </div>
    </div>
  );
}
