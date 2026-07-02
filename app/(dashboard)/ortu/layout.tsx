import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/types/enums';

export default function OrtuGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout allowedRoles={[UserRole.ORTU]}>
      {children}
    </DashboardLayout>
  );
}
