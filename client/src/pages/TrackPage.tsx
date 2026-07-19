import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTrack } from '@/hooks/useTracks';
import { useAddTrackToPlaylist, useMyPlaylists } from '@/hooks/usePlaylists';
import { AudioPlayer } from '@/components/player/AudioPlayer';
import { formatDuration } from '@/lib/format-duration';
import { getAccessToken } from '@/lib/auth-storage';
import { AppShell } from '@/components/layout/AppShell';
import { Button, buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

export function TrackPage() {
  const { id = '' } = useParams();
  const { data, isLoading } = useTrack(id);
  const track = data?.data;
  const [downloading, setDownloading] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [addMessage, setAddMessage] = useState('');
  const isLoggedIn = !!getAccessToken();
  const { data: playlistsData } = useMyPlaylists(isLoggedIn);
  const addToPlaylist = useAddTrackToPlaylist();
  const myPlaylists = playlistsData?.data ?? [];

  if (isLoading) {
    return (
      <AppShell maxWidth="2xl">
        <p className="text-muted-foreground">Loading…</p>
      </AppShell>
    );
  }

  if (!track) {
    return (
      <AppShell maxWidth="2xl">
        <p className="text-muted-foreground">Track not found</p>
      </AppShell>
    );
  }

  const streamUrl = `${baseUrl}/api/v1/tracks/${track.id}/stream`;
  const isPaid =
    track.pricingType === 'SET_PRICE' || track.pricingType === 'PAY_WHAT_YOU_WANT';

  const addTrackToPlaylist = async () => {
    if (!selectedPlaylistId) return;
    setAddMessage('');
    try {
      await addToPlaylist.mutateAsync({ playlistId: selectedPlaylistId, trackId: track.id });
      setAddMessage('Added to playlist');
    } catch (err) {
      setAddMessage(err instanceof Error ? err.message : 'Failed to add track');
    }
  };

  const download = async () => {
    const token = getAccessToken();
    if (!token) return;
    setDownloading(true);
    try {
      const res = await fetch(`${baseUrl}/api/v1/tracks/${track.id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${track.title}.mp3`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AppShell maxWidth="2xl">
      <div className="space-y-6">
        <Link
          to="/discover"
          className={buttonVariants({
            variant: 'ghost',
            className: 'px-0 text-sm text-muted-foreground hover:text-foreground',
          })}
        >
          ← Back to discover
        </Link>

        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="aspect-square w-full max-w-xs shrink-0 overflow-hidden rounded-md bg-muted">
            {track.coverArtUrl ? (
              <img src={track.coverArtUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground/80">
                No cover
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-[22px] font-medium leading-tight text-foreground">{track.title}</h1>
            <p className="mt-1 text-base text-muted-foreground">{track.artistName}</p>
            {track.genre && <p className="mt-1 text-sm text-muted-foreground">{track.genre}</p>}
            {track.duration != null && track.duration > 0 && (
              <p className="mt-1 text-sm text-muted-foreground/80">{formatDuration(track.duration)}</p>
            )}
          </div>
        </div>

        <AudioPlayer src={streamUrl} title={track.title} artistName={track.artistName} />

        <div className="flex flex-wrap gap-3">
          {isPaid ? (
            isLoggedIn ? (
              <>
                <Link to={`/checkout/${track.id}`} className={buttonVariants({ variant: 'default' })}>
                  {track.pricingType === 'PAY_WHAT_YOU_WANT'
                    ? `Pay what you want · from ZMW ${track.minPrice ?? 0}`
                    : `Buy · ZMW ${track.price}`}
                </Link>
                <Button variant="outline" onClick={download} disabled={downloading}>
                  {downloading ? 'Downloading…' : 'Download'}
                </Button>
              </>
            ) : (
              <Link to="/auth" className={buttonVariants({ variant: 'default' })}>
                Sign in to buy
              </Link>
            )
          ) : (
            isLoggedIn && (
              <Button variant="outline" onClick={download} disabled={downloading}>
                {downloading ? 'Downloading…' : 'Download free'}
              </Button>
            )
          )}
          {isLoggedIn && track.artistId && (
            <Link
              to={`/tip/${track.artistId}?trackId=${track.id}`}
              className={buttonVariants({ variant: 'outline' })}
            >
              Tip artist
            </Link>
          )}
        </div>

        {isLoggedIn && (
          <div className="rounded-md border border-border bg-muted p-4">
            <p className="mb-3 text-sm font-medium text-foreground">Add to playlist</p>
            {myPlaylists.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No playlists yet.{' '}
                <Link to="/playlists" className="text-foreground underline">
                  Create a playlist
                </Link>
              </p>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="playlist-select">Playlist</Label>
                  <Select value={selectedPlaylistId} onValueChange={setSelectedPlaylistId}>
                    <SelectTrigger id="playlist-select" className="w-full">
                      <SelectValue placeholder="Select playlist…" />
                    </SelectTrigger>
                    <SelectContent>
                      {myPlaylists.map((playlist) => (
                        <SelectItem key={playlist.id} value={playlist.id}>
                          {playlist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={addTrackToPlaylist}
                  disabled={!selectedPlaylistId || addToPlaylist.isPending}
                >
                  {addToPlaylist.isPending ? 'Adding…' : 'Add to playlist'}
                </Button>
              </div>
            )}
            {addMessage && (
              <p
                className={`mt-2 text-sm ${addMessage === 'Added to playlist' ? 'text-muted-foreground' : 'text-destructive'}`}
              >
                {addMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
