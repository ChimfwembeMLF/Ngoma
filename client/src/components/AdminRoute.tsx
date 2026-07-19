import { Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/hooks/useAuth';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { meQuery } = useAuth();

  if (meQuery.isLoading) {
    return (
      <AppShell>
        <div className="p-8 text-center text-muted-foreground">Loading…</div>
      </AppShell>
    );
  }
  if (meQuery.isError) {
    return <Navigate to="/auth" replace />;
  }
  if (meQuery.data?.data.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
