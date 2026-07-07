import type { Metadata } from 'next';
import TahunAjaranPage from '@/components/modules/admin/TahunAjaranPage';

export const metadata: Metadata = { title: 'Tahun Ajaran' };

export default function Page() {
  return <TahunAjaranPage />;
}
