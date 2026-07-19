import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch, apiUpload } from '../lib/api-client';

export type PricingType = 'SET_PRICE' | 'PAY_WHAT_YOU_WANT' | 'FREE';

export type Track = {
  id: string;
  title: string;
  genre: string;
  description?: string;
  pricingType: PricingType;
  price?: number | null;
  minPrice?: number | null;
  coverArtUrl?: string;
  audioFileUrl?: string;
  isPublished?: boolean;
  isDraft?: boolean;
  artistId?: string;
  artistName?: string;
};

type TracksResponse = { success: boolean; data: Track[] };

export function useMyTracks() {
  return useQuery({
    queryKey: ['tracks', 'mine'],
    queryFn: () => apiFetch<TracksResponse>('/api/v1/tracks/mine'),
  });
}

export function useCreateTrack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      title: string;
      genre: string;
      pricingType: PricingType;
      price?: number;
      minPrice?: number;
      description?: string;
    }) =>
      apiFetch<{ success: boolean; data: Track }>('/api/v1/tracks', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tracks'] }),
  });
}

export function useUpdateTrack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      isPublished?: boolean;
      price?: number;
      minPrice?: number;
      pricingType?: PricingType;
    }) =>
      apiFetch(`/api/v1/tracks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tracks'] }),
  });
}

export function useUploadTrackFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, audio, coverArt }: { id: string; audio?: File; coverArt?: File }) => {
      const form = new FormData();
      if (audio) form.append('audio', audio);
      if (coverArt) form.append('coverArt', coverArt);
      return apiUpload(`/api/v1/tracks/${id}/upload`, form);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tracks'] }),
  });
}

export function useTrack(id: string) {
  return useQuery({
    queryKey: ['track', id],
    queryFn: () => apiFetch<{ success: boolean; data: Track }>(`/api/v1/tracks/${id}`),
    enabled: !!id,
  });
}

export function useTracks(params?: { search?: string; genre?: string }) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set('search', params.search);
  if (params?.genre) qs.set('genre', params.genre);
  const query = qs.toString();

  return useQuery({
    queryKey: ['tracks', 'published', params],
    queryFn: () =>
      apiFetch<{ success: boolean; data: Track[]; pagination?: { total: number } }>(
        `/api/v1/tracks${query ? `?${query}` : ''}`,
      ),
  });
}
