import { Link } from 'react-router-dom';
import { useMyTracks } from '@/hooks/useTracks';
import { useAnalyticsDashboard } from '@/hooks/useAnalytics';
import { useTipsReceived } from '@/hooks/useTips';
import { AppShell } from '@/components/layout/AppShell';
import { TrackUploadForm } from '@/components/tracks/TrackUploadForm';
import { AnalyticsSummaryCards } from '@/components/analytics/AnalyticsSummaryCards';
import { EarningsTimeline } from '@/components/analytics/EarningsTimeline';
import { TrackEarningsTable } from '@/components/analytics/TrackEarningsTable';
import { Card } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';

export function ArtistDashboardPage() {
  const { data, refetch, isLoading } = useMyTracks();
  const tracks = data?.data ?? [];

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useAnalyticsDashboard();
  const dashboard = analyticsData?.data;
  const { data: tipsData, isLoading: tipsLoading } = useTipsReceived(10);
  const recentTips = tipsData?.data ?? [];

  return (
    <AppShell maxWidth="3xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[22px] font-medium text-foreground">Artist dashboard</h1>
        <Link to="/artist/profile" className={buttonVariants({ variant: 'outline' })}>
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
          <h2 className="mb-4 text-base font-semibold text-foreground">Recent tips</h2>
          {tipsLoading && <p className="text-sm text-muted-foreground">Loading tips…</p>}
          {!tipsLoading && recentTips.length === 0 && (
            <p className="text-sm text-muted-foreground">No tips yet.</p>
          )}
          {!tipsLoading && recentTips.length > 0 && (
            <ul className="space-y-3">
              {recentTips.map((tip) => (
                <li key={tip.id}>
                  <Card size="sm">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-medium text-foreground">{tip.tipperName}</div>
                        {tip.message && <div className="text-sm text-muted-foreground">{tip.message}</div>}
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        ZMW {tip.amount.toFixed(2)}
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-base font-semibold text-foreground">Performance by track</h2>
          {analyticsLoading && <p className="text-sm text-muted-foreground">Loading track performance…</p>}
          {!analyticsLoading && (
            <TrackEarningsTable tracks={dashboard?.topTracks ?? []} />
          )}
        </section>

        <TrackUploadForm onSuccess={() => refetch()} />

        <section>
          <h2 className="mb-4 text-base font-semibold text-foreground">Your tracks</h2>
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && tracks.length === 0 && (
            <p className="text-sm text-muted-foreground">No tracks yet — upload your first track above.</p>
          )}
          <ul className="space-y-3">
            {tracks.map((track) => (
              <li key={track.id}>
                <Card
                  size="sm"
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-foreground">{track.title}</div>
                    <div className="text-sm text-muted-foreground">
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
                    className={buttonVariants({ variant: 'ghost', className: 'shrink-0 text-sm' })}
                  >
                    View
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
