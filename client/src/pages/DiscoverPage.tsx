import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrending, useNewReleases, useSearch } from '@/hooks/useDiscovery';
import { useCuratedPlaylists } from '@/hooks/usePlaylists';
import { getAccessToken } from '@/lib/auth-storage';
import { AppShell } from '@/components/layout/AppShell';
import { SearchPill } from '@/components/ui/SearchPill';
import { TrackCard } from '@/components/ui/TrackCard';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function DiscoverPage() {
  const [search, setSearch] = useState('');
  const isLoggedIn = !!getAccessToken();
  const trending = useTrending();
  const newReleases = useNewReleases();
  const searchResults = useSearch(search);
  const curated = useCuratedPlaylists();

  const sections = [
    { title: 'Trending', tracks: trending.data?.data ?? [], loading: trending.isLoading },
    { title: 'New releases', tracks: newReleases.data?.data ?? [], loading: newReleases.isLoading },
  ];

  if (search.length >= 2) {
    sections.unshift({
      title: 'Search results',
      tracks: searchResults.data?.data ?? [],
      loading: searchResults.isLoading,
    });
  }

  const curatedPlaylists = curated.data?.data ?? [];

  return (
    <AppShell maxWidth="6xl">
      <header className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-[28px] font-bold leading-tight text-foreground">Discover</h1>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <SearchPill value={search} onChange={setSearch} className="sm:w-72" />
          {isLoggedIn ? (
            <Link
              to="/playlists"
              className={buttonVariants({ variant: 'outline', className: 'whitespace-nowrap' })}
            >
              My playlists
            </Link>
          ) : (
            <Link
              to="/auth"
              className={buttonVariants({ variant: 'outline', className: 'whitespace-nowrap' })}
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      {!curated.isLoading && curatedPlaylists.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Curated by Ngoma</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {curatedPlaylists.map((playlist) => {
              const href = playlist.shareSlug
                ? `/playlists/share/${playlist.shareSlug}`
                : `/playlists/${playlist.id}`;
              return (
                <Link key={playlist.id} to={href}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <div className="flex h-32 items-center justify-center rounded-t-lg bg-muted">
                      {playlist.coverArtUrl ? (
                        <img
                          src={playlist.coverArtUrl}
                          alt=""
                          className="h-full w-full rounded-t-lg object-cover"
                        />
                      ) : (
                        <span className="text-3xl text-muted-foreground/60">♪</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground">{playlist.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {playlist.trackCount}{' '}
                        {playlist.trackCount === 1 ? 'track' : 'tracks'}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {sections.map((section) => (
        <section key={section.title} className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-foreground">{section.title}</h2>
          {section.loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : section.tracks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tracks in this section yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {section.tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          )}
        </section>
      ))}
    </AppShell>
  );
}
