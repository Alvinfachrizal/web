import type { Metadata } from 'next';
import SiswaPage from '@/components/modules/admin/SiswaPage';

export const metadata: Metadata = { title: 'Data Siswa' };

export default function Page() {
  return <SiswaPage />;
}
