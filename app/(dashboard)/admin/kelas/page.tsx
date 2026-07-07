import type { Metadata } from 'next';
import KelasPage from '@/components/modules/admin/KelasPage';

export const metadata: Metadata = { title: 'Kelas & Mata Pelajaran' };

export default function Page() {
  return <KelasPage />;
}
