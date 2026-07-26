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
      let videoUrl, thumbnailUrl;

      if (video) {
        const ext = video.name.split('.').pop() || 'mp4';
        const { data: presigned } = await apiFetch<{ data: { uploadUrl: string; publicUrl: string; storagePath: string } }>(
          `/api/v1/videos/${id}/presigned-url`,
          {
            method: 'POST',
            body: JSON.stringify({
              fileType: 'video',
              extension: ext,
              contentType: video.type,
            }),
          }
        );
        
        const uploadRes = await fetch(presigned.uploadUrl, {
          method: 'PUT',
          body: video,
          headers: { 'Content-Type': video.type },
        });
        if (!uploadRes.ok) throw new Error('Direct video upload failed');
        videoUrl = presigned.publicUrl;
      }

      if (thumbnail) {
        const ext = thumbnail.name.split('.').pop() || 'jpg';
        const { data: presigned } = await apiFetch<{ data: { uploadUrl: string; publicUrl: string; storagePath: string } }>(
          `/api/v1/videos/${id}/presigned-url`,
          {
            method: 'POST',
            body: JSON.stringify({
              fileType: 'cover',
              extension: ext,
              contentType: thumbnail.type,
            }),
          }
        );

        const uploadRes = await fetch(presigned.uploadUrl, {
          method: 'PUT',
          body: thumbnail,
          headers: { 'Content-Type': thumbnail.type },
        });
        if (!uploadRes.ok) throw new Error('Direct thumbnail upload failed');
        thumbnailUrl = presigned.publicUrl;
      }

      return apiFetch(`/api/v1/videos/${id}/confirm-upload`, {
        method: 'POST',
        body: JSON.stringify({ videoUrl, thumbnailUrl, duration }),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['videos'] }),
  });
}
