import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { meQuery } = useAuth();

  if (meQuery.isLoading) {
    return <div className="p-8 text-center text-cream">Loading...</div>;
  }
  if (meQuery.isError) {
    return <Navigate to="/auth" replace />;
  }
  if (meQuery.data?.data.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
