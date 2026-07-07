'use client';

import {
  GraduationCap, Calendar, Star, ClipboardCheck,
  Bell, Clock, ChevronRight, BookOpen,
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

// ── Mock Data ────────────────────────────────────────────────
const jadwalHariIni = [
  { id: 1, jam: '07.30', mapel: 'Matematika',  guru: 'Bpk. Agus S.',   ruang: 'R. 01', status: 'selesai' },
  { id: 2, jam: '09.15', mapel: 'Bahasa Inggris', guru: 'Ibu. Dewi R.', ruang: 'R. 03', status: 'berlangsung' },
  { id: 3, jam: '11.00', mapel: 'Fisika',      guru: 'Bpk. Hendra W.', ruang: 'Lab. IPA', status: 'akan-datang' },
  { id: 4, jam: '13.30', mapel: 'Sejarah',     guru: 'Ibu. Siti N.',   ruang: 'R. 07', status: 'akan-datang' },
];

const nilaiRaport = [
  { id: 1, mapel: 'Matematika',     nilai: 85, trend: 'up' },
  { id: 2, mapel: 'Bahasa Inggris', nilai: 79, trend: 'down' },
  { id: 3, mapel: 'Fisika',         nilai: 88, trend: 'up' },
  { id: 4, mapel: 'Sejarah',        nilai: 76, trend: 'down' },
  { id: 5, mapel: 'Kimia',          nilai: 82, trend: 'up' },
];

const absensiRingkasan = [
  { label: 'Hadir', count: 68, color: 'var(--color-success)', soft: 'var(--color-success-soft)', dark: 'var(--color-success-dark)' },
  { label: 'Izin',  count: 3,  color: 'var(--color-info)',    soft: 'var(--color-info-soft)',    dark: 'var(--color-info-dark)' },
  { label: 'Sakit', count: 2,  color: 'var(--color-warning)', soft: 'var(--color-warning-soft)', dark: 'var(--color-warning-dark)' },
  { label: 'Alfa',  count: 1,  color: 'var(--color-danger)',  soft: 'var(--color-danger-soft)',  dark: 'var(--color-danger-dark)' },
];

const pengumuman = [
  { id: 1, teks: 'UTS Semester Ganjil mulai 21 Juli 2026',    waktu: '1 jam lalu',  penting: true },
  { id: 2, teks: 'Pengumpulan tugas Bahasa Inggris – besok',  waktu: '3 jam lalu',  penting: true },
  { id: 3, teks: 'Ekskul Robotika dibuka pendaftaran baru',   waktu: 'Kemarin',     penting: false },
];

function JadwalBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; bg: string; color: string }> = {
    selesai:       { label: 'Selesai',     bg: 'var(--color-section)',      color: 'var(--color-muted)' },
    berlangsung:   { label: 'Berlangsung', bg: 'var(--color-success-soft)', color: 'var(--color-success-dark)' },
    'akan-datang': { label: 'Akan Datang', bg: 'var(--color-info-soft)',    color: 'var(--color-info-dark)' },
  };
  const c = cfg[status] ?? cfg['akan-datang'];
  return (
    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

function NilaiBar({ nilai }: { nilai: number }) {
  const color = nilai >= 80 ? 'var(--color-success)' : nilai >= 70 ? 'var(--color-warning)' : 'var(--color-danger)';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-section)' }}>
        <div className="h-full rounded-full" style={{ width: `${nilai}%`, background: color }} />
      </div>
      <span className="text-[11px] font-bold w-6 text-right" style={{ color: 'var(--color-text)' }}>{nilai}</span>
    </div>
  );
}

export default function SiswaDashboard() {
  const { user } = useAuthStore();
  const hour     = new Date().getHours();
  const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : 'Selamat Sore';
  const hari     = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const total    = absensiRingkasan.reduce((a, b) => a + b.count, 0);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 📚
          </h1>
          <p className="text-[11px] sm:text-xs mt-1 font-medium" style={{ color: 'var(--color-muted)' }}>{hari}</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm"
             style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', color: 'var(--color-text)' }}>
          <GraduationCap size={14} style={{ color: 'var(--color-brand)' }} />
          X IPA 1
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand-dark)' }}>
            2025/2026 Ganjil
          </span>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: 'kehadiran', label: 'Kehadiran',  value: '91.8%', sub: '68 hadir / 74 hari', icon: ClipboardCheck, color: 'var(--color-success)' },
          { id: 'rata-nilai', label: 'Rata Nilai', value: '82.0',  sub: '5 mata pelajaran',   icon: Star,           color: 'var(--color-warning)' },
          { id: 'jadwal',    label: 'Jam Hari Ini', value: '4',   sub: 'sesi belajar',        icon: Calendar,       color: 'var(--color-info)' },
          { id: 'tugas',     label: 'Tugas Aktif', value: '3',    sub: 'perlu dikumpulkan',   icon: BookOpen,       color: 'var(--color-danger)' },
        ].map(({ id, label, value, sub, icon: Icon, color }) => (
          <div key={id} id={id}
               className="rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: 'var(--color-brand-soft)', color }}>
                <Icon size={18} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--color-text)' }}>{value}</p>
            <p className="text-[11px] mt-0.5 font-semibold" style={{ color: 'var(--color-muted)' }}>{label}</p>
            <p className="text-[10px]" style={{ color: 'var(--color-muted)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Jadwal Hari Ini */}
        <div className="xl:col-span-2 rounded-2xl shadow-sm overflow-hidden"
             style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
          <div className="px-5 py-3.5 flex items-center justify-between"
               style={{ borderBottom: '0.5px solid var(--color-border)' }}>
            <div className="flex items-center gap-2">
              <Clock size={14} style={{ color: 'var(--color-brand)' }} />
              <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Jadwal Belajar Hari Ini</h3>
            </div>
            <button className="flex items-center gap-1 text-[11px] font-bold hover:opacity-70"
                    style={{ color: 'var(--color-brand)' }}>
              Lihat Semua <ChevronRight size={12} />
            </button>
          </div>
          <div>
            {jadwalHariIni.map((j, idx) => (
              <div key={j.id}
                   className="flex items-center justify-between px-5 py-3.5 gap-4 flex-wrap transition-colors"
                   style={{ borderBottom: idx < jadwalHariIni.length - 1 ? '0.5px solid var(--color-section)' : 'none' }}
                   onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-section)')}
                   onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0 text-center w-12">
                    <p className="text-[11px] font-black" style={{ color: 'var(--color-brand)' }}>{j.jam}</p>
                  </div>
                  <div className="w-px h-8 flex-shrink-0" style={{ background: 'var(--color-border)' }} />
                  <div>
                    <p className="text-[12px] font-bold" style={{ color: 'var(--color-text)' }}>{j.mapel}</p>
                    <p className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                      {j.guru} · {j.ruang}
                    </p>
                  </div>
                </div>
                <JadwalBadge status={j.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">

          {/* Absensi Ringkasan */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Rekap Absensi</h3>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>Semester Ganjil 2025/2026</p>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 gap-3">
              {absensiRingkasan.map(a => (
                <div key={a.label} className="rounded-xl p-3 text-center"
                     style={{ background: a.soft }}>
                  <p className="text-xl font-black" style={{ color: a.color }}>{a.count}</p>
                  <p className="text-[10px] font-semibold mt-0.5" style={{ color: a.dark }}>{a.label}</p>
                  <p className="text-[9px]" style={{ color: a.dark, opacity: 0.7 }}>
                    {Math.round(a.count / total * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pengumuman */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5 flex items-center gap-2"
                 style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <Bell size={13} style={{ color: 'var(--color-warning)' }} />
              <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Pengumuman</h3>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--color-section)' }}>
              {pengumuman.map(p => (
                <div key={p.id} className="px-5 py-3 flex items-start gap-2">
                  {p.penting
                    ? <AlertCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-danger)' }} />
                    : <CheckCircle2 size={12} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-muted)' }} />}
                  <div>
                    <p className="text-[11px] font-semibold leading-relaxed" style={{ color: 'var(--color-text)' }}>{p.teks}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>{p.waktu}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Nilai Terakhir ──────────────────────────────────── */}
      <div className="rounded-2xl shadow-sm overflow-hidden"
           style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
        <div className="px-5 py-3.5 flex items-center justify-between"
             style={{ borderBottom: '0.5px solid var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <Star size={14} style={{ color: 'var(--color-warning)' }} />
            <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Nilai UTS Terakhir</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand-dark)' }}>
            Semester Ganjil
          </span>
        </div>
        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nilaiRaport.map(n => (
            <div key={n.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold" style={{ color: 'var(--color-text)' }}>{n.mapel}</span>
                <div className="flex items-center gap-1">
                  {n.trend === 'up'
                    ? <TrendingUp size={10} style={{ color: 'var(--color-success)' }} />
                    : <TrendingDown size={10} style={{ color: 'var(--color-danger)' }} />}
                </div>
              </div>
              <NilaiBar nilai={n.nilai} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
