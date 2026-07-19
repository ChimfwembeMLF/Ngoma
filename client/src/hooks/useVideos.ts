import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api-client';
import { getAccessToken } from '../lib/auth-storage';

export type Video = {
  id: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  duration?: number | null;
  artistId?: string;
  artistName?: string;
  isPublished?: boolean;
  isDraft?: boolean;
  views?: number;
  createdAt?: string;
};

type VideosResponse = { success: boolean; data: Video[] };
type VideoResponse = { success: boolean; data: Video };

export function useMyVideos() {
  return useQuery({
    queryKey: ['videos', 'mine'],
    queryFn: () => apiFetch<VideosResponse>('/api/v1/videos/mine'),
  });
}

export function useRecentVideos() {
  return useQuery({
    queryKey: ['discovery', 'videos', 'recent'],
    queryFn: () =>
      apiFetch<VideosResponse>('/api/v1/discovery/videos/recent'),
  });
}

export function useArtistVideos(artistId: string | undefined) {
  return useQuery({
    queryKey: ['videos', 'artist', artistId],
    queryFn: () => apiFetch<VideosResponse>(`/api/v1/artists/${artistId}/videos`),
    enabled: !!artistId,
  });
}

export function useVideo(id: string) {
  return useQuery({
    queryKey: ['videos', id],
    queryFn: () => apiFetch<VideoResponse>(`/api/v1/videos/${id}`),
    enabled: !!id,
  });
}

export function useCreateVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { title: string; description?: string }) =>
      apiFetch<VideoResponse>('/api/v1/videos', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['videos'] }),
  });
}

export function useUpdateVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      title?: string;
      description?: string;
      isPublished?: boolean;
    }) =>
      apiFetch(`/api/v1/videos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['videos'] });
      qc.invalidateQueries({ queryKey: ['discovery', 'videos'] });
    },
  });
}

export function useDeleteVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/v1/videos/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['videos'] });
      qc.invalidateQueries({ queryKey: ['discovery', 'videos'] });
    },
  });
}

export function useUploadVideoFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      video,
      thumbnail,
      duration,
    }: {
      id: string;
      video?: File;
      thumbnail?: File;
      duration?: number;
    }) => {
      const form = new FormData();
      if (video) form.append('video', video);
      if (thumbnail) form.append('thumbnail', thumbnail);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const token = getAccessToken();
      const headers = new Headers();
      if (token) headers.set('Authorization', `Bearer ${token}`);
      if (duration != null && Number.isFinite(duration)) {
        headers.set('x-video-duration', String(Math.round(duration)));
      }
      const res = await fetch(`${baseUrl}/api/v1/videos/${id}/upload`, {
        method: 'POST',
        headers,
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || `Upload failed (${res.status})`);
      }
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['videos'] }),
  });
}
