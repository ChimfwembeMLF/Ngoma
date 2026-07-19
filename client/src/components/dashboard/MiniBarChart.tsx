import { cn } from '@/lib/utils';

export type MiniBarChartBucket = {
  label: string;
  value: number;
};

type MiniBarChartProps = {
  buckets: MiniBarChartBucket[];
  formatValue?: (value: number) => string;
  height?: number;
  className?: string;
};

export function MiniBarChart({
  buckets,
  formatValue = (n) => n.toLocaleString(),
  height = 160,
  className,
}: MiniBarChartProps) {
  const maxValue = Math.max(...buckets.map((bucket) => bucket.value), 0);

  if (buckets.length === 0) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className="flex items-end justify-between gap-1 sm:gap-2"
        style={{ minHeight: height }}
        role="img"
        aria-label="Bar chart"
      >
        {buckets.map((bucket) => {
          const ratio = maxValue > 0 ? bucket.value / maxValue : 0;
          const barHeight = bucket.value > 0 ? Math.max(ratio * (height - 24), 2) : 2;

          return (
            <div
              key={bucket.label}
              className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
              title={`${bucket.label}: ${formatValue(bucket.value)}`}
            >
              <div
                className="w-full max-w-8 rounded-t bg-primary"
                style={{ height: barHeight }}
              />
              <span className="max-w-full truncate text-[10px] text-muted-foreground sm:text-xs">
                {bucket.label.length > 6 ? bucket.label.slice(5) : bucket.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
