import { Card, CardContent } from '@/components/ui/card';

export type ActivityItem = {
  id: string;
  type: 'USER_REGISTERED' | 'TRACK_PUBLISHED' | 'PAYMENT_COMPLETED';
  label: string;
  occurredAt: string;
};

type ActivityFeedProps = {
  items: ActivityItem[];
  isLoading?: boolean;
  emptyMessage?: string;
};

function formatWhen(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function ActivityFeed({
  items,
  isLoading,
  emptyMessage = 'No recent activity.',
}: ActivityFeedProps) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading activity…</p>;
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <Card size="sm">
            <CardContent>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-foreground">{item.label}</span>
                <time className="text-xs text-muted-foreground">{formatWhen(item.occurredAt)}</time>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
