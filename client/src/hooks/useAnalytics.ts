import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api-client';

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

type DashboardResponse = {
  success: boolean;
  data: {
    summary: AnalyticsSummary;
    topTracks: TrackAnalyticsRow[];
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

export function useAnalyticsDashboard() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => apiFetch<DashboardResponse>('/api/v1/analytics/dashboard'),
  });
}

export function useEarningsTimeline(days = 30) {
  return useQuery({
    queryKey: ['analytics', 'timeline', days],
    queryFn: () =>
      apiFetch<TimelineResponse>(`/api/v1/analytics/earnings/timeline?days=${days}`),
  });
}
