'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight, BookOpen, Users, BarChart3 } from 'lucide-react';
import { authApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/stores/auth.store';
import { ROLE_DASHBOARD_PATH, UserRole } from '@/types/enums';
import { extractApiError, cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});
type LoginFormData = z.infer<typeof loginSchema>;

const features = [
  { icon: BookOpen, label: 'LMS & E-Learning', desc: 'Materi, tugas & ujian online' },
  { icon: Users,    label: 'Manajemen Terpusat', desc: 'Siswa, guru & kelas dalam satu sistem' },
  { icon: BarChart3, label: 'Laporan Real-time', desc: 'Nilai, kehadiran & keuangan' },
];

const demoAccounts = [
  { role: 'Admin',  email: 'admin@sims.app',  password: 'Admin@1234' },
  { role: 'Kepsek', email: 'kepsek@sims.app', password: 'Demo@1234' },
  { role: 'Guru',   email: 'guru@sims.app',   password: 'Demo@1234' },
  { role: 'Siswa',  email: 'siswa@sims.app',  password: 'Demo@1234' },
  { role: 'Ortu',   email: 'ortu@sims.app',   password: 'Demo@1234' },
];

export default function LoginForm() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError]   = useState('');
  const [isLoading, setIsLoading]       = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError('');
    try {
      const res = await authApi.login(data);
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      router.push(ROLE_DASHBOARD_PATH[user.role as UserRole] || '/admin/dashboard');
    } catch (err) {
      setServerError(extractApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (email: string, password: string) => {
    setValue('email',    email,    { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-page)' }}>

      {/* ── Left Panel — Brand (desktop) ──────────────────── */}
      <div
        className="hidden lg:flex flex-col w-[420px] flex-shrink-0 relative overflow-hidden p-10"
        style={{ background: 'var(--color-brand)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20"
             style={{ background: 'var(--color-accent)' }} />
        <div className="absolute bottom-16 -left-14 w-44 h-44 rounded-full opacity-15"
             style={{ background: '#0C447C' }} />
        <div className="absolute bottom-48 right-8 w-16 h-16 rounded-full opacity-20"
             style={{ background: 'var(--color-accent)' }} />

        {/* School Brand */}
        <div className="relative z-10 flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0 overflow-hidden">
            <Image src="/school-logo.png" alt="Logo" width={40} height={40} className="object-contain" />
          </div>
          <div>
            <p className="text-white font-black text-sm leading-tight">SMA Negeri 1 Contoh</p>
            <p className="text-white/70 text-xs">Sistem Informasi Sekolah</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 flex-1">
          <h1 className="text-3xl font-extrabold text-white leading-snug tracking-tight mb-2">
            Platform Digital<br />Sekolah Modern
          </h1>
          <p className="text-white/75 text-sm leading-relaxed mb-7">
            Kelola akademik dan administrasi sekolah secara efisien dalam satu platform terpadu.
          </p>

          {/* Features */}
          <div className="space-y-2.5">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label}
                   className="flex items-center gap-3 rounded-2xl p-3"
                   style={{ background: 'rgba(255,255,255,0.12)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ background: 'rgba(255,255,255,0.18)' }}>
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">{label}</p>
                  <p className="text-white/65 text-[11px]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-8 pt-5 mt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          {[{ v: '6', l: 'Tipe Pengguna' }, { v: '9+', l: 'Modul Fitur' }, { v: '100%', l: 'Data Aman' }].map(s => (
            <div key={s.l}>
              <p className="text-xl font-black text-white">{s.v}</p>
              <p className="text-white/60 text-[11px]">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel — Form ───────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-10 overflow-y-auto">

        {/* Mobile: Logo */}
        <div className="lg:hidden flex flex-col items-center gap-2 mb-6">
          <div className="w-14 h-14 bg-white rounded-2xl shadow border flex items-center justify-center overflow-hidden"
               style={{ borderColor: 'var(--color-border)' }}>
            <Image src="/school-logo.png" alt="Logo" width={46} height={46} className="object-contain" />
          </div>
          <div className="text-center">
            <p className="font-black text-sm" style={{ color: 'var(--color-text)' }}>SMA Negeri 1 Contoh</p>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Sistem Informasi Sekolah</p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-[360px] animate-fadeIn">
          <div className="bg-white rounded-3xl p-7 shadow-sm"
               style={{ border: '0.5px solid var(--color-border)' }}>

            {/* Header */}
            <div className="mb-5">
              <h2 className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
                Masuk ke Akun
              </h2>
              <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                Gunakan email dan password yang terdaftar
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold mb-1.5"
                       style={{ color: 'var(--color-text)' }}>
                  Email
                </label>
                <input
                  id="email" type="email" autoComplete="email"
                  placeholder="contoh@sekolah.id"
                  className={cn(
                    'w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all duration-150',
                    errors.email ? 'border-[var(--color-danger)]' : ''
                  )}
                  style={{
                    background:   errors.email ? 'var(--color-danger-soft)' : '#F7F7F5',
                    border:       `0.5px solid ${errors.email ? 'var(--color-danger)' : 'var(--color-border)'}`,
                    color:        'var(--color-text)',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = 'var(--color-brand)';
                    e.currentTarget.style.boxShadow   = '0 0 0 3px var(--color-brand-soft)';
                    e.currentTarget.style.background  = '#fff';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = errors.email ? 'var(--color-danger)' : 'var(--color-border)';
                    e.currentTarget.style.boxShadow   = 'none';
                    e.currentTarget.style.background  = errors.email ? 'var(--color-danger-soft)' : '#F7F7F5';
                  }}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="flex items-center gap-1 text-[11px] mt-1"
                     style={{ color: 'var(--color-danger)' }}>
                    <AlertCircle size={11} /> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold"
                         style={{ color: 'var(--color-text)' }}>
                    Password
                  </label>
                  <a href="/forgot-password" className="text-[11px] font-medium transition-colors hover:opacity-80"
                     style={{ color: 'var(--color-brand)' }}>
                    Lupa password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm outline-none transition-all duration-150"
                    style={{
                      background:   errors.password ? 'var(--color-danger-soft)' : '#F7F7F5',
                      border:       `0.5px solid ${errors.password ? 'var(--color-danger)' : 'var(--color-border)'}`,
                      color:        'var(--color-text)',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'var(--color-brand)';
                      e.currentTarget.style.boxShadow   = '0 0 0 3px var(--color-brand-soft)';
                      e.currentTarget.style.background  = '#fff';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = errors.password ? 'var(--color-danger)' : 'var(--color-border)';
                      e.currentTarget.style.boxShadow   = 'none';
                      e.currentTarget.style.background  = errors.password ? 'var(--color-danger-soft)' : '#F7F7F5';
                    }}
                    {...register('password')}
                  />
                  <button type="button"
                          onClick={() => setShowPassword(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:opacity-80"
                          style={{ color: 'var(--color-muted)' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1 text-[11px] mt-1"
                     style={{ color: 'var(--color-danger)' }}>
                    <AlertCircle size={11} /> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Server error */}
              {serverError && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl"
                     style={{ background: 'var(--color-danger-soft)', border: '0.5px solid var(--color-danger)' }}>
                  <AlertCircle size={14} className="flex-shrink-0" style={{ color: 'var(--color-danger)' }} />
                  <p className="text-xs" style={{ color: 'var(--color-danger-dark)' }}>{serverError}</p>
                </div>
              )}

              {/* Submit — satu tombol utama per layar */}
              <button
                type="submit" id="btn-login" disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 mt-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background:  isLoading ? 'var(--color-brand-hover)' : 'var(--color-brand)',
                  boxShadow:   '0 2px 12px rgba(55,138,221,0.25)',
                }}
                onMouseEnter={e => !isLoading && (e.currentTarget.style.background = 'var(--color-brand-hover)')}
                onMouseLeave={e => !isLoading && (e.currentTarget.style.background = 'var(--color-brand)')}
              >
                {isLoading
                  ? <><Loader2 size={15} className="spin" /> Masuk...</>
                  : <>Masuk Sekarang <ArrowRight size={15} /></>
                }
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-4">
              <p className="text-center text-[11px] mb-2.5 font-medium"
                 style={{ color: 'var(--color-muted)' }}>
                ── Demo Akun (klik untuk isi otomatis) ──
              </p>
              <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                {demoAccounts.slice(0, 3).map(acc => (
                  <button key={acc.role} type="button"
                          onClick={() => fillDemo(acc.email, acc.password)}
                          className="py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 active:scale-95"
                          style={{
                            background:  'var(--color-brand-soft)',
                            color:       'var(--color-brand-dark)',
                            border:      '0.5px solid rgba(55,138,221,0.2)',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#d5e9f8'}
                          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-brand-soft)'}>
                    {acc.role}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {demoAccounts.slice(3).map(acc => (
                  <button key={acc.role} type="button"
                          onClick={() => fillDemo(acc.email, acc.password)}
                          className="py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 active:scale-95"
                          style={{
                            background:  'var(--color-brand-soft)',
                            color:       'var(--color-brand-dark)',
                            border:      '0.5px solid rgba(55,138,221,0.2)',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#d5e9f8'}
                          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-brand-soft)'}>
                    {acc.role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] mt-4" style={{ color: 'var(--color-muted)' }}>
            © {new Date().getFullYear()} SIMS · SMA Negeri 1 Contoh
          </p>
        </div>
      </div>
    </div>
  );
}
