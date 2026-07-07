'use client';

import {
  GraduationCap, Star, ClipboardCheck, Wallet,
  Bell, Phone, MessageCircle, ChevronRight,
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2,
  Clock,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

// ── Mock Data ────────────────────────────────────────────────
const dataAnak = {
  nama:   'Andi Pratama',
  kelas:  'X IPA 1',
  nisn:   '0087654321',
  wali:   'Bpk. Hendra P.',
};

const absensiRingkasan = [
  { label: 'Hadir', count: 68, color: 'var(--color-success)', soft: 'var(--color-success-soft)', dark: 'var(--color-success-dark)' },
  { label: 'Izin',  count: 3,  color: 'var(--color-info)',    soft: 'var(--color-info-soft)',    dark: 'var(--color-info-dark)' },
  { label: 'Sakit', count: 2,  color: 'var(--color-warning)', soft: 'var(--color-warning-soft)', dark: 'var(--color-warning-dark)' },
  { label: 'Alfa',  count: 1,  color: 'var(--color-danger)',  soft: 'var(--color-danger-soft)',  dark: 'var(--color-danger-dark)' },
];

const nilaiMapel = [
  { id: 1, mapel: 'Matematika',     nilai: 85, trend: 'up' },
  { id: 2, mapel: 'Bahasa Inggris', nilai: 79, trend: 'down' },
  { id: 3, mapel: 'Fisika',         nilai: 88, trend: 'up' },
  { id: 4, mapel: 'Sejarah',        nilai: 76, trend: 'down' },
  { id: 5, mapel: 'Kimia',          nilai: 82, trend: 'up' },
];

const keuangan = [
  { id: 1, jenis: 'SPP Juli 2026',  status: 'lunas',  nominal: 'Rp 250.000', tgl: '5 Jul 2026' },
  { id: 2, jenis: 'SPP Juni 2026',  status: 'lunas',  nominal: 'Rp 250.000', tgl: '3 Jun 2026' },
  { id: 3, jenis: 'SPP Agst 2026',  status: 'belum',  nominal: 'Rp 250.000', tgl: 'Jatuh tempo 5 Agt' },
];

const pengumuman = [
  { id: 1, teks: 'UTS Semester Ganjil mulai 21 Juli 2026',   waktu: '1 jam lalu',  penting: true },
  { id: 2, teks: 'Laporan perkembangan siswa tersedia',       waktu: '2 hari lalu', penting: false },
  { id: 3, teks: 'Pertemuan wali murid – 18 Juli 2026',      waktu: '3 hari lalu', penting: true },
];

const absensiTerkini = [
  { id: 1, tgl: 'Senin, 7 Jul',   status: 'hadir' },
  { id: 2, tgl: 'Selasa, 8 Jul',  status: 'hadir' },
  { id: 3, tgl: 'Rabu, 9 Jul',    status: 'sakit' },
  { id: 4, tgl: 'Kamis, 10 Jul',  status: 'hadir' },
  { id: 5, tgl: "Jum'at, 11 Jul", status: 'hadir' },
];

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; bg: string; color: string }> = {
    hadir: { label: 'Hadir', bg: 'var(--color-success-soft)', color: 'var(--color-success-dark)' },
    sakit: { label: 'Sakit', bg: 'var(--color-warning-soft)', color: 'var(--color-warning-dark)' },
    izin:  { label: 'Izin',  bg: 'var(--color-info-soft)',    color: 'var(--color-info-dark)' },
    alfa:  { label: 'Alfa',  bg: 'var(--color-danger-soft)',  color: 'var(--color-danger-dark)' },
  };
  const c = cfg[status] ?? cfg.hadir;
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

export default function OrtuDashboard() {
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
            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👪
          </h1>
          <p className="text-[11px] sm:text-xs mt-1 font-medium" style={{ color: 'var(--color-muted)' }}>{hari}</p>
        </div>
        <div className="flex items-center gap-2">
          <button id="btn-hubungi-guru"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                  style={{ background: 'var(--color-brand)', color: '#fff' }}>
            <MessageCircle size={13} /> Hubungi Guru
          </button>
          <button id="btn-call-sekolah"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                  style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', color: 'var(--color-text)' }}>
            <Phone size={13} style={{ color: 'var(--color-brand)' }} /> Kontak Sekolah
          </button>
        </div>
      </div>

      {/* ── Profil Anak ─────────────────────────────────────── */}
      <div className="rounded-2xl p-4 sm:p-5 shadow-sm"
           style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0"
               style={{ background: 'linear-gradient(135deg, var(--color-brand), var(--color-accent))' }}>
            {dataAnak.nama.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-extrabold" style={{ color: 'var(--color-text)' }}>{dataAnak.nama}</h2>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
              {dataAnak.kelas} · NISN {dataAnak.nisn}
            </p>
          </div>
          <div className="text-right flex-shrink-0 hidden sm:block">
            <p className="text-[10px]" style={{ color: 'var(--color-muted)' }}>Wali Kelas</p>
            <p className="text-[12px] font-bold" style={{ color: 'var(--color-text)' }}>{dataAnak.wali}</p>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: 'kehadiran', label: 'Kehadiran',  value: '91.8%', sub: '68/74 hari hadir',    icon: ClipboardCheck, color: 'var(--color-success)' },
          { id: 'rata-nilai', label: 'Rata Nilai', value: '82.0',  sub: '5 mata pelajaran',    icon: Star,           color: 'var(--color-warning)' },
          { id: 'tagihan',   label: 'Tagihan SPP', value: '1',     sub: 'belum dibayar',       icon: Wallet,         color: 'var(--color-danger)' },
          { id: 'pesan',     label: 'Pesan Guru',  value: '2',     sub: 'pesan belum dibaca',  icon: MessageCircle,  color: 'var(--color-info)' },
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

        {/* Absensi + Nilai */}
        <div className="xl:col-span-2 space-y-4">

          {/* Absensi Terkini */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5 flex items-center justify-between"
                 style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Clock size={13} style={{ color: 'var(--color-brand)' }} />
                <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Absensi 5 Hari Terakhir</h3>
              </div>
              <div className="flex gap-2">
                {absensiRingkasan.map(a => (
                  <div key={a.label} className="text-center">
                    <div className="text-[11px] font-black" style={{ color: a.color }}>{a.count}</div>
                    <div className="text-[9px]" style={{ color: 'var(--color-muted)' }}>{a.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--color-section)' }}>
              {absensiTerkini.map(a => (
                <div key={a.id} className="flex items-center justify-between px-5 py-3 transition-colors"
                     onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-section)')}
                     onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span className="text-[12px] font-medium" style={{ color: 'var(--color-text)' }}>{a.tgl}</span>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Nilai */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5 flex items-center justify-between"
                 style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Star size={13} style={{ color: 'var(--color-warning)' }} />
                <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Nilai UTS Terbaru</h3>
              </div>
              <button className="flex items-center gap-1 text-[11px] font-bold hover:opacity-70"
                      style={{ color: 'var(--color-brand)' }}>
                Detail <ChevronRight size={12} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3.5">
              {nilaiMapel.map(n => (
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

        {/* Right Column */}
        <div className="space-y-4">

          {/* Keuangan */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5 flex items-center gap-2"
                 style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <Wallet size={13} style={{ color: 'var(--color-brand)' }} />
              <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Tagihan SPP</h3>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--color-section)' }}>
              {keuangan.map(k => (
                <div key={k.id} className="px-5 py-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold" style={{ color: 'var(--color-text)' }}>{k.jenis}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                      {k.nominal} · {k.tgl}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: k.status === 'lunas' ? 'var(--color-success-soft)' : 'var(--color-danger-soft)',
                          color:      k.status === 'lunas' ? 'var(--color-success-dark)' : 'var(--color-danger-dark)',
                        }}>
                    {k.status === 'lunas' ? '✓ Lunas' : '! Belum'}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3" style={{ borderTop: '0.5px solid var(--color-border)' }}>
              <button id="btn-bayar-spp"
                      className="w-full py-2.5 rounded-xl font-bold text-[12px] text-white transition-all hover:opacity-90"
                      style={{ background: 'var(--color-brand)' }}>
                Bayar SPP Sekarang
              </button>
            </div>
          </div>

          {/* Pengumuman */}
          <div className="rounded-2xl shadow-sm overflow-hidden"
               style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}>
            <div className="px-5 py-3.5 flex items-center gap-2"
                 style={{ borderBottom: '0.5px solid var(--color-border)' }}>
              <Bell size={13} style={{ color: 'var(--color-warning)' }} />
              <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>Pengumuman Sekolah</h3>
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

    </div>
  );
}
