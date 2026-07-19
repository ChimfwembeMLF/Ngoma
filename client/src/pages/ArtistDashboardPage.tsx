import { Link } from 'react-router-dom';
import { useMyTracks } from '../hooks/useTracks';
import { useAnalyticsDashboard } from '../hooks/useAnalytics';
import { DesignSystemLayout } from '../components/layout/DesignSystemLayout';
import { TrackUploadForm } from '../components/tracks/TrackUploadForm';
import { AnalyticsSummaryCards } from '../components/analytics/AnalyticsSummaryCards';
import { EarningsTimeline } from '../components/analytics/EarningsTimeline';
import { TrackEarningsTable } from '../components/analytics/TrackEarningsTable';
import { Card } from '../components/ui/Card';
import { buttonVariants } from '../components/ui/Button';

export function ArtistDashboardPage() {
  const { data, refetch, isLoading } = useMyTracks();
  const tracks = data?.data ?? [];

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useAnalyticsDashboard();
  const dashboard = analyticsData?.data;

  return (
    <DesignSystemLayout maxWidth="3xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[22px] font-medium text-ink">Artist dashboard</h1>
        <Link to="/artist/profile" className={buttonVariants('outline')}>
          Edit profile
        </Link>
      </div>

      <div className="space-y-8">
        <AnalyticsSummaryCards
          summary={dashboard?.summary}
          isLoading={analyticsLoading}
          error={analyticsError}
        />

        <EarningsTimeline />

        <section>
          <h2 className="mb-4 text-base font-semibold text-ink">Performance by track</h2>
          {analyticsLoading && <p className="text-sm text-muted">Loading track performance…</p>}
          {!analyticsLoading && (
            <TrackEarningsTable tracks={dashboard?.topTracks ?? []} />
          )}
        </section>

        <TrackUploadForm onSuccess={() => refetch()} />

        <section>
          <h2 className="mb-4 text-base font-semibold text-ink">Your tracks</h2>
          {isLoading && <p className="text-sm text-muted">Loading…</p>}
          {!isLoading && tracks.length === 0 && (
            <p className="text-sm text-muted">No tracks yet — upload your first track above.</p>
          )}
          <ul className="space-y-3">
            {tracks.map((track) => (
              <li key={track.id}>
                <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" padding="sm">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-ink">{track.title}</div>
                    <div className="text-sm text-muted">
                      {track.genre} · {track.isPublished ? 'Published' : 'Draft'} ·{' '}
                      {track.pricingType === 'FREE'
                        ? 'Free'
                        : track.pricingType === 'PAY_WHAT_YOU_WANT'
                          ? `PWYW from ZMW ${track.minPrice ?? 0}`
                          : `ZMW ${track.price ?? 0}`}
                    </div>
                  </div>
                  <Link
                    to={`/tracks/${track.id}`}
                    className={buttonVariants('ghost', 'shrink-0 text-sm')}
                  >
                    View
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DesignSystemLayout>
  );
}
