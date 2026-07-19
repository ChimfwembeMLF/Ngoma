import { Card } from '../ui/Card';
import type { TrackAnalyticsRow } from '../../hooks/useAnalytics';

function formatZmw(value: number): string {
  return `ZMW ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

type TrackEarningsTableProps = {
  tracks: TrackAnalyticsRow[];
};

export function TrackEarningsTable({ tracks }: TrackEarningsTableProps) {
  if (tracks.length === 0) {
    return <p className="text-sm text-muted">No track data yet.</p>;
  }

  return (
    <Card padding="sm" className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-hairline text-left text-muted">
            <th className="pb-2 pr-4 font-medium">Track</th>
            <th className="pb-2 px-4 text-right font-medium">Plays</th>
            <th className="pb-2 px-4 text-right font-medium">Downloads</th>
            <th className="pb-2 pl-4 text-right font-medium">Net earnings</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track) => (
            <tr key={track.trackId} className="border-b border-hairline last:border-0">
              <td className="py-3 pr-4 font-medium text-ink">{track.title}</td>
              <td className="py-3 px-4 text-right text-muted">
                {track.plays.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right text-muted">
                {track.downloads.toLocaleString()}
              </td>
              <td className="py-3 pl-4 text-right text-ink">{formatZmw(track.netEarnings)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
