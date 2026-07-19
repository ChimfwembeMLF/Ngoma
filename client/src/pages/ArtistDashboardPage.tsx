import { Link } from 'react-router-dom';
import { useMyTracks } from '../hooks/useTracks';
import { TrackUploadForm } from '../components/tracks/TrackUploadForm';

export function ArtistDashboardPage() {
  const { data, refetch, isLoading } = useMyTracks();
  const tracks = data?.data ?? [];

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cream">Artist dashboard</h1>
        <Link to="/artist/profile" className="text-terracotta hover:underline">
          Edit profile
        </Link>
      </div>

      <TrackUploadForm onSuccess={() => refetch()} />

      <section>
        <h2 className="text-lg font-semibold text-cream mb-4">Your tracks</h2>
        {isLoading && <p className="text-cream/70">Loading...</p>}
        <ul className="space-y-3">
          {tracks.map((track) => (
            <li
              key={track.id}
              className="flex items-center justify-between rounded-lg border border-indigo-800/40 bg-indigo-950/20 px-4 py-3"
            >
              <div>
                <div className="font-medium text-cream">{track.title}</div>
                <div className="text-sm text-cream/60">
                  {track.genre} · {track.isPublished ? 'Published' : 'Draft'} · ZMW{' '}
                  {track.price ?? 0}
                </div>
              </div>
              <Link to={`/tracks/${track.id}`} className="text-terracotta text-sm">
                View
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
