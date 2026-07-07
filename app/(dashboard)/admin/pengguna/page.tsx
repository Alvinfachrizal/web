import type { Metadata } from 'next';
import PenggunaPage from '@/components/modules/admin/PenggunaPage';

export const metadata: Metadata = { title: 'Manajemen Pengguna' };

export default function Page() {
  return <PenggunaPage />;
}
