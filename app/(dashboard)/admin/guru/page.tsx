import type { Metadata } from 'next';
import GuruPage from '@/components/modules/admin/GuruPage';

export const metadata: Metadata = { title: 'Data Guru' };

export default function Page() {
  return <GuruPage />;
}
