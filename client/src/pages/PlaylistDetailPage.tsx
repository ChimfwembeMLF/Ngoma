import { getProxiedImageUrl } from '@/lib/utils';
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
  useReorderPlaylistTracks,
  useAddTrackToPlaylist,
} from '@/hooks/usePlaylists';
import { useTrending, useSearch } from '@/hooks/useDiscovery';
import { usePlayer } from '@/providers/PlayerProvider';
import { AppShell } from '@/components/layout/AppShell';
import { EditPlaylistDialog } from '@/components/playlists/EditPlaylistDialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDuration } from '@/lib/format-duration';
import { Play, ArrowUp, ArrowDown, Plus, Check, Search } from 'lucide-react';

export function PlaylistDetailPage() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const byId = usePlaylist(id ?? '');
  const bySlug = usePlaylistBySlug(slug ?? '');
  const { data, isLoading, error } = slug ? bySlug : byId;
  const updatePlaylist = useUpdatePlaylist();
  const deletePlaylist = useDeletePlaylist();
  const removeTrack = useRemoveTrackFromPlaylist();
  const reorderTracks = useReorderPlaylistTracks();
  const ensureShareLink = useEnsureShareLink();
  const addTrack = useAddTrackToPlaylist();
  const { setQueue, updateQueueWithoutPlaying, queue } = usePlayer();
  
  const [actionError, setActionError] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const trendingQuery = useTrending();
  const searchResultsQuery = useSearch(searchQuery);
  const displayedTracks = searchQuery.length >= 2 ? searchResultsQuery.data?.data ?? [] : trendingQuery.data?.data ?? [];

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

  const handleMove = async (index: number, direction: -1 | 1) => {
    if (!playlist) return;
    if (index + direction < 0 || index + direction >= playlist.tracks.length) return;
    
    setActionError('');
    try {
      const newTracks = [...playlist.tracks];
      const temp = newTracks[index];
      newTracks[index] = newTracks[index + direction];
      newTracks[index + direction] = temp;
      
      const trackIds = newTracks.map(t => t.trackId);
      await reorderTracks.mutateAsync({ playlistId: playlist.id, trackIds });
      if (queue.length > 0 && queue.every(qt => trackIds.includes(qt.id))) {
        const updatedQueue = newTracks.map(t => ({
          id: t.trackId,
          title: t.title,
          artistName: t.artistName,
          streamUrl: `/api/v1/tracks/${t.trackId}/stream`,
          coverUrl: t.coverArtUrl ?? undefined,
        }));
        updateQueueWithoutPlaying(updatedQueue);
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Reorder failed');
    }
  };

  const playAll = (startIndex = 0) => {
    if (!playlist || playlist.tracks.length === 0) return;
    
    const tracksToPlay = playlist.tracks.map(t => ({
      id: t.trackId,
      title: t.title,
      artistName: t.artistName,
      streamUrl: `/api/v1/tracks/${t.trackId}/stream`, // Note: Using proxy for streaming
      coverUrl: t.coverArtUrl ?? undefined,
    }));
    
    setQueue(tracksToPlay, startIndex);
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

      {isEditing ? (
        <EditPlaylistDialog playlist={playlist} onClose={() => setIsEditing(false)} />
      ) : (
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
            
            {playlist.tracks.length > 0 && (
              <div className="mt-4">
                <Button onClick={() => playAll(0)} className="gap-2">
                  <Play className="h-4 w-4 fill-current" />
                  Play All
                </Button>
              </div>
            )}
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
                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
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
      )}

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
          {playlist.tracks.map((track, index) => (
            <li key={track.trackId}>
              <Card size="sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="shrink-0"
                      onClick={() => playAll(index)}
                    >
                      <Play className="h-5 w-5 fill-current" />
                    </Button>
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-muted">
                      {track.coverArtUrl ? (
                        <img src={getProxiedImageUrl(track.coverArtUrl)} alt="" className="h-full w-full object-cover" />
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
                  <div className="flex items-center gap-1 sm:gap-3">
                    {track.duration > 0 && (
                      <span className="text-sm text-muted-foreground/80 hidden sm:inline">
                        {formatDuration(track.duration)}
                      </span>
                    )}
                    {canManage && (
                      <>
                        <div className="flex flex-col">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            disabled={index === 0 || reorderTracks.isPending}
                            onClick={() => handleMove(index, -1)}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            disabled={index === playlist.tracks.length - 1 || reorderTracks.isPending}
                            onClick={() => handleMove(index, 1)}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => handleRemoveTrack(track.trackId)}
                          disabled={removeTrack.isPending}
                          className="ml-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {canManage && (
        <div className="mt-12 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-2">Add more tracks to your playlist</h2>
          <p className="text-sm text-muted-foreground mb-4">Search for songs or pick from trending tracks below:</p>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {displayedTracks.map((item) => {
              const isAdded = playlist?.tracks.some((pt) => pt.trackId === item.id);
              return (
                <div key={item.id} className="flex items-center justify-between rounded-md border border-border bg-background p-3 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                      {item.coverArtUrl ? (
                        <img src={getProxiedImageUrl(item.coverArtUrl)} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">—</div>
                      )}
                    </div>
                    <div className="truncate">
                      <p className="truncate font-medium text-foreground text-sm">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.artistName || 'Unknown Artist'}</p>
                    </div>
                  </div>
                  <Button
                    variant={isAdded ? 'secondary' : 'default'}
                    size="sm"
                    disabled={isAdded || addTrack.isPending}
                    onClick={async () => {
                      if (!playlist || isAdded) return;
                      try {
                        await addTrack.mutateAsync({ playlistId: playlist.id, trackId: item.id });
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="shrink-0 gap-1"
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Add</span>
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
            {displayedTracks.length === 0 && (
              <p className="text-center py-4 text-sm text-muted-foreground">No tracks found matching "{searchQuery}".</p>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
