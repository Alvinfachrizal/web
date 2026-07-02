'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, GraduationCap, Loader2, AlertCircle, BookOpen, Users, BarChart3 } from 'lucide-react';
import { authApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/stores/auth.store';
import { ROLE_DASHBOARD_PATH, UserRole } from '@/types/enums';
import { extractApiError } from '@/lib/utils';
import { cn } from '@/lib/utils';

// ── Validation Schema ────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ── Feature list untuk info panel ────────────────────────
const features = [
  { icon: BookOpen, label: 'LMS & Materi Belajar', desc: 'Upload materi, tugas, dan ujian online' },
  { icon: Users, label: 'Manajemen Siswa & Guru', desc: 'Kelola data akademik terpusat' },
  { icon: BarChart3, label: 'Dashboard Real-time', desc: 'Pantau kehadiran, nilai, dan keuangan' },
];

// ── Demo accounts helper ──────────────────────────────────
const demoAccounts = [
  { role: 'Admin', email: 'admin@sims.app', password: 'Admin@1234' },
  { role: 'Guru', email: 'guru@sims.app', password: 'Demo@1234' },
  { role: 'Siswa', email: 'siswa@sims.app', password: 'Demo@1234' },
  { role: 'Orang Tua', email: 'ortu@sims.app', password: 'Demo@1234' },
];

export default function LoginForm() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError('');

    try {
      const response = await authApi.login(data);
      const { user, accessToken } = response.data.data;

      setAuth(user, accessToken);

      const dashboardPath = ROLE_DASHBOARD_PATH[user.role as UserRole] || '/admin/dashboard';
      router.push(dashboardPath);
    } catch (err) {
      setServerError(extractApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="login-page">
      {/* ── Background Decorations ─────────────────────── */}
      <div className="login-bg-orb login-bg-orb--1" />
      <div className="login-bg-orb login-bg-orb--2" />
      <div className="login-bg-grid" />

      <div className="login-container fade-in">
        {/* ── Left Panel — Info ─────────────────────────── */}
        <div className="login-info-panel">
          {/* Logo & Brand */}
          <div className="login-brand">
            <div className="login-brand__icon">
              <GraduationCap size={28} color="white" />
            </div>
            <div>
              <h1 className="login-brand__name">SIMS</h1>
              <p className="login-brand__tagline">Sistem Informasi Manajemen Sekolah</p>
            </div>
          </div>

          {/* Headline */}
          <div className="login-headline">
            <h2>Platform terpadu untuk<br /><span className="gradient-text">sekolah modern.</span></h2>
            <p>Kelola akademik, administrasi, dan komunikasi sekolah dalam satu platform yang terintegrasi.</p>
          </div>

          {/* Feature List */}
          <div className="login-features">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="login-feature-item">
                <div className="login-feature-item__icon">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="login-feature-item__label">{label}</p>
                  <p className="login-feature-item__desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="login-stats">
            {[
              { value: '6', label: 'Role Pengguna' },
              { value: '9+', label: 'Modul Fitur' },
              { value: '100%', label: 'Cloud-Based' },
            ].map((stat) => (
              <div key={stat.label} className="login-stat">
                <span className="login-stat__value gradient-text">{stat.value}</span>
                <span className="login-stat__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel — Form ────────────────────────── */}
        <div className="login-form-panel">
          <div className="login-form-card glass">
            <div className="login-form-header">
              <h2>Selamat Datang</h2>
              <p>Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@sekolah.id"
                  className={cn('input-field', errors.email && 'error')}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="form-error">
                    <AlertCircle size={13} />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="password" className="form-label">Password</label>
                  <a href="/forgot-password" className="form-forgot">Lupa password?</a>
                </div>
                <div className="input-password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={cn('input-field', errors.password && 'error')}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="input-password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="form-error">
                    <AlertCircle size={13} />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Server Error */}
              {serverError && (
                <div className="form-server-error" role="alert">
                  <AlertCircle size={16} />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-login"
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Masuk...
                  </>
                ) : (
                  'Masuk ke SIMS'
                )}
              </button>
            </form>

            {/* ── Demo Accounts ──────────────────────────── */}
            <div className="login-demo">
              <div className="login-demo__divider">
                <span>Demo Akun</span>
              </div>
              <div className="login-demo__grid">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.role}
                    type="button"
                    className="login-demo__btn"
                    onClick={() => fillDemo(acc.email, acc.password)}
                  >
                    {acc.role}
                  </button>
                ))}
              </div>
              <p className="login-demo__note">Klik untuk mengisi form secara otomatis</p>
            </div>
          </div>

          <p className="login-footer">
            © {new Date().getFullYear()} SIMS — Sistem Informasi Manajemen Sekolah
          </p>
        </div>
      </div>

      {/* ── Page Styles ───────────────────────────────────── */}
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, hsl(220 40% 6%) 0%, hsl(250 40% 10%) 50%, hsl(280 35% 8%) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .login-bg-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .login-bg-orb--1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, hsl(234 89% 56% / 0.20) 0%, transparent 70%);
          top: -200px; left: -100px;
        }
        .login-bg-orb--2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, hsl(280 65% 60% / 0.18) 0%, transparent 70%);
          bottom: -150px; right: -100px;
        }
        .login-bg-grid {
          position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(hsl(0 0% 100% / 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(0 0% 100% / 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .login-container {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          max-width: 960px;
          width: 100%;
          align-items: center;
        }

        /* ── Info Panel ─────────────────────────────────── */
        .login-info-panel { color: white; }

        .login-brand {
          display: flex; align-items: center; gap: 14px; margin-bottom: 48px;
        }
        .login-brand__icon {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, hsl(234 89% 56%), hsl(280 65% 60%));
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px hsl(234 89% 56% / 0.40);
          flex-shrink: 0;
        }
        .login-brand__name {
          font-size: 1.5rem; font-weight: 800; color: white; margin: 0; letter-spacing: -0.03em;
        }
        .login-brand__tagline {
          font-size: 0.8rem; color: hsl(0 0% 100% / 0.55); margin: 0;
        }

        .login-headline { margin-bottom: 40px; }
        .login-headline h2 {
          font-size: 2.25rem; font-weight: 800; color: white;
          line-height: 1.2; letter-spacing: -0.03em; margin-bottom: 16px;
        }
        .login-headline p { color: hsl(0 0% 100% / 0.60); font-size: 1rem; line-height: 1.6; }

        .login-features { display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px; }
        .login-feature-item { display: flex; align-items: flex-start; gap: 14px; }
        .login-feature-item__icon {
          width: 38px; height: 38px; flex-shrink: 0;
          background: hsl(0 0% 100% / 0.08);
          border: 1px solid hsl(0 0% 100% / 0.12);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: hsl(234 89% 78%);
        }
        .login-feature-item__label { font-weight: 600; color: white; font-size: 0.9rem; margin-bottom: 2px; }
        .login-feature-item__desc { font-size: 0.8rem; color: hsl(0 0% 100% / 0.50); }

        .login-stats {
          display: flex; gap: 32px;
          padding-top: 24px; border-top: 1px solid hsl(0 0% 100% / 0.10);
        }
        .login-stat { display: flex; flex-direction: column; gap: 2px; }
        .login-stat__value { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.03em; }
        .login-stat__label { font-size: 0.75rem; color: hsl(0 0% 100% / 0.50); }

        /* ── Form Panel ─────────────────────────────────── */
        .login-form-panel {
          display: flex; flex-direction: column; align-items: center; gap: 20px;
        }

        .login-form-card {
          width: 100%; max-width: 420px;
          border-radius: 20px;
          padding: 36px;
          background: hsl(0 0% 100% / 0.06) !important;
          border: 1px solid hsl(0 0% 100% / 0.12) !important;
          backdrop-filter: blur(24px);
        }

        .login-form-header { margin-bottom: 28px; }
        .login-form-header h2 {
          font-size: 1.5rem; font-weight: 800;
          color: white; margin-bottom: 6px; letter-spacing: -0.02em;
        }
        .login-form-header p { color: hsl(0 0% 100% / 0.55); font-size: 0.9rem; }

        .login-form { display: flex; flex-direction: column; gap: 18px; }

        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label { font-size: 0.85rem; font-weight: 600; color: hsl(0 0% 100% / 0.80); }
        .form-label-row { display: flex; justify-content: space-between; align-items: center; }
        .form-forgot { font-size: 0.82rem; color: hsl(234 89% 75%); text-decoration: none; transition: color 0.15s; }
        .form-forgot:hover { color: hsl(234 89% 85%); }

        .input-field {
          background: hsl(0 0% 100% / 0.08) !important;
          border: 1.5px solid hsl(0 0% 100% / 0.15) !important;
          color: white !important;
        }
        .input-field::placeholder { color: hsl(0 0% 100% / 0.30) !important; }
        .input-field:focus { border-color: hsl(234 89% 65%) !important; }

        .input-password-wrapper { position: relative; }
        .input-password-wrapper .input-field { padding-right: 44px; }
        .input-password-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: hsl(0 0% 100% / 0.45); display: flex; align-items: center;
          padding: 0; transition: color 0.15s;
        }
        .input-password-toggle:hover { color: hsl(0 0% 100% / 0.80); }

        .form-error {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.8rem; color: hsl(0 84% 72%); margin: 0;
        }

        .form-server-error {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 14px;
          background: hsl(0 84% 60% / 0.15);
          border: 1px solid hsl(0 84% 60% / 0.30);
          border-radius: 10px;
          color: hsl(0 84% 78%); font-size: 0.875rem;
        }

        .w-full { width: 100%; }

        /* ── Demo Accounts ──────────────────────────────── */
        .login-demo { margin-top: 20px; }
        .login-demo__divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
        }
        .login-demo__divider::before,
        .login-demo__divider::after {
          content: ''; flex: 1; height: 1px; background: hsl(0 0% 100% / 0.12);
        }
        .login-demo__divider span { font-size: 0.75rem; color: hsl(0 0% 100% / 0.40); white-space: nowrap; }

        .login-demo__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .login-demo__btn {
          padding: 8px; border-radius: 8px; font-size: 0.78rem; font-weight: 600;
          background: hsl(0 0% 100% / 0.06); border: 1px solid hsl(0 0% 100% / 0.10);
          color: hsl(0 0% 100% / 0.65); cursor: pointer; transition: all 0.15s;
        }
        .login-demo__btn:hover {
          background: hsl(234 89% 56% / 0.20); border-color: hsl(234 89% 56% / 0.40);
          color: hsl(234 89% 80%);
        }
        .login-demo__note { text-align: center; font-size: 0.72rem; color: hsl(0 0% 100% / 0.30); margin-top: 8px; }

        .login-footer { font-size: 0.78rem; color: hsl(0 0% 100% / 0.25); text-align: center; }

        /* ── Responsive ─────────────────────────────────── */
        @media (max-width: 768px) {
          .login-container {
            grid-template-columns: 1fr;
            gap: 32px;
            max-width: 420px;
          }
          .login-info-panel { display: none; }
          .login-form-panel { width: 100%; }
          .login-form-card { max-width: 100%; padding: 28px 24px; }
        }
      `}</style>
    </div>
  );
}
