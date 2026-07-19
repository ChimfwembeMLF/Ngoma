import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMyPlaylists } from '@/hooks/usePlaylists';
import { usePaymentHistory } from '@/hooks/usePayments';
import { useAnalyticsDashboard } from '@/hooks/useAnalytics';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActionGrid } from '@/components/dashboard/QuickActionGrid';
import { RecentPurchases } from '@/components/dashboard/RecentPurchases';
import { Card } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';

function formatZmw(value: number): string {
  return `ZMW ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function DashboardPage() {
  const { meQuery, logout } = useAuth();
  const user = meQuery.data?.data;
  const firstName = user?.fullName?.split(' ')[0] ?? 'there';

  const { data: playlistsData, isLoading: playlistsLoading } = useMyPlaylists();
  const { data: paymentsData, isLoading: paymentsLoading } = usePaymentHistory();
  const isArtist = user?.role === 'ARTIST';
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalyticsDashboard(isArtist);

  const playlistCount = playlistsData?.data?.length ?? 0;
  const purchaseCount = paymentsData?.pagination?.total ?? paymentsData?.data?.length ?? 0;
  const artistSummary = analyticsData?.data?.summary;

  return (
    <AppShell maxWidth="6xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-foreground">Welcome back, {firstName}</h1>
        <Button variant="ghost" onClick={logout} className="min-h-0 px-2 py-1 text-sm underline">
          Sign out
        </Button>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Your stats</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Playlists"
              value={String(playlistCount)}
              isLoading={playlistsLoading}
              subtext={playlistCount === 0 ? 'Create your first playlist' : undefined}
            />
            <StatCard
              label="Purchases"
              value={String(purchaseCount)}
              isLoading={paymentsLoading}
            />
            {user && (
              <StatCard label="Account" value={user.role} subtext={user.email} />
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Quick actions</h2>
          <QuickActionGrid
            actions={[
              { label: 'Discover music', to: '/discover', description: 'Browse tracks and artists' },
              { label: 'My playlists', to: '/playlists', description: 'Manage your collections' },
              { label: 'Purchase history', to: '/purchases', description: 'View past transactions' },
            ]}
          />
        </section>

        <RecentPurchases />

        {user?.role === 'ADMIN' && (
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Admin tools</h2>
            <Card className="space-y-4 p-6">
              <p className="text-sm text-muted-foreground">
                Manage platform settings, users, and branding from the admin overview.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/admin" className={buttonVariants({ variant: 'default' })}>
                  Admin overview
                </Link>
                <Link to="/admin/users" className={buttonVariants({ variant: 'outline' })}>
                  Users
                </Link>
                <Link to="/admin/theme" className={buttonVariants({ variant: 'outline' })}>
                  Theme
                </Link>
                <Link to="/admin/branding" className={buttonVariants({ variant: 'outline' })}>
                  Branding
                </Link>
              </div>
            </Card>
          </section>
        )}

        {user?.role === 'ARTIST' && (
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Artist snapshot</h2>
            <Card className="space-y-4 p-6">
              {analyticsLoading && (
                <p className="text-sm text-muted-foreground">Loading artist stats…</p>
              )}
              {!analyticsLoading && artistSummary && (
                <p className="text-sm text-foreground">
                  Net earnings:{' '}
                  <span className="font-semibold">{formatZmw(artistSummary.totalNetEarnings)}</span>
                  {' · '}
                  {artistSummary.totalPlays.toLocaleString()} plays
                </p>
              )}
              {!analyticsLoading && !artistSummary && (
                <p className="text-sm text-muted-foreground">Upload tracks to see earnings.</p>
              )}
              <div className="flex flex-wrap gap-3">
                <Link to="/artist/dashboard" className={buttonVariants({ variant: 'default' })}>
                  Artist dashboard
                </Link>
                <Link to="/artist/profile" className={buttonVariants({ variant: 'outline' })}>
                  Edit profile
                </Link>
              </div>
            </Card>
          </section>
        )}

        {user?.role === 'LISTENER' && purchaseCount === 0 && (
          <section>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Start exploring — discover new music on Ngoma.</p>
              <Link to="/discover" className={buttonVariants({ variant: 'default', className: 'mt-4 inline-flex' })}>
                Discover music
              </Link>
            </Card>
          </section>
        )}
      </div>
    </AppShell>
  );
}
