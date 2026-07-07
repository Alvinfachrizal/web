import type { Metadata } from 'next';
import GuruDashboard from '@/components/modules/guru/GuruDashboard';

export const metadata: Metadata = { title: 'Dashboard Guru' };

export default function GuruDashboardPage() {
  return <GuruDashboard />;
}
