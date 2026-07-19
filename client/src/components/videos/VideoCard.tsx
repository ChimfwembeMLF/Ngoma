import { formatDuration } from '@/lib/format-duration';
import { cn } from '@/lib/utils';
import { MediaCard, MediaCardContent } from '@/components/ui/MediaCard';
import type { Video } from '@/hooks/useVideos';

type VideoCardProps = {
  video: Pick<Video, 'id' | 'title' | 'artistName' | 'thumbnailUrl' | 'duration'>;
  className?: string;
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

export function VideoCard({ video, className }: VideoCardProps) {
  return (
    <MediaCard to={`/videos/${video.id}`} className={cn('h-full', className)}>
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <VideoCoverPlaceholder />
        )}
      </div>
      <MediaCardContent>
        <div className="line-clamp-2 text-base font-semibold text-foreground">{video.title}</div>
        {video.artistName && (
          <div className="text-sm text-muted-foreground">{video.artistName}</div>
        )}
        {video.duration != null && video.duration > 0 && (
          <div className="mt-1 text-sm text-muted-foreground/80">
            {formatDuration(video.duration)}
          </div>
        )}
      </MediaCardContent>
    </MediaCard>
  );
}
