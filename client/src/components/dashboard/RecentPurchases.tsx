import { Link } from 'react-router-dom';
import { usePaymentHistory } from '@/hooks/usePayments';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';

function formatDate(value: unknown) {
  if (!value) return '';
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
}

export function RecentPurchases() {
  const { data, isLoading, isError } = usePaymentHistory({ limit: 5 });
  const payments = data?.data ?? [];

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Recent purchases</h2>
        <Link to="/purchases" className={buttonVariants({ variant: 'ghost', className: 'text-sm' })}>
          View all →
        </Link>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading purchases…</p>}

      {isError && (
        <Card className="border-destructive/30">
          <CardContent>
            <p className="text-sm text-destructive">Could not load recent purchases.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && payments.length === 0 && (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">No purchases yet — browse Discover</p>
            <Link to="/discover" className={buttonVariants({ variant: 'default', className: 'mt-3 inline-flex' })}>
              Discover music
            </Link>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && payments.length > 0 && (
        <ul className="space-y-3">
          {payments.map((payment) => {
            const amount = Number(payment.amount);
            const itemId = payment.itemId ? String(payment.itemId) : null;

            return (
              <li key={String(payment.id)}>
                <Card size="sm">
                  <CardContent>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-medium text-foreground">
                          {payment.purpose === 'TIP' ? 'Tip' : 'Track purchase'}
                        </div>
                        <div className="text-sm text-muted-foreground">{formatDate(payment.createdAt)}</div>
                        {itemId && payment.purpose !== 'TIP' && (
                          <Link to={`/tracks/${itemId}`} className="text-sm text-primary hover:underline">
                            View track
                          </Link>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {payment.currency ?? 'ZMW'} {Number.isFinite(amount) ? amount.toFixed(2) : payment.amount}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
