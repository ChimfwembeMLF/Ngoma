import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { TrackPage } from './pages/TrackPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ArtistDashboardPage } from './pages/ArtistDashboardPage';
import { ArtistProfilePage } from './pages/ArtistProfilePage';
import { PurchaseHistoryPage } from './pages/PurchaseHistoryPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/discover" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/tracks/:id" element={<TrackPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artist/dashboard"
            element={
              <ProtectedRoute>
                <ArtistDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artist/profile"
            element={
              <ProtectedRoute>
                <ArtistProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/:trackId"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchases"
            element={
              <ProtectedRoute>
                <PurchaseHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
