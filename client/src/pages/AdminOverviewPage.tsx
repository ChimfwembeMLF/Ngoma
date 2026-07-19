import { Link } from 'react-router-dom';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/dashboard/StatCard';
import { TrendBadge } from '@/components/dashboard/TrendBadge';
import { MiniBarChart } from '@/components/dashboard/MiniBarChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickActionGrid } from '@/components/dashboard/QuickActionGrid';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';

function formatZmw(value: number): string {
  return `ZMW ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatInteger(value: number): string {
  return value.toLocaleString();
}

export function AdminOverviewPage() {
  const { data, isLoading, error } = useAdminDashboard();
  const dashboard = data?.data;

  const chartBuckets =
    dashboard?.revenueTimeline.buckets.map((bucket) => ({
      label: bucket.date.slice(8),
      value: bucket.platformFees,
    })) ?? [];

  return (
    <AppShell maxWidth="6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-foreground">Admin overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Platform KPIs and recent activity</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/users" className={buttonVariants({ variant: 'outline' })}>
            Users
          </Link>
          <Link to="/admin/theme" className={buttonVariants({ variant: 'outline' })}>
            Theme
          </Link>
          <Link to="/admin/branding" className={buttonVariants({ variant: 'outline' })}>
            Branding
          </Link>
          {dashboard?.paymentHealth && dashboard.paymentHealth.pendingPayouts > 0 && (
            <Link to="/admin/payouts" className={buttonVariants({ variant: 'default' })}>
              Payouts ({dashboard.paymentHealth.pendingPayouts})
            </Link>
          )}
          <Link to="/dashboard" className={buttonVariants({ variant: 'outline' })}>
            Dashboard
          </Link>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-destructive/30 p-6">
          <p className="text-sm text-destructive">Failed to load admin dashboard</p>
        </Card>
      )}

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Platform KPIs</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total users"
              value={dashboard ? formatInteger(dashboard.kpis.totalUsers) : '—'}
              isLoading={isLoading}
            >
              {dashboard?.trends.users && <TrendBadge trend={dashboard.trends.users} />}
            </StatCard>
            <StatCard
              label="Active tracks"
              value={dashboard ? formatInteger(dashboard.kpis.totalTracks) : '—'}
              isLoading={isLoading}
            >
              {dashboard?.trends.tracks && <TrendBadge trend={dashboard.trends.tracks} />}
            </StatCard>
            <StatCard
              label="Active artists"
              value={dashboard ? formatInteger(dashboard.kpis.activeArtists) : '—'}
              isLoading={isLoading}
            />
            <StatCard
              label="Platform fees"
              value={dashboard ? formatZmw(dashboard.kpis.platformFees) : '—'}
              isLoading={isLoading}
            >
              {dashboard?.trends.platformFees && <TrendBadge trend={dashboard.trends.platformFees} />}
            </StatCard>
          </div>
          {!isLoading && dashboard && (
            <p className="mt-3 text-sm text-muted-foreground">
              {formatInteger(dashboard.kpis.completedTransactions)} completed transactions
            </p>
          )}
        </section>

        {dashboard?.paymentHealth && (
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Payment health</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="PawaPay environment"
                value={dashboard.paymentHealth.environment}
                isLoading={isLoading}
              />
              <StatCard
                label="Webhook configured"
                value={dashboard.paymentHealth.webhookConfigured ? 'Yes' : 'No'}
                isLoading={isLoading}
              />
              <StatCard
                label="Enabled countries"
                value={formatInteger(dashboard.paymentHealth.enabledCountries)}
                isLoading={isLoading}
              />
              <StatCard
                label="Pending payouts"
                value={formatInteger(dashboard.paymentHealth.pendingPayouts)}
                isLoading={isLoading}
              />
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Revenue timeline (30 days)</h2>
          {isLoading && <p className="text-sm text-muted-foreground">Loading revenue…</p>}
          {!isLoading && chartBuckets.length === 0 && (
            <p className="text-sm text-muted-foreground">No platform fees in this period.</p>
          )}
          {!isLoading && chartBuckets.length > 0 && (
            <Card size="sm">
              <CardContent>
                <MiniBarChart buckets={chartBuckets} formatValue={formatZmw} />
              </CardContent>
            </Card>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Recent activity</h2>
          <ActivityFeed items={dashboard?.recentActivity ?? []} isLoading={isLoading} />
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Quick links</h2>
          <QuickActionGrid
            actions={[
              { label: 'Manage users', to: '/admin/users', description: 'View and deactivate accounts' },
              { label: 'Payout queue', to: '/admin/payouts', description: 'Approve artist withdrawals' },
              { label: 'Theme settings', to: '/admin/theme', description: 'Platform color presets' },
              { label: 'Branding', to: '/admin/branding', description: 'Logo, backgrounds, templates' },
            ]}
          />
        </section>
      </div>
    </AppShell>
  );
}
