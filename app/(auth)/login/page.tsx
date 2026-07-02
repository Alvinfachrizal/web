import type { Metadata } from 'next';
import LoginForm from '@/components/modules/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Masuk ke SIMS — Sistem Informasi Manajemen Sekolah',
};

export default function LoginPage() {
  return <LoginForm />;
}
