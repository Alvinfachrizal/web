import type { Metadata } from 'next';
import PengumumanPage from '@/components/modules/communication/PengumumanPage';

export const metadata: Metadata = { title: 'Pengumuman' };

export default function Page() {
  return <PengumumanPage />;
}
