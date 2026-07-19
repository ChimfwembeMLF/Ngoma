import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api-client';

export type PayoutItem = {
  id: string;
  artistId: string;
  amount: string;
  currency: string;
  status: string;
  paymentMethod: string | null;
  phone: string | null;
  errorMessage: string | null;
  requestedAt: string;
  processedAt: string | null;
  artistName?: string | null;
};

export function usePayoutBalance() {
  return useQuery({
    queryKey: ['payouts', 'balance'],
    queryFn: () =>
      apiFetch<{
        success: boolean;
        data: { available: number; currency: string; minimumPayout: number };
      }>('/api/v1/payouts/balance'),
  });
}

export function usePayoutList(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return useQuery({
    queryKey: ['payouts', 'list', status ?? 'all'],
    queryFn: () =>
      apiFetch<{
        success: boolean;
        data: { items: PayoutItem[]; total: number };
      }>(`/api/v1/payouts${query}`),
  });
}

export function useAdminPayoutList(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return useQuery({
    queryKey: ['admin', 'payouts', status ?? 'all'],
    queryFn: () =>
      apiFetch<{ success: boolean; data: PayoutItem[] }>(
        `/api/v1/admin/payouts${query}`,
      ),
  });
}

export function useRequestPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      amount: number;
      phone: string;
      operatorId: string;
      countryId?: string;
    }) =>
      apiFetch<{ success: boolean; data: PayoutItem }>('/api/v1/payouts/request', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payouts'] });
    },
  });
}

export function useProcessPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      action,
      note,
    }: {
      id: string;
      action: 'approve' | 'reject';
      note?: string;
    }) =>
      apiFetch<{ success: boolean; data: PayoutItem }>(`/api/v1/admin/payouts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ action, note }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'payouts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['payouts'] });
    },
  });
}
