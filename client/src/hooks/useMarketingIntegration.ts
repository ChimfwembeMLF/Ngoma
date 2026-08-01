import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error occurred' }));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
}

export function usePromotedCampaigns() {
  return useQuery({
    queryKey: ['marketing', 'campaigns'],
    queryFn: () => fetchWithAuth('/marketing/promotions'),
  });
}

export function usePromoteRelease() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { releaseId: string; targetGenre: string; customCaption?: string }) =>
      fetchWithAuth('/marketing/promotions/prefill', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing', 'campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['marketing', 'roi'] });
    },
  });
}

export function useRoiAnalytics(params?: { releaseId?: string; campaignId?: string }) {
  const query = new URLSearchParams();
  if (params?.releaseId) query.set('releaseId', params.releaseId);
  if (params?.campaignId) query.set('campaignId', params.campaignId);
  
  return useQuery({
    queryKey: ['marketing', 'roi', params],
    queryFn: () => fetchWithAuth(`/marketing/analytics/roi?${query.toString()}`),
  });
}

export function useFanSegments(params?: { genre?: string; tier?: string }) {
  const query = new URLSearchParams();
  if (params?.genre) query.set('genre', params.genre);
  if (params?.tier) query.set('tier', params.tier);

  return useQuery({
    queryKey: ['marketing', 'fans', params],
    queryFn: () => fetchWithAuth(`/marketing/fans/segments?${query.toString()}`),
  });
}

export function useCreateSmartLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { releaseId: string; campaignId: string; customSlug?: string }) =>
      fetchWithAuth('/marketing/smart-links', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing', 'campaigns'] });
    },
  });
}
