import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { ThemePresetMeta } from '@/lib/theme-presets';
import type { ThemeTokens } from '@/lib/theme-defaults';

export type ThemeResponse = {
  success: boolean;
  data: {
    theme: ThemeTokens;
    activePresetId: string;
    presets: ThemePresetMeta[];
    overrides: Partial<ThemeTokens>;
    defaults: ThemeTokens;
    updatedAt?: string;
  };
};

export function useAdminTheme() {
  return useQuery({
    queryKey: ['admin', 'theme'],
    queryFn: () => apiFetch<ThemeResponse>('/api/v1/admin/settings/theme'),
  });
}

export function useApplyThemePreset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (presetId: string) =>
      apiFetch<ThemeResponse>('/api/v1/admin/settings/theme/preset', {
        method: 'PUT',
        body: JSON.stringify({ presetId }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'theme'] });
      qc.invalidateQueries({ queryKey: ['platform', 'theme'] });
    },
  });
}

export function useUpdateAdminTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { theme?: Partial<ThemeTokens>; presetId?: string }) =>
      apiFetch<ThemeResponse>('/api/v1/admin/settings/theme', {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'theme'] });
      qc.invalidateQueries({ queryKey: ['platform', 'theme'] });
    },
  });
}

export function useResetAdminTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch<ThemeResponse>('/api/v1/admin/settings/theme/reset', { method: 'POST' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'theme'] });
      qc.invalidateQueries({ queryKey: ['platform', 'theme'] });
    },
  });
}
