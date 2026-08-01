import { getProxiedImageUrl } from '@/lib/utils';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { useTrack } from '@/hooks/useTracks';
import { useArtistVideos } from '@/hooks/useVideos';
import { useAddTrackToPlaylist, useMyPlaylists } from '@/hooks/usePlaylists';
import {
  useAdsConfig,
  useCompleteAdSession,
  useStartAdSession,
  type AdSessionStart,
} from '@/hooks/useAds';
import { usePlayer } from '@/providers/PlayerProvider';
import { AdGateModal } from '@/components/ads/AdGateModal';
import { GoogleAdUnit } from '@/components/ads/GoogleAdUnit';
import { formatDuration } from '@/lib/format-duration';
import { getAccessToken } from '@/lib/auth-storage';
import { AppShell } from '@/components/layout/AppShell';
import { VideoCard } from '@/components/videos/VideoCard';
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
  const artistVideos = useArtistVideos(track?.artistId);
  const artistVideoList = artistVideos.data?.data ?? [];
  const { playTrack, currentTrack, isPlaying, pauseTrack } = usePlayer();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [adSession, setAdSession] = useState<AdSessionStart | null>(null);
  const [adGateError, setAdGateError] = useState('');
  const [startingAdGate, setStartingAdGate] = useState(false);
  const { data: adsConfigData } = useAdsConfig();
  const startAdSession = useStartAdSession();
  const completeAdSession = useCompleteAdSession();
  const adsEnabled = adsConfigData?.data?.adsEnabled !== false;
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [addMessage, setAddMessage] = useState('');
  const [addedPlaylists, setAddedPlaylists] = useState<string[]>([]);
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
  const canDownload = track.canDownload === true;

  const addTrackToPlaylist = async (playlistId: string) => {
    if (!playlistId) return;
    setAddMessage('');
    try {
      await addToPlaylist.mutateAsync({ playlistId, trackId: track.id });
      setAddedPlaylists((prev) => [...prev, playlistId]);
      setAddMessage('Added to playlist');
    } catch (err) {
      setAddMessage(err instanceof Error ? err.message : 'Failed to add track');
    }
  };

  const download = async (adSessionId?: string) => {
    const token = getAccessToken();
    if (!token) return;
    setDownloading(true);
    setDownloadError('');
    try {
      const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
      if (adSessionId) headers['X-Ad-Session-Id'] = adSessionId;
      const res = await fetch(`${baseUrl}/api/v1/tracks/${track.id}/download`, {
        headers,
      });
      if (!res.ok) {
        const contentType = res.headers.get('content-type') ?? '';
        if (contentType.includes('application/json')) {
          const body = (await res.json()) as { message?: string; error?: string };
          throw new Error(body.message || body.error || 'Download failed');
        }
        throw new Error('Download failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${track.title}.mp3`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const beginFreeDownload = async () => {
    if (!adsEnabled || track.pricingType !== 'FREE') {
      await download();
      return;
    }
    setStartingAdGate(true);
    setAdGateError('');
    setDownloadError('');
    try {
      const res = await startAdSession.mutateAsync(track.id);
      setAdSession(res.data);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Could not start ad session');
    } finally {
      setStartingAdGate(false);
    }
  };

  const completeAdGateDownload = async () => {
    if (!adSession) return;
    setAdGateError('');
    try {
      await completeAdSession.mutateAsync(adSession.sessionId);
      setAdSession(null);
      await download(adSession.sessionId);
    } catch (err) {
      setAdGateError(
        err instanceof Error ? err.message : 'Session expired, try again',
      );
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
              <img src={getProxiedImageUrl(track.coverArtUrl)} alt="" className="h-full w-full object-cover" />
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

        <div className="flex flex-wrap gap-3">
          <Button 
            variant="default"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => {
              if (currentTrack?.id === track.id && isPlaying) {
                pauseTrack();
              } else {
                playTrack({
                  id: track.id,
                  title: track.title,
                  artistName: track.artistName || 'Unknown Artist',
                  streamUrl,
                  coverUrl: track.coverArtUrl || undefined,
                });
              }
            }}
          >
            {currentTrack?.id === track.id && isPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          {isPaid ? (
            isLoggedIn ? (
              <>
                {!canDownload && (
                  <Link
                    to={`/checkout/${track.id}`}
                    className={buttonVariants({ variant: 'default' })}
                  >
                    {track.pricingType === 'PAY_WHAT_YOU_WANT'
                      ? `Pay what you want · from ZMW ${track.minPrice ?? 0}`
                      : `Buy · ZMW ${track.price}`}
                  </Link>
                )}
                {canDownload && (
                  <Button variant="outline" onClick={() => download()} disabled={downloading}>
                    {downloading ? 'Downloading…' : 'Download'}
                  </Button>
                )}
              </>
            ) : (
              <Link to="/auth" className={buttonVariants({ variant: 'default' })}>
                Sign in to buy
              </Link>
            )
          ) : isLoggedIn ? (
            canDownload && (
              <Button
                variant="outline"
                onClick={beginFreeDownload}
                disabled={downloading || startingAdGate}
              >
                {startingAdGate
                  ? 'Loading ad…'
                  : downloading
                    ? 'Downloading…'
                    : 'Download free'}
              </Button>
            )
          ) : (
            <Link to="/auth" className={buttonVariants({ variant: 'default' })}>
              Sign in to download
            </Link>
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

        {adsConfigData?.data?.googleAdsEnabled !== false &&
          import.meta.env.VITE_ADSENSE_SLOT_TRACK && (
            <div className="max-w-full overflow-hidden">
              <GoogleAdUnit
                slotId={import.meta.env.VITE_ADSENSE_SLOT_TRACK}
                format="rectangle"
                className="mt-6"
              />
            </div>
          )}

        {downloadError && <p className="text-sm text-destructive">{downloadError}</p>}

        {adSession && (
          <AdGateModal
            session={adSession}
            onComplete={completeAdGateDownload}
            onCancel={() => {
              setAdSession(null);
              setAdGateError('');
            }}
            completing={completeAdSession.isPending || downloading}
            error={adGateError}
          />
        )}

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
              <div className="flex -mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 scrollbar-hide">
                <div className="flex gap-3">
                  {myPlaylists.map((playlist) => {
                    const justAdded = addedPlaylists.includes(playlist.id);
                    return (
                      <button
                        key={playlist.id}
                        onClick={() => !justAdded && addTrackToPlaylist(playlist.id)}
                        disabled={addToPlaylist.isPending || justAdded}
                        className={`group flex w-32 shrink-0 flex-col overflow-hidden rounded-md border text-left transition-all focus:outline-none disabled:opacity-90 ${
                          justAdded ? 'border-green-500/50 bg-green-500/5' : 'border-border bg-card hover:border-primary/50 focus:border-primary/50'
                        }`}
                      >
                        <div className="relative aspect-square w-full overflow-hidden bg-muted">
                          {playlist.coverArtUrl ? (
                            <img src={getProxiedImageUrl(playlist.coverArtUrl)} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground/80">
                              <span aria-hidden className="text-2xl">♪</span>
                            </div>
                          )}
                          {justAdded && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white font-semibold text-xs gap-1 backdrop-blur-[1px]">
                              <Check className="h-6 w-6 text-green-400" />
                              <span>Added</span>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">
                            {playlist.name}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {playlist.trackCount} {playlist.trackCount === 1 ? 'track' : 'tracks'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
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

        {track.artistId && !artistVideos.isLoading && artistVideoList.length > 0 && (
          <section>
            <h2 className="mb-4 text-base font-semibold text-foreground">
              Videos from {track.artistName}
            </h2>
            <div className="flex flex-col gap-4">
              {artistVideoList.map((video) => (
                <VideoCard key={video.id} video={video} layout="horizontal" />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
