import type { Metadata } from 'next';
import KepsekDashboard from '@/components/modules/kepsek/KepsekDashboard';

export const metadata: Metadata = { title: 'Dashboard Kepala Sekolah' };

export default function KepsekDashboardPage() {
  return <KepsekDashboard />;
}
