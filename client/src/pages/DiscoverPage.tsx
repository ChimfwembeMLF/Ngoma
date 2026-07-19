import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrending, useNewReleases, useSearch } from '../hooks/useDiscovery';
import { DesignSystemLayout } from '../components/layout/DesignSystemLayout';
import { SearchPill } from '../components/ui/SearchPill';
import { TrackCard } from '../components/ui/TrackCard';
import { buttonVariants } from '../components/ui/Button';

export function DiscoverPage() {
  const [search, setSearch] = useState('');
  const trending = useTrending();
  const newReleases = useNewReleases();
  const searchResults = useSearch(search);

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

  return (
    <DesignSystemLayout maxWidth="6xl">
      <header className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-[28px] font-bold leading-tight text-ink">Discover</h1>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <SearchPill value={search} onChange={setSearch} className="sm:w-72" />
          <Link to="/auth" className={buttonVariants('outline', 'whitespace-nowrap')}>
            Sign in
          </Link>
        </div>
      </header>

      {sections.map((section) => (
        <section key={section.title} className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-ink">{section.title}</h2>
          {section.loading ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : section.tracks.length === 0 ? (
            <p className="text-sm text-muted">No tracks in this section yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {section.tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          )}
        </section>
      ))}
    </DesignSystemLayout>
  );
}
