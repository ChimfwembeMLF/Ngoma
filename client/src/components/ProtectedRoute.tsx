import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { meQuery } = useAuth();
  if (meQuery.isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (meQuery.isError) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}
