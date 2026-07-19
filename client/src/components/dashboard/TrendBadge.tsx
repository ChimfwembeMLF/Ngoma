import { cn } from '@/lib/utils';

export type MetricTrend = {
  current: number;
  previous: number;
  changePercent: number | null;
};

type TrendBadgeProps = {
  trend?: MetricTrend | null;
  className?: string;
};

export function TrendBadge({ trend, className }: TrendBadgeProps) {
  if (!trend || trend.changePercent == null) {
    return null;
  }

  const positive = trend.changePercent > 0;
  const negative = trend.changePercent < 0;
  const absValue = Math.abs(trend.changePercent).toFixed(1);

  return (
    <span
      className={cn(
        'text-xs font-medium',
        positive && 'text-primary',
        negative && 'text-muted-foreground',
        !positive && !negative && 'text-muted-foreground',
        className,
      )}
    >
      {positive ? '▲' : negative ? '▼' : '—'} {absValue}%
    </span>
  );
}
