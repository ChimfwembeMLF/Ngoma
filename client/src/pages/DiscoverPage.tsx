import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrending, useNewReleases, useSearch } from '../hooks/useDiscovery';

export function DiscoverPage() {
  const [search, setSearch] = useState('');
  const trending = useTrending();
  const newReleases = useNewReleases();
  const searchResults = useSearch(search);

  const sections = [
    { title: 'Trending', tracks: trending.data?.data ?? [] },
    { title: 'New releases', tracks: newReleases.data?.data ?? [] },
  ];

  if (search.length >= 2) {
    sections.unshift({ title: 'Search results', tracks: searchResults.data?.data ?? [] });
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-cream">Discover</h1>
        <div className="flex gap-3">
          <input
            className="rounded-lg bg-indigo-950 border border-indigo-700 px-3 py-2 text-cream w-64"
            placeholder="Search tracks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link to="/auth" className="px-4 py-2 rounded-lg border border-indigo-600 text-cream">
            Sign in
          </Link>
        </div>
      </header>

      {sections.map((section) => (
        <section key={section.title} className="mb-10">
          <h2 className="text-xl font-semibold text-cream mb-4">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.tracks.map((track) => (
              <Link
                key={track.id}
                to={`/tracks/${track.id}`}
                className="rounded-xl border border-indigo-800/40 bg-indigo-950/20 p-4 hover:border-terracotta/50 transition"
              >
                <div className="aspect-square rounded-lg bg-indigo-900/50 mb-3 overflow-hidden">
                  {track.coverArtUrl ? (
                    <img src={track.coverArtUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cream/30">
                      No cover
                    </div>
                  )}
                </div>
                <div className="font-medium text-cream">{track.title}</div>
                <div className="text-sm text-cream/60">{track.artistName}</div>
                <div className="text-sm text-terracotta mt-1">
                  {track.pricingType === 'FREE' ? 'Free' : `ZMW ${track.price}`}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
