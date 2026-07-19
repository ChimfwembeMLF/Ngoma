import { Link, useParams } from 'react-router-dom';
import { useVideo } from '@/hooks/useVideos';
import { formatDuration } from '@/lib/format-duration';
import { AppShell } from '@/components/layout/AppShell';
import { buttonVariants } from '@/components/ui/button';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

export function VideoPage() {
  const { id = '' } = useParams();
  const { data, isLoading } = useVideo(id);
  const video = data?.data;

  if (isLoading) {
    return (
      <AppShell maxWidth="2xl">
        <p className="text-muted-foreground">Loading…</p>
      </AppShell>
    );
  }

  if (!video) {
    return (
      <AppShell maxWidth="2xl">
        <p className="text-muted-foreground">Video not found</p>
      </AppShell>
    );
  }

  const streamUrl = `${baseUrl}/api/v1/videos/${video.id}/stream`;

  return (
    <AppShell maxWidth="2xl">
      <div className="space-y-6">
        <Link
          to="/discover"
          className={buttonVariants({
            variant: 'ghost',
            className: 'px-0 text-sm text-muted-foreground hover:text-foreground',
          })}
        >
          ← Back to discover
        </Link>

        <div className="overflow-hidden rounded-md bg-black">
          <video
            controls
            playsInline
            poster={video.thumbnailUrl ?? undefined}
            className="aspect-video min-h-[200px] w-full"
            src={streamUrl}
          />
        </div>

        <div>
          <h1 className="text-[22px] font-medium leading-tight text-foreground">{video.title}</h1>
          {video.artistName && video.artistId && (
            <Link
              to={`/tip/${video.artistId}`}
              className="mt-1 inline-block text-base text-muted-foreground hover:text-foreground"
            >
              {video.artistName}
            </Link>
          )}
          {video.duration != null && video.duration > 0 && (
            <p className="mt-1 text-sm text-muted-foreground/80">
              {formatDuration(video.duration)}
            </p>
          )}
          {video.description && (
            <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
