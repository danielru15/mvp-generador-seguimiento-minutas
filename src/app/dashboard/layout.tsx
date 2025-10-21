import DashboardLayout from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/auth';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

