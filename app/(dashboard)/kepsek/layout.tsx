import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/types/enums';

export default function KepsekGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout allowedRoles={[UserRole.KEPALA_SEKOLAH]}>
      {children}
    </DashboardLayout>
  );
}
