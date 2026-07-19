import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useEarningsTimeline } from '@/hooks/useAnalytics';
import { cn } from '@/lib/utils';

function formatZmw(value: number): string {
  return `ZMW ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const DAY_OPTIONS = [7, 30, 90] as const;

export function EarningsTimeline() {
  const [days, setDays] = useState<number>(30);
  const { data, isLoading, error } = useEarningsTimeline(days);
  const timeline = data?.data;

  if (error) {
    return (
      <Card className="p-6 text-destructive">
        <p className="text-sm">Could not load earnings timeline: {(error as Error).message}</p>
      </Card>
    );
  }

  const buckets = timeline?.buckets ?? [];
  const maxValue = Math.max(...buckets.map((bucket) => bucket.netEarnings), 0);

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-foreground">Earnings (last {days} days)</h2>
        <div className="flex gap-2">
          {DAY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setDays(option)}
              className={cn(
                'rounded-md border px-3 py-1 text-sm',
                days === option
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {option}d
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading timeline…</p>}

      {!isLoading && buckets.length === 0 && (
        <p className="text-sm text-muted-foreground">No earnings in this period.</p>
      )}

      {!isLoading && buckets.length > 0 && (
        <Card size="sm">
          <ul className="space-y-2">
            {buckets.map((bucket) => {
              const width = maxValue > 0 ? (bucket.netEarnings / maxValue) * 100 : 0;
              return (
                <li key={bucket.date} className="grid grid-cols-[88px_1fr_96px] items-center gap-3">
                  <span className="text-xs text-muted-foreground">{bucket.date}</span>
                  <div className="h-2 rounded bg-border">
                    <div
                      className="h-2 rounded bg-primary"
                      style={{ width: `${Math.max(width, bucket.netEarnings > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                  <span className="text-right text-sm text-foreground">{formatZmw(bucket.netEarnings)}</span>
                </li>
              );
            })}
          </ul>
          {timeline && (
            <p className="mt-4 text-sm text-muted-foreground">
              Total for period: {formatZmw(timeline.totalNetEarnings)}
            </p>
          )}
        </Card>
      )}
    </section>
  );
}
