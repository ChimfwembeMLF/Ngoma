import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api-client';
import type { PaymentCountryOption } from '@/components/payments/MobileMoneyForm';

type PaymentOptions = {
  success: boolean;
  data: {
    countries: PaymentCountryOption[];
    defaultCountryId: string;
  };
};

export type PaymentConfig = {
  pawapayEnabled: boolean;
  environment: string;
  webhookUrl: string;
  webhookUrlConfigured?: boolean;
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
      operatorId: string;
      countryId: string;
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
    refetchInterval: (query) => {
      const status = query.state.data?.data.status;
      if (status === 'COMPLETED' || status === 'FAILED') return false;
      return 3000;
    },
  });
}

type PaymentHistoryItem = {
  id: string;
  amount: string | number;
  currency: string;
  status: string;
  purpose?: string;
  itemId?: string;
  provider?: string;
  providerDisplayName?: string;
  createdAt?: string;
  completedAt?: string | null;
  errorMessage?: string | null;
};

export function usePaymentHistory(options?: { limit?: number; offset?: number }) {
  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;

  return useQuery({
    queryKey: ['payments', 'history', limit, offset],
    queryFn: () =>
      apiFetch<{ success: boolean; data: PaymentHistoryItem[]; pagination?: { total: number; limit: number; offset: number } }>(
        `/api/v1/payments/history?limit=${limit}&offset=${offset}`,
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
