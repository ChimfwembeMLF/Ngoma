import { Link } from 'react-router-dom';
import { usePaymentHistory } from '@/hooks/usePayments';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';

function formatDate(value: unknown) {
  if (!value) return '';
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
}

function statusColor(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'text-foreground';
    case 'FAILED':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
}

export function PurchaseHistoryPage() {
  const { data, isLoading, isError, error } = usePaymentHistory();
  const payments = data?.data ?? [];

  return (
    <AppShell maxWidth="3xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[22px] font-medium text-foreground">Purchase history</h1>
        <Link to="/dashboard" className={buttonVariants({ variant: 'outline' })}>
          Back to dashboard
        </Link>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {isError && (
        <Card className="border-destructive/30 bg-muted p-6">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : 'Could not load purchase history.'}
          </p>
        </Card>
      )}

      {!isLoading && !isError && payments.length === 0 && (
        <Card className="p-6">
          <p className="text-muted-foreground">No purchases yet.</p>
          <Link
            to="/discover"
            className={buttonVariants({ variant: 'default', className: 'mt-4 inline-flex' })}
          >
            Discover music
          </Link>
        </Card>
      )}

      <ul className="space-y-3">
        {payments.map((p) => {
          const id = String(p.id);
          const status = String(p.status ?? '');
          const itemId = p.itemId ? String(p.itemId) : null;

          return (
            <li key={id}>
              <Card className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium text-foreground">Track purchase</div>
                  <div className="text-sm text-muted-foreground">{formatDate(p.createdAt)}</div>
                  {itemId && (
                    <Link
                      to={`/tracks/${itemId}`}
                      className="mt-1 inline-block text-sm text-primary hover:underline"
                    >
                      View track
                    </Link>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-medium text-foreground">
                    {String(p.currency ?? 'ZMW')} {String(p.amount ?? '')}
                  </div>
                  <div className={`text-sm capitalize ${statusColor(status)}`}>{status.toLowerCase()}</div>
                  {status === 'FAILED' && p.errorMessage && (
                    <p className="mt-1 text-xs text-destructive">{String(p.errorMessage)}</p>
                  )}
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
