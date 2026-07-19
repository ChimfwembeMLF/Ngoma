import { Card, CardContent } from '@/components/ui/card';
import type { TrackAnalyticsRow } from '@/hooks/useAnalytics';

function formatZmw(value: number): string {
  return `ZMW ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

type TrackEarningsTableProps = {
  tracks: TrackAnalyticsRow[];
};

export function TrackEarningsTable({ tracks }: TrackEarningsTableProps) {
  if (tracks.length === 0) {
    return <p className="text-sm text-muted-foreground">No track data yet.</p>;
  }

  return (
    <Card size="sm" className="overflow-x-auto">
      <CardContent>
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2 pr-4 font-medium">Track</th>
              <th className="pb-2 px-4 text-right font-medium">Plays</th>
              <th className="pb-2 px-4 text-right font-medium">Downloads</th>
              <th className="pb-2 pl-4 text-right font-medium">Net earnings</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track) => (
              <tr key={track.trackId} className="border-b border-border last:border-0">
                <td className="py-3 pr-4 font-medium text-foreground">{track.title}</td>
                <td className="py-3 px-4 text-right text-muted-foreground">
                  {track.plays.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right text-muted-foreground">
                  {track.downloads.toLocaleString()}
                </td>
                <td className="py-3 pl-4 text-right text-foreground">{formatZmw(track.netEarnings)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
