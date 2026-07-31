import { formatDuration } from '@/lib/format-duration';
import { cn, getProxiedImageUrl } from '@/lib/utils';
import { MediaCard, MediaCardContent } from '@/components/ui/MediaCard';
import type { Video } from '@/hooks/useVideos';

type VideoCardProps = {
  video: Pick<Video, 'id' | 'title' | 'artistName' | 'thumbnailUrl' | 'duration' | 'description'>;
  className?: string;
  layout?: 'vertical' | 'horizontal';
};

function VideoCoverPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center text-muted-foreground/80">
      <span aria-hidden className="text-3xl">
        ▶
      </span>
    </div>
  );
}

export function VideoCard({ video, className, layout = 'vertical' }: VideoCardProps) {
  const proxiedUrl = getProxiedImageUrl(video.thumbnailUrl);
  const isHorizontal = layout === 'horizontal';

  return (
    <MediaCard to={`/videos/${video.id}`} className={cn(isHorizontal ? 'flex items-start' : 'h-full', className)}>
      <div className={cn('relative shrink-0 overflow-hidden bg-muted', isHorizontal ? 'w-40 sm:w-56 aspect-video' : 'aspect-video w-full')}>
        {proxiedUrl ? (
          <img
            src={proxiedUrl}
            alt=""
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <VideoCoverPlaceholder />
        )}
      </div>
      <MediaCardContent className={cn(isHorizontal && 'flex flex-col justify-start p-3 sm:p-4')}>
        <div className="line-clamp-2 text-base font-semibold text-foreground">{video.title}</div>
        {video.artistName && (
          <div className="mt-1 text-sm text-foreground/90">{video.artistName}</div>
        )}
        {video.duration != null && video.duration > 0 && (
          <div className="mt-1 text-xs text-muted-foreground/80">
            {formatDuration(video.duration)}
          </div>
        )}
        {video.description && (
          <div className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {video.description}
          </div>
        )}
      </MediaCardContent>
    </MediaCard>
  );
}
