import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch, apiUpload } from '@/lib/api-client';

export type AdsConfig = {
  adsEnabled: boolean;
  gateSeconds: number;
  googleAdsEnabled: boolean;
};

export type AdCreative = {
  id: string;
  title: string;
  imageUrl: string;
  clickUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AdSessionStart = {
  sessionId: string;
  gateSeconds: number;
  creative: {
    id: string;
    title: string;
    imageUrl: string;
    clickUrl?: string;
  };
};

export function useAdsConfig() {
  return useQuery({
    queryKey: ['ads', 'config'],
    queryFn: () =>
      apiFetch<{ success: boolean; data: AdsConfig }>('/api/v1/platform/ads/config'),
    staleTime: 60_000,
  });
}

export function useStartAdSession() {
  return useMutation({
    mutationFn: (trackId: string) =>
      apiFetch<{ success: boolean; data: AdSessionStart }>(
        `/api/v1/tracks/${trackId}/ad-session`,
        { method: 'POST' },
      ),
  });
}

export function useCompleteAdSession() {
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiFetch<{ success: boolean; data: { sessionId: string; status: string } }>(
        `/api/v1/ad-sessions/${sessionId}/complete`,
        { method: 'POST' },
      ),
  });
}

export function useAdminAdsConfig() {
  return useQuery({
    queryKey: ['admin', 'ads', 'config'],
    queryFn: () =>
      apiFetch<{ success: boolean; data: AdsConfig }>('/api/v1/admin/ads/config'),
  });
}

export function useAdminCreatives() {
  return useQuery({
    queryKey: ['admin', 'ads', 'creatives'],
    queryFn: () =>
      apiFetch<{ success: boolean; data: AdCreative[] }>('/api/v1/admin/ads/creatives'),
  });
}

export function useCreateCreative() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      title: string;
      imageUrl: string;
      clickUrl?: string;
      isActive?: boolean;
      sortOrder?: number;
    }) =>
      apiFetch<{ success: boolean; data: AdCreative }>('/api/v1/admin/ads/creatives', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'ads', 'creatives'] }),
  });
}

export function useUpdateCreative() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<AdCreative>) =>
      apiFetch<{ success: boolean; data: AdCreative }>(`/api/v1/admin/ads/creatives/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'ads', 'creatives'] }),
  });
}

export function useDeleteCreative() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/v1/admin/ads/creatives/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'ads', 'creatives'] }),
  });
}

export function useUpdateAdsConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<AdsConfig>) =>
      apiFetch<{ success: boolean; data: AdsConfig }>('/api/v1/admin/ads/config', {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'ads', 'config'] });
      qc.invalidateQueries({ queryKey: ['ads', 'config'] });
    },
  });
}

export function useUploadAdImage() {
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append('file', file);
      return apiUpload<{ success: boolean; data: { url: string } }>(
        '/api/v1/media/upload',
        form,
      );
    },
  });
}
