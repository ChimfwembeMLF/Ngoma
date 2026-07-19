import { StatCard } from '@/components/dashboard/StatCard';
import { TrendBadge } from '@/components/dashboard/TrendBadge';
import { Card } from '@/components/ui/card';
import type { AnalyticsSummary, ArtistTrends, TipsSummary } from '@/hooks/useAnalytics';

function formatZmw(value: number): string {
  return `ZMW ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatInteger(value: number): string {
  return value.toLocaleString();
}

type AnalyticsSummaryCardsProps = {
  summary?: AnalyticsSummary;
  trends?: ArtistTrends;
  tips?: TipsSummary;
  isLoading?: boolean;
  error?: Error | null;
};

export function AnalyticsSummaryCards({
  summary,
  trends,
  tips,
  isLoading,
  error,
}: AnalyticsSummaryCardsProps) {
  if (error) {
    return (
      <Card className="p-6 text-destructive">
        <p className="text-sm">Could not load analytics: {error.message}</p>
      </Card>
    );
  }

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <StatCard key={index} label="" value="" isLoading />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Net earnings',
      value: formatZmw(summary.totalNetEarnings),
      trend: trends?.netEarnings,
    },
    {
      label: 'Plays',
      value: formatInteger(summary.totalPlays),
      trend: trends?.plays,
    },
    {
      label: 'Downloads',
      value: formatInteger(summary.totalDownloads),
      trend: trends?.downloads,
    },
    {
      label: 'Supporters',
      value: formatInteger(summary.uniqueSupporters),
    },
    {
      label: 'Tips received',
      value: tips ? formatZmw(tips.totalAmount) : formatZmw(0),
      subtext: tips ? `${tips.count} tips` : undefined,
    },
    {
      label: 'Published tracks',
      value: formatInteger(summary.publishedTrackCount),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <StatCard key={card.label} label={card.label} value={card.value} subtext={card.subtext}>
          {card.trend && <TrendBadge trend={card.trend} />}
        </StatCard>
      ))}
    </div>
  );
}
