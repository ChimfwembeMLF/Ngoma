import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch, apiUpload } from '@/lib/api-client';
import type {
  AnimatedPresetMeta,
  BrandingConfig,
  LayoutTemplateMeta,
  SavedBrandingTemplate,
  StarterBrandingTemplate,
} from '@/lib/branding-defaults';

export type AdminBrandingResponse = {
  success: boolean;
  data: {
    branding: BrandingConfig;
    starters: StarterBrandingTemplate[];
    saved: SavedBrandingTemplate[];
    layouts: LayoutTemplateMeta[];
    animatedPresets: AnimatedPresetMeta[];
    updatedAt?: string;
  };
};

function invalidateBranding(qc: ReturnType<typeof useQueryClient>, includeTheme = false) {
  qc.invalidateQueries({ queryKey: ['admin', 'branding'] });
  qc.invalidateQueries({ queryKey: ['platform', 'branding'] });
  if (includeTheme) {
    qc.invalidateQueries({ queryKey: ['platform', 'theme'] });
    qc.invalidateQueries({ queryKey: ['admin', 'theme'] });
  }
}

export function useAdminBranding() {
  return useQuery({
    queryKey: ['admin', 'branding'],
    queryFn: () => apiFetch<AdminBrandingResponse>('/api/v1/admin/settings/branding'),
  });
}

export function useUpdateBranding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<BrandingConfig>) =>
      apiFetch<AdminBrandingResponse>('/api/v1/admin/settings/branding', {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => invalidateBranding(qc),
  });
}

export function useUploadLogo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append('file', file);
      return apiUpload<{ success: boolean; data: { logoUrl: string; branding: BrandingConfig } }>(
        '/api/v1/admin/settings/branding/logo',
        form,
      );
    },
    onSuccess: () => invalidateBranding(qc),
  });
}

export function useRemoveLogo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch<AdminBrandingResponse>('/api/v1/admin/settings/branding/logo', {
        method: 'DELETE',
      }),
    onSuccess: () => invalidateBranding(qc),
  });
}

export function useUploadBackgroundImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append('file', file);
      return apiUpload<AdminBrandingResponse>(
        '/api/v1/admin/settings/branding/background-image',
        form,
      );
    },
    onSuccess: () => invalidateBranding(qc),
  });
}

export function useApplyBrandingTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { templateId: string; source: 'starter' | 'saved' }) =>
      apiFetch('/api/v1/admin/settings/branding/templates/apply', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => invalidateBranding(qc, true),
  });
}

export function useSaveBrandingTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      apiFetch<AdminBrandingResponse>('/api/v1/admin/settings/branding/templates/save', {
        method: 'POST',
        body: JSON.stringify({ name }),
      }),
    onSuccess: () => invalidateBranding(qc),
  });
}

export function useDeleteBrandingTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<AdminBrandingResponse>(`/api/v1/admin/settings/branding/templates/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => invalidateBranding(qc),
  });
}
