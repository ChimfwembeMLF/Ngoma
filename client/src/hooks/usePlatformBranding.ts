import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { BrandingConfig } from '@/lib/branding-defaults';
import { DEFAULT_BRANDING } from '@/lib/branding-defaults';

type BrandingResponse = {
  success: boolean;
  data: BrandingConfig & { updatedAt?: string };
};

export function usePlatformBranding() {
  return useQuery({
    queryKey: ['platform', 'branding'],
    queryFn: () => apiFetch<BrandingResponse>('/api/v1/platform/branding'),
    staleTime: 60_000,
  });
}

export function selectBranding(data: BrandingResponse | undefined): BrandingConfig {
  if (!data?.data) return DEFAULT_BRANDING;
  const { updatedAt: _, ...branding } = data.data;
  return { ...DEFAULT_BRANDING, ...branding, background: { ...DEFAULT_BRANDING.background, ...data.data.background } };
}
