import type { Metadata } from 'next';
import OrtuDashboard from '@/components/modules/ortu/OrtuDashboard';

export const metadata: Metadata = { title: 'Dashboard Orang Tua' };

export default function OrtuDashboardPage() {
  return <OrtuDashboard />;
}
