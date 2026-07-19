import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MiniBarChart } from '@/components/dashboard/MiniBarChart';
import { useEarningsTimeline } from '@/hooks/useAnalytics';
import { cn } from '@/lib/utils';

function formatZmw(value: number): string {
  return `ZMW ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const DAY_OPTIONS = [7, 30, 90] as const;

function formatBucketLabel(date: string, days: number): string {
  if (days <= 7) return date.slice(5);
  return date.slice(8);
}

export function EarningsTimeline() {
  const [days, setDays] = useState<number>(30);
  const { data, isLoading, error } = useEarningsTimeline(days);
  const timeline = data?.data;

  if (error) {
    return (
      <Card className="text-destructive">
        <CardContent>
          <p className="text-sm">Could not load earnings timeline: {(error as Error).message}</p>
        </CardContent>
      </Card>
    );
  }

  const buckets = timeline?.buckets ?? [];
  const chartBuckets = buckets.map((bucket) => ({
    label: formatBucketLabel(bucket.date, days),
    value: bucket.netEarnings,
  }));

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
          <CardContent>
            <MiniBarChart buckets={chartBuckets} formatValue={formatZmw} />
            {timeline && (
              <p className="mt-4 text-sm text-muted-foreground">
                Total for period: {formatZmw(timeline.totalNetEarnings)}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
}
