import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api-client';

export type PlaylistSummary = {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  trackCount: number;
  coverArtUrl: string | null;
  createdAt: string;
};

export type CuratedPlaylistSummary = {
  id: string;
  name: string;
  shareSlug: string | null;
  trackCount: number;
  coverArtUrl: string | null;
  isCurated: true;
};

export type PlaylistTrackItem = {
  trackId: string;
  title: string;
  artistName: string;
  duration: number;
  coverArtUrl: string | null;
  position: number;
};

export type PlaylistDetail = {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  isCurated: boolean;
  shareSlug: string | null;
  isOwner: boolean;
  tracks: PlaylistTrackItem[];
};

export type ShareLinkPayload = {
  shareSlug: string;
  shareUrl: string;
};

export function buildShareUrl(shareSlug: string) {
  return `${window.location.origin}/playlists/share/${shareSlug}`;
}

export function useMyPlaylists(enabled = true) {
  return useQuery({
    queryKey: ['playlists', 'mine'],
    queryFn: () =>
      apiFetch<{ success: boolean; data: PlaylistSummary[] }>('/api/v1/playlists/mine'),
    enabled,
  });
}

export function useCuratedPlaylists() {
  return useQuery({
    queryKey: ['playlists', 'curated'],
    queryFn: () =>
      apiFetch<{ success: boolean; data: CuratedPlaylistSummary[] }>(
        '/api/v1/playlists/curated',
      ),
  });
}

export function usePlaylist(id: string) {
  return useQuery({
    queryKey: ['playlists', id],
    queryFn: () =>
      apiFetch<{ success: boolean; data: PlaylistDetail }>(`/api/v1/playlists/${id}`),
    enabled: !!id,
  });
}

export function usePlaylistBySlug(slug: string) {
  return useQuery({
    queryKey: ['playlists', 'share', slug],
    queryFn: () =>
      apiFetch<{ success: boolean; data: PlaylistDetail }>(
        `/api/v1/playlists/share/${slug}`,
      ),
    enabled: !!slug,
  });
}

export function useEnsureShareLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playlistId: string) =>
      apiFetch<{ success: boolean; data: ShareLinkPayload }>(
        `/api/v1/playlists/${playlistId}/share`,
        { method: 'POST' },
      ),
    onSuccess: (_data, playlistId) => {
      queryClient.invalidateQueries({ queryKey: ['playlists', playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlists', 'share'] });
    },
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; description?: string; isPublic?: boolean }) =>
      apiFetch<{ success: boolean; data: { id: string } }>('/api/v1/playlists', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', 'mine'] });
    },
  });
}

export function useUpdatePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      name?: string;
      description?: string;
      isPublic?: boolean;
    }) =>
      apiFetch(`/api/v1/playlists/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlists', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['playlists', variables.id] });
    },
  });
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/v1/playlists/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', 'mine'] });
    },
  });
}

export function useAddTrackToPlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, trackId }: { playlistId: string; trackId: string }) =>
      apiFetch(`/api/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        body: JSON.stringify({ trackId }),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlists', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['playlists', variables.playlistId] });
    },
  });
}

export function useRemoveTrackFromPlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, trackId }: { playlistId: string; trackId: string }) =>
      apiFetch(`/api/v1/playlists/${playlistId}/tracks/${trackId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlists', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['playlists', variables.playlistId] });
    },
  });
}
