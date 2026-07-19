import { Navigate } from 'react-router-dom';
import { DesignSystemLayout } from './layout/DesignSystemLayout';
import { useAuth } from '../hooks/useAuth';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { meQuery } = useAuth();

  if (meQuery.isLoading) {
    return (
      <DesignSystemLayout>
        <div className="p-8 text-center text-muted">Loading…</div>
      </DesignSystemLayout>
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
