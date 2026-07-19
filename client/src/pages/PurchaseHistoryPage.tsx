import { Link } from 'react-router-dom';
import { usePaymentHistory } from '../hooks/usePayments';
import { DesignSystemLayout } from '../components/layout/DesignSystemLayout';
import { Card } from '../components/ui/Card';
import { buttonVariants } from '../components/ui/Button';

function formatDate(value: unknown) {
  if (!value) return '';
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
}

function statusColor(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'text-ink';
    case 'FAILED':
      return 'text-error';
    default:
      return 'text-muted';
  }
}

export function PurchaseHistoryPage() {
  const { data, isLoading, isError, error } = usePaymentHistory();
  const payments = data?.data ?? [];

  return (
    <DesignSystemLayout maxWidth="3xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[22px] font-medium text-ink">Purchase history</h1>
        <Link to="/dashboard" className={buttonVariants('outline')}>
          Back to dashboard
        </Link>
      </div>

      {isLoading && <p className="text-sm text-muted">Loading…</p>}

      {isError && (
        <Card className="border-error/30 bg-surface-soft">
          <p className="text-sm text-error">
            {error instanceof Error ? error.message : 'Could not load purchase history.'}
          </p>
        </Card>
      )}

      {!isLoading && !isError && payments.length === 0 && (
        <Card>
          <p className="text-muted">No purchases yet.</p>
          <Link to="/discover" className={`${buttonVariants('primary')} mt-4 inline-flex`}>
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
              <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium text-ink">Track purchase</div>
                  <div className="text-sm text-muted">{formatDate(p.createdAt)}</div>
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
                  <div className="font-medium text-ink">
                    {String(p.currency ?? 'ZMW')} {String(p.amount ?? '')}
                  </div>
                  <div className={`text-sm capitalize ${statusColor(status)}`}>{status.toLowerCase()}</div>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </DesignSystemLayout>
  );
}
