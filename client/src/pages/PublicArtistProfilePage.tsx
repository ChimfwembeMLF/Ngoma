import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useArtistPublic } from '@/hooks/useTips';
import type { Track } from '@/hooks/useTracks';
import { useAdsConfig } from '@/hooks/useAds';
import { apiFetch } from '@/lib/api-client';
import { AppShell } from '@/components/layout/AppShell';
import { TrackCard } from '@/components/ui/TrackCard';
import { GoogleAdUnit } from '@/components/ads/GoogleAdUnit';
import { buttonVariants } from '@/components/ui/button';

export function PublicArtistProfilePage() {
  const { id = '' } = useParams();
  const { data: artistData, isLoading: artistLoading } = useArtistPublic(id);
  const { data: tracksData, isLoading: tracksLoading } = useQuery({
    queryKey: ['artist', id, 'tracks'],
    queryFn: () => apiFetch<{ success: boolean; data: Track[] }>(`/api/v1/artists/${id}/tracks`),
    enabled: !!id,
  });
  const { data: adsConfigData } = useAdsConfig();
  const artist = artistData?.data;
  const tracks = tracksData?.data ?? [];
  const slotArtist = import.meta.env.VITE_ADSENSE_SLOT_ARTIST;

  if (artistLoading) {
    return (
      <AppShell maxWidth="4xl">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </AppShell>
    );
  }

  if (!artist) {
    return (
      <AppShell maxWidth="4xl">
        <p className="text-sm text-muted-foreground">Artist not found</p>
      </AppShell>
    );
  }

  return (
    <AppShell maxWidth="4xl">
      <div className="space-y-8">
        <Link
          to="/discover"
          className={buttonVariants({
            variant: 'ghost',
            className: 'px-0 text-sm text-muted-foreground hover:text-foreground',
          })}
        >
          ← Back to discover
        </Link>

        <header>
          <h1 className="text-3xl font-bold text-foreground">{artist.artistName}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Artist profile</p>
        </header>

        {adsConfigData?.data?.googleAdsEnabled !== false && slotArtist && (
          <div className="max-w-full overflow-hidden">
            <GoogleAdUnit slotId={slotArtist} format="leaderboard" className="my-4" />
          </div>
        )}

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Tracks</h2>
          {tracksLoading ? (
            <p className="text-sm text-muted-foreground">Loading tracks…</p>
          ) : tracks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No published tracks yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}