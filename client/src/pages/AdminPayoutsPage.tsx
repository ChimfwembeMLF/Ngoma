import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminPayoutList, useProcessPayout } from '@/hooks/usePayouts';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';

export function AdminPayoutsPage() {
  const { data, isLoading, error, refetch } = useAdminPayoutList('PENDING');
  const processPayout = useProcessPayout();
  const [actionError, setActionError] = useState('');

  const payouts = data?.data ?? [];

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionError('');
    try {
      await processPayout.mutateAsync({ id, action });
      await refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Action failed');
    }
  };

  return (
    <AppShell maxWidth="6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[22px] font-medium text-foreground">Admin — Payouts</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin" className={buttonVariants({ variant: 'outline' })}>
            Overview
          </Link>
          <Link to="/admin/users" className={buttonVariants({ variant: 'outline' })}>
            Users
          </Link>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-destructive">Failed to load payout requests</p>
      )}
      {actionError && (
        <p className="mb-4 text-sm text-destructive">{actionError}</p>
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Loading payouts…</p>}

      {!isLoading && payouts.length === 0 && (
        <p className="text-sm text-muted-foreground">No pending payout requests.</p>
      )}

      <ul className="space-y-4">
        {payouts.map((payout) => (
          <li key={payout.id}>
            <Card size="sm">
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium text-foreground">
                    {payout.artistName ?? 'Artist'} · {payout.currency} {payout.amount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {payout.paymentMethod} · {payout.phone}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Requested {new Date(payout.requestedAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={processPayout.isPending}
                    onClick={() => handleAction(payout.id, 'approve')}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={processPayout.isPending}
                    onClick={() => handleAction(payout.id, 'reject')}
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
