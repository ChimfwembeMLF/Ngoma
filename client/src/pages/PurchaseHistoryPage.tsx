import { usePaymentHistory } from '../hooks/usePayments';

export function PurchaseHistoryPage() {
  const { data, isLoading } = usePaymentHistory();
  const payments = data?.data ?? [];

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-cream mb-6">Purchase history</h1>
      {isLoading && <p className="text-cream/70">Loading...</p>}
      <ul className="space-y-3">
        {payments.map((p) => (
          <li
            key={String(p.id)}
            className="rounded-lg border border-indigo-800/40 bg-indigo-950/20 px-4 py-3 flex justify-between"
          >
            <div>
              <div className="text-cream font-medium">Track purchase</div>
              <div className="text-sm text-cream/60">{String(p.createdAt ?? '')}</div>
            </div>
            <div className="text-right">
              <div className="text-terracotta">
                {String(p.currency)} {String(p.amount)}
              </div>
              <div className="text-sm text-cream/60">{String(p.status)}</div>
            </div>
          </li>
        ))}
      </ul>
      {!isLoading && payments.length === 0 && (
        <p className="text-cream/60">No purchases yet.</p>
      )}
    </div>
  );
}
