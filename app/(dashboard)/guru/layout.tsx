import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/types/enums';

export default function GuruGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout allowedRoles={[UserRole.GURU]}>
      {children}
    </DashboardLayout>
  );
}
