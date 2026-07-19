import { useMutation, useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api-client';

type TipResponse = {
  success: boolean;
  data: {
    depositId: string;
    paymentId: string;
    status: string;
    message: string;
  };
};

export type ReceivedTip = {
  id: string;
  amount: number;
  message: string | null;
  trackId: string | null;
  trackTitle: string | null;
  tipperName: string;
  createdAt: string;
};

export function useInitiateTip() {
  return useMutation({
    mutationFn: (body: {
      artistId: string;
      amount: number;
      operatorId: string;
      countryId: string;
      phone?: string;
      message?: string;
      trackId?: string;
      currency?: string;
    }) =>
      apiFetch<TipResponse>('/api/v1/payments/tip', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  });
}

export function useTipsReceived(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ['tips', 'received', limit, offset],
    queryFn: () =>
      apiFetch<{ success: boolean; data: ReceivedTip[]; pagination: { total: number } }>(
        `/api/v1/tips/received?limit=${limit}&offset=${offset}`,
      ),
  });
}

export function useArtistPublic(artistId: string) {
  return useQuery({
    queryKey: ['artist', artistId],
    queryFn: () =>
      apiFetch<{ success: boolean; data: { id: string; artistName: string } }>(
        `/api/v1/artists/${artistId}`,
      ),
    enabled: !!artistId,
  });
}
