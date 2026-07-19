import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useMyTracks } from '@/hooks/useTracks';
import {
  useMyVideos,
  useUpdateVideo,
  useDeleteVideo,
} from '@/hooks/useVideos';
import { useAnalyticsDashboard } from '@/hooks/useAnalytics';
import { useTipsReceived } from '@/hooks/useTips';
import { AppShell } from '@/components/layout/AppShell';
import { TrackUploadForm } from '@/components/tracks/TrackUploadForm';
import { VideoUploadForm } from '@/components/videos/VideoUploadForm';
import {
  MobileMoneyForm,
  type MobileMoneyFormValue,
} from '@/components/payments/MobileMoneyForm';
import { usePaymentConfig, usePaymentOptions } from '@/hooks/usePayments';
import { usePayoutBalance, usePayoutList, useRequestPayout } from '@/hooks/usePayouts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AnalyticsSummaryCards } from '@/components/analytics/AnalyticsSummaryCards';
import { EarningsTimeline } from '@/components/analytics/EarningsTimeline';
import { TrackEarningsTable } from '@/components/analytics/TrackEarningsTable';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';

export function ArtistDashboardPage() {
  const { data, refetch, isLoading } = useMyTracks();
  const tracks = data?.data ?? [];
  const {
    data: videosData,
    refetch: refetchVideos,
    isLoading: videosLoading,
  } = useMyVideos();
  const videos = videosData?.data ?? [];
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [videoActionError, setVideoActionError] = useState('');

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useAnalyticsDashboard();
  const dashboard = analyticsData?.data;
  const { data: tipsData, isLoading: tipsLoading } = useTipsReceived(10);
  const recentTips = tipsData?.data ?? [];

  const paymentConfig = usePaymentConfig();
  const paymentOptions = usePaymentOptions();
  const payoutBalance = usePayoutBalance();
  const payoutList = usePayoutList();
  const requestPayout = useRequestPayout();
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutError, setPayoutError] = useState('');
  const [mobileMoney, setMobileMoney] = useState<MobileMoneyFormValue>({
    countryId: 'ZM',
    operatorId: '',
    phone: '',
  });

  const balance = payoutBalance.data?.data;
  const countries = paymentOptions.data?.data.countries ?? [];
  const defaultCountryId = paymentOptions.data?.data.defaultCountryId ?? 'ZM';
  const pawapayEnabled = paymentConfig.data?.data.pawapayEnabled ?? true;
  const selectedCountry =
    countries.find((c) => c.id === mobileMoney.countryId) ?? countries[0];
  const wholeAmountsOnly = selectedCountry?.decimalsInAmount === 'NONE';

  const submitPayoutRequest = async () => {
    if (!mobileMoney.operatorId) {
      setPayoutError('Select a mobile money operator');
      return;
    }
    setPayoutError('');
    try {
      await requestPayout.mutateAsync({
        amount: Number(payoutAmount),
        phone: mobileMoney.phone,
        operatorId: mobileMoney.operatorId,
        countryId: mobileMoney.countryId,
      });
      setPayoutAmount('');
      payoutBalance.refetch();
      payoutList.refetch();
    } catch (e) {
      setPayoutError(e instanceof Error ? e.message : 'Payout request failed');
    }
  };

  const startEditVideo = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
    setVideoActionError('');
  };

  const saveVideoTitle = async (id: string) => {
    if (!editTitle.trim()) return;
    setVideoActionError('');
    try {
      await updateVideo.mutateAsync({ id, title: editTitle.trim() });
      setEditingId(null);
      refetchVideos();
    } catch (e) {
      setVideoActionError(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const togglePublish = async (id: string, publish: boolean) => {
    setVideoActionError('');
    try {
      await updateVideo.mutateAsync({ id, isPublished: publish });
      refetchVideos();
    } catch (e) {
      setVideoActionError(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const removeVideo = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setVideoActionError('');
    try {
      await deleteVideo.mutateAsync(id);
      refetchVideos();
    } catch (e) {
      setVideoActionError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  return (
    <AppShell maxWidth="6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[22px] font-medium text-foreground">Artist dashboard</h1>
        <Link to="/artist/profile" className={buttonVariants({ variant: 'outline' })}>
          Edit profile
        </Link>
      </div>

      <div className="space-y-8">
        <AnalyticsSummaryCards
          summary={dashboard?.summary}
          trends={dashboard?.trends}
          tips={dashboard?.tips}
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
                    <CardContent>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="font-medium text-foreground">{tip.tipperName}</div>
                          {tip.message && <div className="text-sm text-muted-foreground">{tip.message}</div>}
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                          ZMW {tip.amount.toFixed(2)}
                        </div>
                      </div>
                    </CardContent>
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

        <section>
          <h2 className="mb-4 text-base font-semibold text-foreground">Request payout</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Available balance:{' '}
                {balance
                  ? `${balance.currency} ${balance.available.toFixed(2)} (min ${balance.minimumPayout})`
                  : '—'}
              </p>
              <div className="space-y-2">
                <Label htmlFor="payout-amount">Amount ({balance?.currency ?? 'ZMW'})</Label>
                <Input
                  id="payout-amount"
                  type="number"
                  min={String(balance?.minimumPayout ?? 50)}
                  step={wholeAmountsOnly ? '1' : '0.01'}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                />
                {wholeAmountsOnly && (
                  <p className="text-xs text-muted-foreground">Whole amounts only</p>
                )}
              </div>
              <MobileMoneyForm
                countries={countries}
                defaultCountryId={defaultCountryId}
                pawapayEnabled={pawapayEnabled}
                value={mobileMoney}
                onChange={setMobileMoney}
                disabled={requestPayout.isPending}
              />
              {payoutError && <p className="text-sm text-destructive">{payoutError}</p>}
              <Button
                type="button"
                disabled={requestPayout.isPending || !payoutAmount}
                onClick={submitPayoutRequest}
              >
                {requestPayout.isPending ? 'Submitting…' : 'Request payout'}
              </Button>
              {(payoutList.data?.data.items.length ?? 0) > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {payoutList.data?.data.items.slice(0, 5).map((p) => (
                    <li key={p.id}>
                      {p.currency} {p.amount} — {p.status} (
                      {new Date(p.requestedAt).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </section>

        <TrackUploadForm onSuccess={() => refetch()} />

        <VideoUploadForm onSuccess={() => refetchVideos()} />

        <section>
          <h2 className="mb-4 text-base font-semibold text-foreground">Your videos</h2>
          {videoActionError && (
            <p className="mb-3 text-sm text-destructive">{videoActionError}</p>
          )}
          {videosLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!videosLoading && videos.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No videos yet — upload your first video above.
            </p>
          )}
          <ul className="space-y-3">
            {videos.map((video) => (
              <li key={video.id}>
                <Card
                  size="sm"
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="aspect-video h-14 shrink-0 overflow-hidden rounded-md bg-muted">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground/80">
                          ▶
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                    {editingId === video.id ? (
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="max-w-xs"
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => saveVideoTitle(video.id)}
                            disabled={updateVideo.isPending}
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="truncate font-medium text-foreground">{video.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {video.isPublished ? 'Published' : 'Draft'}
                        </div>
                      </>
                    )}
                    </div>
                  </div>
                  {editingId !== video.id && (
                    <div className="flex flex-wrap gap-2">
                      {video.isPublished && (
                        <Link
                          to={`/videos/${video.id}`}
                          className={buttonVariants({ variant: 'ghost', className: 'text-sm' })}
                        >
                          View
                        </Link>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditVideo(video.id, video.title)}
                      >
                        Edit
                      </Button>
                      {video.isPublished ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublish(video.id, false)}
                          disabled={updateVideo.isPending}
                        >
                          Unpublish
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublish(video.id, true)}
                          disabled={updateVideo.isPending}
                        >
                          Publish
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeVideo(video.id, video.title)}
                        disabled={deleteVideo.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        </section>

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
