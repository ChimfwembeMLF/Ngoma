import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api-client';

export type DiscoveryTrack = {
  id: string;
  title: string;
  artistName?: string;
  artistId?: string;
  coverArtUrl?: string;
  price?: number | null;
  minPrice?: number | null;
  pricingType: string;
  genre: string;
  duration: number;
};

export function useTrending() {
  return useQuery({
    queryKey: ['discovery', 'trending'],
    queryFn: () =>
      apiFetch<{ success: boolean; data: DiscoveryTrack[] }>('/api/v1/discovery/trending'),
  });
}

export function useNewReleases() {
  return useQuery({
    queryKey: ['discovery', 'new-releases'],
    queryFn: () =>
      apiFetch<{ success: boolean; data: DiscoveryTrack[] }>(
        '/api/v1/discovery/new-releases',
      ),
  });
}

export function useSearch(q: string) {
  return useQuery({
    queryKey: ['discovery', 'search', q],
    queryFn: () =>
      apiFetch<{ success: boolean; data: DiscoveryTrack[] }>(
        `/api/v1/discovery/search?q=${encodeURIComponent(q)}`,
      ),
    enabled: q.length >= 2,
  });
}
