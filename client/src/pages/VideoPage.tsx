import { Link, useParams } from 'react-router-dom';
import { useVideo } from '@/hooks/useVideos';
import { formatDuration } from '@/lib/format-duration';
import { AppShell } from '@/components/layout/AppShell';
import { buttonVariants } from '@/components/ui/button';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

function getEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, '').replace(/^m\./, '');

    if (hostname === 'youtube.com' || hostname === 'youtu.be') {
      let videoId = '';
      if (hostname === 'youtu.be') {
        videoId = parsedUrl.pathname.slice(1);
      } else if (parsedUrl.pathname === '/watch') {
        videoId = parsedUrl.searchParams.get('v') || '';
      } else if (parsedUrl.pathname.startsWith('/embed/')) {
        return url; // Already an embed URL
      } else if (parsedUrl.pathname.startsWith('/shorts/')) {
        videoId = parsedUrl.pathname.split('/')[2] || '';
      }
      
      // Handle URLs like https://youtube.com/v/1234
      if (!videoId && parsedUrl.pathname.startsWith('/v/')) {
        videoId = parsedUrl.pathname.split('/')[2] || '';
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    } else if (hostname === 'vimeo.com') {
      const match = parsedUrl.pathname.match(/^\/(\d+)/);
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
      }
    }
    
    // Default return the original url to use in iframe
    return url;
  } catch {
    return url;
  }
}

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
          {video.videoFileUrl || !video.externalUrl ? (
            <video
              controls
              playsInline
              poster={video.thumbnailUrl ?? undefined}
              className="aspect-video min-h-[200px] w-full"
              src={streamUrl}
            />
          ) : (
            <iframe
              src={getEmbedUrl(video.externalUrl)}
              className="aspect-video min-h-[200px] w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          )}
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
