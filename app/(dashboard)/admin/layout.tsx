import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/types/enums';

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout allowedRoles={[UserRole.ADMIN, UserRole.KEPALA_SEKOLAH, UserRole.SUPER_ADMIN]}>
      {children}
    </DashboardLayout>
  );
}
