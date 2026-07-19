import { formatDuration } from '@/lib/format-duration';
import { cn } from '@/lib/utils';
import { MediaCard, MediaCardContent, MediaCardCover } from '@/components/ui/MediaCard';

export type TrackCardData = {
  id: string;
  title: string;
  artistName?: string;
  coverArtUrl?: string | null;
  duration?: number;
  price?: number | null;
  minPrice?: number | null;
  pricingType?: string;
};

type TrackCardProps = {
  track: TrackCardData;
  className?: string;
};

export function TrackCard({ track, className }: TrackCardProps) {
  const priceLabel =
    track.pricingType === 'FREE'
      ? 'Free'
      : track.pricingType === 'PAY_WHAT_YOU_WANT'
        ? `PWYW from ZMW ${track.minPrice ?? 0}`
        : track.price != null
          ? `ZMW ${track.price}`
          : '';

  return (
    <MediaCard to={`/tracks/${track.id}`} className={cn('h-full', className)}>
      <MediaCardCover coverArtUrl={track.coverArtUrl} />
      <MediaCardContent>
        <div className="line-clamp-2 text-base font-semibold text-foreground">{track.title}</div>
        {track.artistName && (
          <div className="text-sm text-muted-foreground">{track.artistName}</div>
        )}
        <div className="mt-1 flex items-center justify-between gap-2 text-sm">
          {track.duration != null && track.duration > 0 ? (
            <span className="text-muted-foreground/80">{formatDuration(track.duration)}</span>
          ) : (
            <span />
          )}
          {priceLabel && <span className="font-medium text-foreground">{priceLabel}</span>}
        </div>
      </MediaCardContent>
    </MediaCard>
  );
}
