import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type MediaCardProps = {
  to?: string;
  className?: string;
  children: ReactNode;
};

export function MediaCard({ to, className, children }: MediaCardProps) {
  const shellClass = cn(
    'group block overflow-hidden rounded-md border border-border bg-card p-0',
    'transition-shadow hover:shadow-lg hover:shadow-black/30',
    className,
  );

  if (to) {
    return (
      <Link to={to} className={shellClass}>
        {children}
      </Link>
    );
  }

  return <div className={shellClass}>{children}</div>;
}

type MediaCardCoverProps = {
  coverArtUrl?: string | null;
  className?: string;
};

export function MediaCardCover({ coverArtUrl, className }: MediaCardCoverProps) {
  return (
    <div className={cn('relative aspect-square w-full overflow-hidden bg-muted', className)}>
      {coverArtUrl ? (
        <img
          src={coverArtUrl}
          alt=""
          className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
        />
      ) : (
        <MediaCardCoverPlaceholder />
      )}
    </div>
  );
}

export function MediaCardCoverPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center text-muted-foreground/80">
      <span aria-hidden className="text-3xl">
        ♪
      </span>
    </div>
  );
}

type MediaCardContentProps = {
  className?: string;
  children: ReactNode;
};

export function MediaCardContent({ className, children }: MediaCardContentProps) {
  return <div className={cn('p-3', className)}>{children}</div>;
}
