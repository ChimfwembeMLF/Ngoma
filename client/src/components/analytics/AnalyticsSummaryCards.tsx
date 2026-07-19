import { Card } from '../ui/Card';
import type { AnalyticsSummary } from '../../hooks/useAnalytics';

function formatZmw(value: number): string {
  return `ZMW ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatInteger(value: number): string {
  return value.toLocaleString();
}

type AnalyticsSummaryCardsProps = {
  summary?: AnalyticsSummary;
  isLoading?: boolean;
  error?: Error | null;
};

export function AnalyticsSummaryCards({ summary, isLoading, error }: AnalyticsSummaryCardsProps) {
  if (error) {
    return (
      <Card className="text-error">
        <p className="text-sm">Could not load analytics: {error.message}</p>
      </Card>
    );
  }

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} padding="sm">
            <div className="h-4 w-24 animate-pulse rounded bg-hairline" />
            <div className="mt-2 h-6 w-16 animate-pulse rounded bg-hairline" />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'Net earnings', value: formatZmw(summary.totalNetEarnings) },
    { label: 'Downloads', value: formatInteger(summary.totalDownloads) },
    { label: 'Plays', value: formatInteger(summary.totalPlays) },
    { label: 'Supporters', value: formatInteger(summary.uniqueSupporters) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} padding="sm">
          <div className="text-sm text-muted">{card.label}</div>
          <div className="mt-1 text-lg font-semibold text-ink">{card.value}</div>
        </Card>
      ))}
    </div>
  );
}
