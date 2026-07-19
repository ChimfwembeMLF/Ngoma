import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api-client';
import type { MetricTrend } from '@/components/dashboard/TrendBadge';
import type { ActivityItem } from '@/components/dashboard/ActivityFeed';

export type AnalyticsSummary = {
  totalNetEarnings: number;
  totalPlatformFees: number;
  totalPlays: number;
  totalDownloads: number;
  publishedTrackCount: number;
  uniqueSupporters: number;
  currency: string;
};

export type TrackAnalyticsRow = {
  trackId: string;
  title: string;
  plays: number;
  downloads: number;
  netEarnings: number;
  pricingType: string;
};

export type TipsSummary = {
  totalAmount: number;
  count: number;
  currency: string;
};

export type ArtistTrends = {
  netEarnings: MetricTrend;
  plays: MetricTrend;
  downloads: MetricTrend;
};

type DashboardResponse = {
  success: boolean;
  data: {
    summary: AnalyticsSummary;
    topTracks: TrackAnalyticsRow[];
    trends?: ArtistTrends;
    tips?: TipsSummary;
  };
};

export type EarningsTimelineBucket = {
  date: string;
  netEarnings: number;
};

type TimelineResponse = {
  success: boolean;
  data: {
    days: number;
    totalNetEarnings: number;
    buckets: EarningsTimelineBucket[];
  };
};

export function useAnalyticsDashboard(enabled = true) {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => apiFetch<DashboardResponse>('/api/v1/analytics/dashboard'),
    enabled,
  });
}

export function useEarningsTimeline(days = 30) {
  return useQuery({
    queryKey: ['analytics', 'timeline', days],
    queryFn: () =>
      apiFetch<TimelineResponse>(`/api/v1/analytics/earnings/timeline?days=${days}`),
  });
}

export type AdminDashboardData = {
  kpis: {
    totalUsers: number;
    totalTracks: number;
    activeArtists: number;
    platformFees: number;
    completedTransactions: number;
    currency: string;
  };
  trends: {
    users: MetricTrend;
    tracks: MetricTrend;
    platformFees: MetricTrend;
  };
  revenueTimeline: {
    days: number;
    buckets: { date: string; platformFees: number }[];
  };
  recentActivity: ActivityItem[];
  paymentHealth?: {
    environment: string;
    webhookConfigured: boolean;
    enabledCountries: number;
    pendingPayouts: number;
  };
};

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () =>
      apiFetch<{ success: boolean; data: AdminDashboardData }>('/api/v1/admin/dashboard'),
  });
}
