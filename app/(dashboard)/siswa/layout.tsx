import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/types/enums';

export default function SiswaGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout allowedRoles={[UserRole.SISWA]}>
      {children}
    </DashboardLayout>
  );
}
