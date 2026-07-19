import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTrack } from '../hooks/useTracks';
import { AudioPlayer } from '../components/player/AudioPlayer';
import { formatDuration } from '../lib/format-duration';
import { getAccessToken } from '../lib/auth-storage';
import { DesignSystemLayout } from '../components/layout/DesignSystemLayout';
import { Button, buttonVariants } from '../components/ui/Button';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

export function TrackPage() {
  const { id = '' } = useParams();
  const { data, isLoading } = useTrack(id);
  const track = data?.data;
  const [downloading, setDownloading] = useState(false);

  if (isLoading) {
    return (
      <DesignSystemLayout maxWidth="2xl">
        <p className="text-muted">Loading…</p>
      </DesignSystemLayout>
    );
  }

  if (!track) {
    return (
      <DesignSystemLayout maxWidth="2xl">
        <p className="text-muted">Track not found</p>
      </DesignSystemLayout>
    );
  }

  const streamUrl = `${baseUrl}/api/v1/tracks/${track.id}/stream`;
  const isPaid =
    track.pricingType === 'SET_PRICE' || track.pricingType === 'PAY_WHAT_YOU_WANT';
  const isLoggedIn = !!getAccessToken();

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
    <DesignSystemLayout maxWidth="2xl">
      <div className="space-y-6">
        <Link to="/discover" className={buttonVariants('ghost', 'px-0 text-sm text-muted hover:text-ink')}>
          ← Back to discover
        </Link>

        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="aspect-square w-full max-w-xs shrink-0 overflow-hidden rounded-md bg-surface-soft">
            {track.coverArtUrl ? (
              <img src={track.coverArtUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-soft">No cover</div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-[22px] font-medium leading-tight text-ink">{track.title}</h1>
            <p className="mt-1 text-base text-muted">{track.artistName}</p>
            {track.genre && <p className="mt-1 text-sm text-muted">{track.genre}</p>}
            {track.duration != null && track.duration > 0 && (
              <p className="mt-1 text-sm text-muted-soft">{formatDuration(track.duration)}</p>
            )}
          </div>
        </div>

        <AudioPlayer src={streamUrl} title={track.title} artistName={track.artistName} />

        <div className="flex flex-wrap gap-3">
          {isPaid ? (
            isLoggedIn ? (
              <>
                <Link
                  to={`/checkout/${track.id}`}
                  className={buttonVariants('primary')}
                >
                  {track.pricingType === 'PAY_WHAT_YOU_WANT'
                    ? `Pay what you want · from ZMW ${track.minPrice ?? 0}`
                    : `Buy · ZMW ${track.price}`}
                </Link>
                <Button variant="outline" onClick={download} disabled={downloading}>
                  {downloading ? 'Downloading…' : 'Download'}
                </Button>
              </>
            ) : (
              <Link to="/auth" className={buttonVariants('primary')}>
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
        </div>
      </div>
    </DesignSystemLayout>
  );
}
