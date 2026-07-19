import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTrack } from '../hooks/useTracks';
import { AudioPlayer } from '../components/player/AudioPlayer';
import { formatDuration } from '../lib/format-duration';
import { getAccessToken } from '../lib/auth-storage';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

export function TrackPage() {
  const { id = '' } = useParams();
  const { data, isLoading } = useTrack(id);
  const track = data?.data;
  const [downloading, setDownloading] = useState(false);

  if (isLoading) return <div className="p-8 text-cream">Loading...</div>;
  if (!track) return <div className="p-8 text-cream">Track not found</div>;

  const streamUrl = `${baseUrl}/api/v1/tracks/${track.id}/stream`;
  const isPaid = track.pricingType === 'SET_PRICE';
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
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <Link to="/discover" className="text-terracotta text-sm hover:underline">
        ← Back to discover
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-cream">{track.title}</h1>
        <p className="text-cream/70">{track.artistName}</p>
        <p className="text-cream/60 text-sm mt-1">{track.genre}</p>
        {track.duration != null && track.duration > 0 && (
          <p className="text-cream/50 text-sm">{formatDuration(track.duration)}</p>
        )}
      </div>

      <AudioPlayer src={streamUrl} title={track.title} artistName={track.artistName} />

      <div className="flex gap-3">
        {isPaid ? (
          isLoggedIn ? (
            <>
              <Link
                to={`/checkout/${track.id}`}
                className="px-4 py-2 rounded-lg bg-terracotta text-white"
              >
                Buy · ZMW {track.price}
              </Link>
              <button
                type="button"
                onClick={download}
                disabled={downloading}
                className="px-4 py-2 rounded-lg border border-indigo-600 text-cream"
              >
                {downloading ? 'Downloading...' : 'Download'}
              </button>
            </>
          ) : (
            <Link to="/auth" className="px-4 py-2 rounded-lg bg-terracotta text-white">
              Sign in to buy
            </Link>
          )
        ) : (
          isLoggedIn && (
            <button
              type="button"
              onClick={download}
              disabled={downloading}
              className="px-4 py-2 rounded-lg border border-indigo-600 text-cream"
            >
              {downloading ? 'Downloading...' : 'Download free'}
            </button>
          )
        )}
      </div>
    </div>
  );
}
