import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { MediaCard, MediaCardContent, MediaCardCover } from '@/components/ui/MediaCard';

export type PlaylistCardProps = {
  name: string;
  trackCount: number;
  coverArtUrl?: string | null;
  href: string;
  badge?: ReactNode;
  subtitle?: string;
  className?: string;
};

export function PlaylistCard({
  name,
  trackCount,
  coverArtUrl,
  href,
  badge,
  subtitle,
  className,
}: PlaylistCardProps) {
  const trackLabel = `${trackCount} ${trackCount === 1 ? 'track' : 'tracks'}`;

  return (
    <MediaCard to={href} className={cn('h-full', className)}>
      <MediaCardCover coverArtUrl={coverArtUrl} />
      <MediaCardContent>
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-base font-semibold text-foreground">{name}</h3>
          {badge}
        </div>
        {subtitle && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{subtitle}</p>}
        <p className={cn('text-sm text-muted-foreground', subtitle ? 'mt-2' : 'mt-1')}>
          {trackLabel}
        </p>
      </MediaCardContent>
    </MediaCard>
  );
}
