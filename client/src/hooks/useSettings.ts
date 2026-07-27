import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, apiUpload } from '../lib/api-client';

export function useUpdateUserAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { fullName?: string; email?: string; password?: string; avatarUrl?: string }) =>
      apiFetch('/api/v1/user/me', {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useUpdateArtistProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { artistName?: string; bio?: string; coverImageUrl?: string }) =>
      apiFetch('/api/v1/artists/profile', {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      const res = await apiUpload<{ data: { url: string } }>('/api/v1/media/upload', form);
      return res.data.url;
    },
  });
}
