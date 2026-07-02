import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Dashboard Orang Tua' };
export default function OrtuDashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Dashboard <span style={{ background: 'linear-gradient(135deg,hsl(234 89% 56%),hsl(280 65% 60%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Orang Tua</span></h1>
      <p style={{ color: 'hsl(var(--color-text-muted))' }}>Modul orang tua akan segera tersedia.</p>
    </div>
  );
}
