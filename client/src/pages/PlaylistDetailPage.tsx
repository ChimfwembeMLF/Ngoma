import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  buildShareUrl,
  useDeletePlaylist,
  useEnsureShareLink,
  usePlaylist,
  usePlaylistBySlug,
  useRemoveTrackFromPlaylist,
  useUpdatePlaylist,
} from '@/hooks/usePlaylists';
import { AppShell } from '@/components/layout/AppShell';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDuration } from '@/lib/format-duration';

export function PlaylistDetailPage() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const byId = usePlaylist(id ?? '');
  const bySlug = usePlaylistBySlug(slug ?? '');
  const { data, isLoading, error } = slug ? bySlug : byId;
  const updatePlaylist = useUpdatePlaylist();
  const deletePlaylist = useDeletePlaylist();
  const removeTrack = useRemoveTrackFromPlaylist();
  const ensureShareLink = useEnsureShareLink();
  const [actionError, setActionError] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');

  const playlist = data?.data;
  const isEditorial = playlist?.isCurated === true;
  const canManage = playlist?.isOwner && !isEditorial;

  const resolveShareSlug = async (): Promise<string | null> => {
    if (!playlist) return null;
    if (playlist.shareSlug) return playlist.shareSlug;
    if (!playlist.isOwner) return null;
    const result = await ensureShareLink.mutateAsync(playlist.id);
    return result.data.shareSlug;
  };

  const handleCopyLink = async () => {
    if (!playlist) return;
    setActionError('');
    setCopyFeedback('');
    try {
      const shareSlug = await resolveShareSlug();
      if (!shareSlug) {
        setActionError('Share link is not available yet');
        return;
      }
      await navigator.clipboard.writeText(buildShareUrl(shareSlug));
      setCopyFeedback('Link copied');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Copy failed');
    }
  };

  const handleShare = async () => {
    if (!playlist) return;
    setActionError('');
    setCopyFeedback('');
    try {
      const shareSlug = await resolveShareSlug();
      if (!shareSlug) {
        setActionError('Share link is not available yet');
        return;
      }
      const url = buildShareUrl(shareSlug);
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: playlist.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopyFeedback('Link copied');
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setActionError(err instanceof Error ? err.message : 'Share failed');
    }
  };

  const togglePublic = async () => {
    if (!playlist) return;
    setActionError('');
    try {
      await updatePlaylist.mutateAsync({
        id: playlist.id,
        isPublic: !playlist.isPublic,
      });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (!playlist || !window.confirm('Delete this playlist?')) return;
    setActionError('');
    try {
      await deletePlaylist.mutateAsync(playlist.id);
      navigate('/playlists');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleRemoveTrack = async (trackId: string) => {
    if (!playlist) return;
    setActionError('');
    try {
      await removeTrack.mutateAsync({ playlistId: playlist.id, trackId });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Remove failed');
    }
  };

  const backLink = isEditorial ? (
    <Link
      to="/discover"
      className={buttonVariants({
        variant: 'ghost',
        className: 'px-0 text-sm text-muted-foreground hover:text-foreground',
      })}
    >
      ← Back to discover
    </Link>
  ) : (
    <Link
      to="/playlists"
      className={buttonVariants({
        variant: 'ghost',
        className: 'px-0 text-sm text-muted-foreground hover:text-foreground',
      })}
    >
      ← Back to playlists
    </Link>
  );

  if (isLoading) {
    return (
      <AppShell maxWidth="3xl">
        <p className="text-muted-foreground">Loading playlist…</p>
      </AppShell>
    );
  }

  if (error || !playlist) {
    return (
      <AppShell maxWidth="3xl">
        {backLink}
        <p className="mt-4 text-muted-foreground">
          {error instanceof Error ? error.message : 'Playlist not found'}
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell maxWidth="3xl">
      {backLink}

      <header className="mb-8 mt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[28px] font-bold text-foreground">{playlist.name}</h1>
              {isEditorial ? (
                <span className="rounded-sm bg-primary/15 px-2 py-0.5 text-xs text-primary">
                  Curated by Ngoma
                </span>
              ) : (
                <span className="rounded-sm bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {playlist.isPublic ? 'Public' : 'Private'}
                </span>
              )}
            </div>
            {playlist.description && (
              <p className="mt-2 text-muted-foreground">{playlist.description}</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground/80">
              {playlist.tracks.length}{' '}
              {playlist.tracks.length === 1 ? 'track' : 'tracks'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {playlist.isPublic && (
              <>
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  disabled={ensureShareLink.isPending}
                >
                  Copy link
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  disabled={ensureShareLink.isPending}
                >
                  Share
                </Button>
              </>
            )}
            {canManage && (
              <>
                <Button
                  variant="outline"
                  onClick={togglePublic}
                  disabled={updatePlaylist.isPending}
                >
                  Make {playlist.isPublic ? 'private' : 'public'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={deletePlaylist.isPending}
                >
                  Delete playlist
                </Button>
              </>
            )}
          </div>
        </div>
        {!playlist.isPublic && playlist.isOwner && !isEditorial && (
          <p className="mt-3 text-sm text-muted-foreground">
            Make playlist public to share
          </p>
        )}
        {copyFeedback && (
          <p className="mt-3 text-sm text-primary">{copyFeedback}</p>
        )}
        {actionError && <p className="mt-3 text-sm text-destructive">{actionError}</p>}
      </header>

      {playlist.tracks.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground">No tracks yet — add from discover.</p>
          <Link
            to="/discover"
            className={buttonVariants({ variant: 'outline', className: 'mt-4 inline-flex' })}
          >
            Browse tracks
          </Link>
        </Card>
      ) : (
        <ul className="space-y-3">
          {playlist.tracks.map((track) => (
            <li key={track.trackId}>
              <Card size="sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-muted">
                      {track.coverArtUrl ? (
                        <img src={track.coverArtUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground/80">
                          —
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/tracks/${track.trackId}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {track.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">{track.artistName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {track.duration > 0 && (
                      <span className="text-sm text-muted-foreground/80">
                        {formatDuration(track.duration)}
                      </span>
                    )}
                    {canManage && (
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveTrack(track.trackId)}
                        disabled={removeTrack.isPending}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
