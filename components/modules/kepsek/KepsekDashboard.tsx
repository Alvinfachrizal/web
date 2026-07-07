'use client';

import {
  GraduationCap, UserCheck, TrendingUp, Wallet,
  ClipboardCheck, Star, School, BookOpen,
  ArrowRight, AlertCircle, CheckCircle2, Clock,
  BarChart3,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

// ── Mock Data ────────────────────────────────────────────────
const stats = [
  { id: 'siswa',    label: 'Total Siswa',  value: '1.248', change: '+24 bulan ini', trend: 'up',  icon: GraduationCap },
  { id: 'guru',     label: 'Total Guru',   value: '86',    change: '+3 bulan ini',  trend: 'up',  icon: UserCheck },
  { id: 'kehadiran',label: 'Rata Kehadiran', value: '94.2%', change: '-1.3% minggu ini', trend: 'down', icon: ClipboardCheck },
  { id: 'lulusan',  label: 'Kelulusan',    value: '98.7%', change: 'Angkatan 2025', trend: 'up',  icon: Star },
];

const akademikStats = [
  { label: 'Rata Nilai Sekolah', value: '78.4', icon: BarChart3,  color: 'var(--color-brand)' },
  { label: 'Siswa Berprestasi',  value: '142',  icon: Star,       color: 'var(--color-warning)' },
  { label: 'Kelas Aktif',        value: '36',   icon: School,     color: 'var(--color-success)' },
  { label: 'Mapel Tersedia',     value: '24',   icon: BookOpen,   color: 'var(--color-info)' },
];

const kehadiran = [
  { label: 'Hadir', count: 1176, total: 1248, color: 'var(--color-success)' },
  { label: 'Izin',  count: 38,   total: 1248, color: 'var(--color-info)' },
  { label: 'Sakit', count: 24,   total: 1248, color: 'var(--color-warning)' },
  { label: 'Alfa',  count: 10,   total: 1248, color: 'var(--color-danger)' },
];

const keuanganRingkasan = [
  { label: 'SPP Terkumpul Juli',  value: 'Rp 285jt',  ok: true },
  { label: 'Tagihan Belum Lunas', value: '127 siswa',  ok: false },
  { label: 'Dana BOS Cair',       value: 'Rp 450jt',  ok: true },
];

const perhatianItems = [
  { id: 1, ikon: AlertCircle, text: '12 siswa dengan absensi > 3x alpha bulan ini', severity: 'danger' },
  { id: 2, ikon: AlertCircle, text: '8 guru belum input nilai UTS',                  severity: 'warning' },
  { id: 3, ikon: CheckCircle2, text: 'Akreditasi A diperpanjang hingga 2028',        severity: 'success' },
  { id: 4, ikon: AlertCircle, text: 'Deadline laporan BOS: 15 Juli 2026',            severity: 'warning' },
];

const aktivitas = [
  { id: 1, teks: 'Nilai UTS Matematika kelas X IPA 1 diinput',  waktu: '5 mnt lalu',  color: 'var(--color-success)' },
  { id: 2, teks: '12 siswa alfa hari ini tercatat sistem',       waktu: '30 mnt lalu', color: 'var(--color-danger)' },
  { id: 3, teks: 'Guru Baru: Siti Rahayu (Bahasa Inggris)',      waktu: '2 jam lalu',  color: 'var(--color-info)' },
  { id: 4, teks: 'SPP Juli: 89 siswa baru melunasi',             waktu: '3 jam lalu',  color: 'var(--color-success)' },
  { id: 5, teks: 'Pengumuman libur dipublikasikan',              waktu: '5 jam lalu',  color: 'var(--color-brand)' },
];

const nilaiPerKelas = [
  { kelas: 'X IPA 1',  rata: 82, siswa: 32 },
  { kelas: 'X IPA 2',  rata: 79, siswa: 30 },
  { kelas: 'XI IPA 1', rata: 85, siswa: 31 },
  { kelas: 'XI IPS 1', rata: 75, siswa: 28 },
  { kelas: 'XII IPA',  rata: 88, siswa: 34 },
];

export default function KepsekDashboard() {
  const { user } = useAuthStore();
  const hour     = new Date().getHours();
  const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : 'Selamat Sore';
  const hari     = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 🎓
          </h1>
          <p className="text-[11px] sm:text-xs mt-1 font-medium" style={{ color: 'var(--color-muted)' }}>{hari}</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm"
             style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', color: 'var(--color-text)' }}>
          <School size={14} style={{ color: 'var(--color-brand)' }} />
          SMA N 1 Contoh
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background: 'var(--color-success-soft)', color: 'var(--color-success-dark)' }}>
            Akreditasi A
          </span>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ id, label, value, change, trend, icon: Icon }) => (
          <div key={id} id={id}
               className="rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand-dark)' }}>
                <Icon size={18} />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{
                      background: trend === 'up' ? 'var(--color-success-soft)' : 'var(--color-danger-soft)',
                      color:      trend === 'up' ? 'var(--color-success-dark)' : 'var(--color-danger-dark)',
                    }}>
                {trend === 'up' ? <TrendingUp size={10} /> : null}
                {change.split(' ')[0]}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--color-text)' }}>{value}</p>
            <p className="text-[11px] mt-0.5 font-semibold" style={{ color: 'var(--color-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* ── Akademik Stats ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {akademikStats.map(({ label, value, icon: Icon, color }) => (
          <div key={label}
               className="rounded-2xl p-4 shadow-sm flex items-center gap-3 hover:-translate-y-0.5 transition-all"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background: 'var(--color-section)', color }}>
              <Icon size={16} />
            </div>
            <div>
              <p className="text-xl font-black" style={{ color: 'var(--color-text)' }}>{value}</p>
              <p className="text-[10px] font-semibold" style={{ color: 'var(--color-muted)' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Left: Aktivitas + Perhatian */}
        <div className="xl:col-span-2 space-y-4">

          {/* Perhatian Kepala Sekolah */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5 flex items-center justify-between"
                 style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Perlu Perhatian</h3>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--color-danger-soft)', color: 'var(--color-danger-dark)' }}>
                {perhatianItems.filter(i => i.severity !== 'success').length} item
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--color-section)' }}>
              {perhatianItems.map(item => {
                const colorMap = {
                  danger:  { icon: 'var(--color-danger)',  bg: 'var(--color-danger-soft)',  label: 'Kritis' },
                  warning: { icon: 'var(--color-warning)', bg: 'var(--color-warning-soft)', label: 'Perhatian' },
                  success: { icon: 'var(--color-success)', bg: 'var(--color-success-soft)', label: 'Info' },
                };
                const c = colorMap[item.severity as keyof typeof colorMap];
                return (
                  <div key={item.id} className="flex items-start gap-3.5 px-5 py-3 transition-colors"
                       onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-section)')}
                       onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <item.ikon size={14} className="flex-shrink-0 mt-0.5" style={{ color: c.icon }} />
                    <p className="flex-1 text-[12px] font-medium" style={{ color: 'var(--color-text)' }}>{item.teks}</p>
                    <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: c.bg, color: c.icon }}>{c.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aktivitas Terkini */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5 flex items-center justify-between"
                 style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Aktivitas Terkini</h3>
              <button className="flex items-center gap-1 text-[11px] font-bold hover:opacity-70"
                      style={{ color: 'var(--color-brand)' }}>
                Lihat Semua <ArrowRight size={12} />
              </button>
            </div>
            <div>
              {aktivitas.map(({ id, teks, waktu, color }, idx) => (
                <div key={id} className="flex items-start gap-3.5 px-5 py-3"
                     style={{ borderBottom: idx < aktivitas.length - 1 ? '0.5px solid var(--color-section)' : 'none' }}>
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium" style={{ color: 'var(--color-text)' }}>{teks}</p>
                    <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: 'var(--color-muted)' }}>
                      <Clock size={10} /> {waktu}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">

          {/* Kehadiran Hari Ini */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Kehadiran Hari Ini</h3>
            </div>
            <div className="px-5 py-4 space-y-3.5">
              {kehadiran.map(({ label, count, total, color }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--color-muted)' }}>{label}</span>
                    <span className="text-[11px] font-bold" style={{ color: 'var(--color-text)' }}>
                      {count} <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>/ {total}</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-section)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / total) * 100}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keuangan */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5 flex items-center gap-2"
                 style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <Wallet size={13} style={{ color: 'var(--color-brand)' }} />
              <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Keuangan Sekolah</h3>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--color-section)' }}>
              {keuanganRingkasan.map(k => (
                <div key={k.label} className="px-5 py-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {k.ok
                      ? <CheckCircle2 size={13} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                      : <AlertCircle  size={13} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />}
                    <p className="text-[11px] font-medium" style={{ color: 'var(--color-text)' }}>{k.label}</p>
                  </div>
                  <span className="text-[11px] font-bold flex-shrink-0" style={{ color: 'var(--color-brand)' }}>{k.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nilai per Kelas */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Rata Nilai per Kelas</h3>
            </div>
            <div className="px-5 py-4 space-y-3">
              {nilaiPerKelas.map(k => {
                const color = k.rata >= 82 ? 'var(--color-success)' : k.rata >= 75 ? 'var(--color-warning)' : 'var(--color-danger)';
                return (
                  <div key={k.kelas} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[11px] font-semibold" style={{ color: 'var(--color-text)' }}>{k.kelas}</span>
                      <span className="text-[11px] font-bold" style={{ color }}>{k.rata}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-section)' }}>
                      <div className="h-full rounded-full" style={{ width: `${k.rata}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
