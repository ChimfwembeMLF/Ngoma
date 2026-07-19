import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api-client';

type PaymentOptions = {
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    currency: string;
    providers: Array<{ code: string; label: string }>;
  }>;
};

export type PaymentConfig = {
  pawapayEnabled: boolean;
  environment: string;
  webhookUrl: string;
  devAutoComplete: boolean;
  baseUrl: string | null;
};

export function usePaymentConfig() {
  return useQuery({
    queryKey: ['payments', 'config'],
    queryFn: () =>
      apiFetch<{ success: boolean; data: PaymentConfig }>('/api/v1/payments/config'),
  });
}

export function usePaymentOptions() {
  return useQuery({
    queryKey: ['payments', 'options'],
    queryFn: () => apiFetch<PaymentOptions>('/api/v1/payments/mobile-money/options'),
  });
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (body: {
      amount: number;
      currency?: string;
      provider: string;
      purpose: 'TRACK_DOWNLOAD';
      itemId: string;
      phone?: string;
    }) =>
      apiFetch<{
        success: boolean;
        data: { depositId: string; paymentId: string; status: string; message: string };
      }>('/api/v1/payments/deposit', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  });
}

export function usePaymentStatus(depositId?: string, enabled = false) {
  return useQuery({
    queryKey: ['payments', 'status', depositId],
    queryFn: () =>
      apiFetch<{
        success: boolean;
        data: {
          status: string;
          depositId: string;
          paymentId: string;
          completedAt?: string | null;
          errorMessage?: string | null;
        };
      }>(`/api/v1/payments/status/${depositId}`),
    enabled: enabled && !!depositId,
    refetchInterval: enabled ? 3000 : false,
  });
}

type PaymentHistoryItem = {
  id: string;
  amount: string | number;
  currency: string;
  status: string;
  purpose?: string;
  itemId?: string;
  createdAt?: string;
  completedAt?: string | null;
  errorMessage?: string | null;
};

export function usePaymentHistory() {
  return useQuery({
    queryKey: ['payments', 'history'],
    queryFn: () =>
      apiFetch<{ success: boolean; data: PaymentHistoryItem[]; pagination?: unknown }>(
        '/api/v1/payments/history',
      ),
  });
}

export function useUpdateArtistProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      artistName?: string;
      bio?: string;
      genres?: string[];
    }) =>
      apiFetch('/api/v1/artists/profile', {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
  });
}
