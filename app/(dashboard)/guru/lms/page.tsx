import type { Metadata } from 'next';
import LmsPage from '@/components/modules/lms/LmsPage';

export const metadata: Metadata = { title: 'Materi & LMS' };

export default function Page() {
  return <LmsPage />;
}
