import type { Metadata } from 'next';
import SiswaDashboard from '@/components/modules/siswa/SiswaDashboard';

export const metadata: Metadata = { title: 'Dashboard Siswa' };

export default function SiswaDashboardPage() {
  return <SiswaDashboard />;
}
