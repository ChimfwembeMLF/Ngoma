import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { TrackPage } from './pages/TrackPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ArtistDashboardPage } from './pages/ArtistDashboardPage';
import { ArtistProfilePage } from './pages/ArtistProfilePage';
import { ArtistSettingsPage } from './pages/ArtistSettingsPage';
import { TipArtistPage } from './pages/TipArtistPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { PlaylistDetailPage } from './pages/PlaylistDetailPage';
import { PurchaseHistoryPage } from './pages/PurchaseHistoryPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminOverviewPage } from './pages/AdminOverviewPage';
import { AdminThemePage } from './pages/AdminThemePage';
import { AdminBrandingPage } from './pages/AdminBrandingPage';
import { AdminPayoutsPage } from './pages/AdminPayoutsPage';
import { AdminAdsPage } from './pages/AdminAdsPage';
import { VideoPage } from './pages/VideoPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { ThemeProvider } from './providers/ThemeProvider';
import { ColorModeProvider } from './providers/ColorModeProvider';
import { BrandingProvider } from './providers/BrandingProvider';
import { PlayerProvider } from './providers/PlayerProvider';
import { TekremCallbackPage } from './pages/auth/TekremCallbackPage';
import { MarketingLayout } from './pages/marketing/MarketingLayout';
import { PromotionDashboardPage } from './pages/marketing/PromotionDashboardPage';
import { RoiAnalyticsPage } from './pages/marketing/RoiAnalyticsPage';
import { FanCrmPage } from './pages/marketing/FanCrmPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeProvider>
        <ThemeProvider>
          <BrandingProvider>
            <PlayerProvider>
              <BrowserRouter>
                <Routes>
          <Route path="/" element={<Navigate to="/discover" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<TekremCallbackPage />} />
          <Route
            path="/marketing"
            element={
              <ProtectedRoute>
                <MarketingLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="promotions" replace />} />
            <Route path="promotions" element={<PromotionDashboardPage />} />
            <Route path="analytics/roi" element={<RoiAnalyticsPage />} />
            <Route path="fans/segments" element={<FanCrmPage />} />
            <Route path="crm" element={<FanCrmPage />} />
          </Route>
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPolicyPage />} />
          <Route path="/tracks/:id" element={<TrackPage />} />
          <Route path="/videos/:id" element={<VideoPage />} />
          <Route path="/playlists/share/:slug" element={<PlaylistDetailPage />} />
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <PlaylistsPage />
              </ProtectedRoute>
            }
          />
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
            path="/artist/settings"
            element={
              <ProtectedRoute>
                <ArtistSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tip/:artistId"
            element={
              <ProtectedRoute>
                <TipArtistPage />
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
            path="/admin"
            element={
              <AdminRoute>
                <AdminOverviewPage />
              </AdminRoute>
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
          <Route
            path="/admin/branding"
            element={
              <AdminRoute>
                <AdminBrandingPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/payouts"
            element={
              <AdminRoute>
                <AdminPayoutsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/ads"
            element={
              <AdminRoute>
                <AdminAdsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/theme"
            element={
              <AdminRoute>
                <AdminThemePage />
              </AdminRoute>
            }
          />
        </Routes>
        </BrowserRouter>
        </PlayerProvider>
          </BrandingProvider>
        </ThemeProvider>
      </ColorModeProvider>
    </QueryClientProvider>
  );
}
