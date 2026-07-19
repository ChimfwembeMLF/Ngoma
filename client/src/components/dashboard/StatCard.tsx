import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StatCardProps = {
  label: string;
  value: string;
  subtext?: string;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function StatCard({ label, value, subtext, isLoading, className, children }: StatCardProps) {
  if (isLoading) {
    return (
      <Card size="sm" className={className}>
        <CardContent>
          <div className="h-4 w-24 animate-pulse rounded bg-border" />
          <div className="mt-2 h-7 w-20 animate-pulse rounded bg-border" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card size="sm" className={cn('flex flex-col', className)}>
      <CardContent className="flex flex-col">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 flex flex-wrap items-baseline gap-2">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {children}
        </div>
        {subtext && <div className="mt-1 text-xs text-muted-foreground">{subtext}</div>}
      </CardContent>
    </Card>
  );
}
