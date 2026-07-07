'use client';

import {
  BookOpen, Users, ClipboardCheck, Star,
  Clock, ChevronRight, Bell, Calendar,
  TrendingUp, CheckCircle2, AlertCircle, FileText,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

// ── Mock Data ────────────────────────────────────────────────
const jadwalHariIni = [
  { id: 1, jam: '07.30 – 09.00', mapel: 'Matematika', kelas: 'X IPA 1', ruang: 'R. 01', status: 'selesai' },
  { id: 2, jam: '09.15 – 10.45', mapel: 'Matematika', kelas: 'X IPA 2', ruang: 'R. 03', status: 'berlangsung' },
  { id: 3, jam: '11.00 – 12.30', mapel: 'Matematika', kelas: 'XI IPS 1', ruang: 'R. 07', status: 'akan-datang' },
  { id: 4, jam: '13.30 – 15.00', mapel: 'Matematika', kelas: 'XI IPS 2', ruang: 'R. 08', status: 'akan-datang' },
];

const kelasDiampu = [
  { id: 1, nama: 'X IPA 1',  siswa: 32, rata: 82.4 },
  { id: 2, nama: 'X IPA 2',  siswa: 30, rata: 79.8 },
  { id: 3, nama: 'XI IPS 1', siswa: 28, rata: 75.2 },
  { id: 4, nama: 'XI IPS 2', siswa: 31, rata: 77.6 },
];

const pengumuman = [
  { id: 1, teks: 'Rapat guru mingguan – Senin 14.00', waktu: '1 jam lalu',  penting: true },
  { id: 2, teks: 'Deadline input nilai UTS: 12 Juli 2026', waktu: '3 jam lalu', penting: true },
  { id: 3, teks: 'Pelatihan digitalisasi kelas – 15 Juli', waktu: 'Kemarin',    penting: false },
];

const tugasBelumDinilai = [
  { id: 1, judul: 'PR Bab 3 – Fungsi Kuadrat',  kelas: 'X IPA 1',  jumlah: 8  },
  { id: 2, judul: 'Kuis Integral',               kelas: 'XI IPS 1', jumlah: 12 },
];

// ── Status Badge ─────────────────────────────────────────────
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

export default function GuruDashboard() {
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
            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-[11px] sm:text-xs mt-1 font-medium" style={{ color: 'var(--color-muted)' }}>{hari}</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm"
             style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', color: 'var(--color-text)' }}>
          <BookOpen size={14} style={{ color: 'var(--color-brand)' }} />
          Matematika
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background: 'var(--color-success-soft)', color: 'var(--color-success-dark)' }}>
            Guru Mapel
          </span>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: 'kelas',    label: 'Kelas Diampu',   value: '4',    sub: 'kelas aktif',    icon: Users,         color: 'var(--color-brand)' },
          { id: 'siswa',    label: 'Total Siswa',     value: '121',  sub: 'siswa',          icon: BookOpen,      color: 'var(--color-success)' },
          { id: 'jadwal',   label: 'Jam Hari Ini',    value: '4',    sub: 'sesi mengajar',  icon: Clock,         color: 'var(--color-info)' },
          { id: 'tugas',    label: 'Tugas Dinilai',   value: '20',   sub: 'perlu diperiksa', icon: ClipboardCheck, color: 'var(--color-warning)' },
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
            <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>
              Jadwal Mengajar Hari Ini
            </h3>
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
                  <div className="flex-shrink-0 w-16 text-center">
                    <p className="text-[10px] font-bold" style={{ color: 'var(--color-brand)' }}>
                      {j.jam.split(' – ')[0]}
                    </p>
                    <p className="text-[9px]" style={{ color: 'var(--color-muted)' }}>
                      s/d {j.jam.split(' – ')[1]}
                    </p>
                  </div>
                  <div className="w-px h-8 flex-shrink-0" style={{ background: 'var(--color-border)' }} />
                  <div>
                    <p className="text-[12px] font-bold" style={{ color: 'var(--color-text)' }}>{j.mapel}</p>
                    <p className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                      {j.kelas} · {j.ruang}
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

          {/* Pengumuman */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5 flex items-center gap-2"
                 style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <Bell size={14} style={{ color: 'var(--color-brand)' }} />
              <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Pengumuman</h3>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--color-section)' }}>
              {pengumuman.map(p => (
                <div key={p.id} className="px-5 py-3 flex items-start gap-2.5">
                  {p.penting
                    ? <AlertCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-warning)' }} />
                    : <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-muted)' }} />}
                  <div>
                    <p className="text-[11px] font-semibold leading-relaxed" style={{ color: 'var(--color-text)' }}>{p.teks}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>{p.waktu}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tugas Belum Dinilai */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5 flex items-center gap-2"
                 style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <FileText size={14} style={{ color: 'var(--color-danger)' }} />
              <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Tugas Perlu Diperiksa</h3>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--color-section)' }}>
              {tugasBelumDinilai.map(t => (
                <div key={t.id} className="px-5 py-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold" style={{ color: 'var(--color-text)' }}>{t.judul}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>{t.kelas}</p>
                  </div>
                  <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--color-danger-soft)', color: 'var(--color-danger-dark)' }}>
                    {t.jumlah} siswa
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Kelas yang Diampu ───────────────────────────────── */}
      <div>
        <h2 className="font-bold text-[13px] mb-2.5" style={{ color: 'var(--color-text)' }}>Kelas yang Diampu</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kelasDiampu.map(k => (
            <div key={k.id}
                 className="rounded-2xl p-4 shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                 style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                     style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}>
                  <Users size={16} />
                </div>
                <ChevronRight size={14} style={{ color: 'var(--color-muted)' }} />
              </div>
              <p className="font-extrabold text-[14px]" style={{ color: 'var(--color-text)' }}>{k.nama}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted)' }}>{k.siswa} siswa</p>
              <div className="mt-2 flex items-center gap-1.5">
                <TrendingUp size={11} style={{ color: 'var(--color-success)' }} />
                <span className="text-[10px] font-bold" style={{ color: 'var(--color-success-dark)' }}>
                  Rata-rata {k.rata}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
