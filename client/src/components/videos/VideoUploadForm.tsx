import { useEffect, useState } from 'react';
import {
  useCreateVideo,
  useUploadVideoFiles,
  useUpdateVideo,
} from '@/hooks/useVideos';
import { captureVideoThumbnail } from '@/lib/capture-video-thumbnail';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FormWizard } from '@/components/forms';

const MAX_VIDEO_BYTES = 200 * 1024 * 1024;
const ACCEPTED_VIDEO = 'video/mp4,video/webm,.mp4,.webm';

export function VideoUploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const createVideo = useCreateVideo();
  const uploadFiles = useUploadVideoFiles();
  const updateVideo = useUpdateVideo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailSource, setThumbnailSource] = useState<'auto' | 'custom' | null>(null);
  const [thumbnailGenerating, setThumbnailGenerating] = useState(false);
  const [error, setError] = useState('');
  const [stepError, setStepError] = useState('');

  const isPending =
    createVideo.isPending || uploadFiles.isPending || updateVideo.isPending;

  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const setThumbnailWithPreview = (file: File | null, source: 'auto' | 'custom' | null) => {
    setThumbnail(file);
    setThumbnailSource(source);
    setThumbnailPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const handleVideoSelect = async (file: File | null) => {
    setVideoFile(file);
    setStepError('');
    if (!file) {
      setThumbnailWithPreview(null, null);
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setStepError('Video must be 200 MB or smaller');
      return;
    }

    setThumbnailGenerating(true);
    try {
      const captured = await captureVideoThumbnail(file);
      setThumbnailWithPreview(captured, 'auto');
    } catch {
      setThumbnailWithPreview(null, null);
      setStepError('Could not generate thumbnail — upload a cover image below');
    } finally {
      setThumbnailGenerating(false);
    }
  };

  const handleThumbnailSelect = (file: File | null) => {
    if (file) {
      setThumbnailWithPreview(file, 'custom');
    } else if (videoFile) {
      void handleVideoSelect(videoFile);
    } else {
      setThumbnailWithPreview(null, null);
    }
  };

  const submit = async (publish: boolean) => {
    setError('');
    if (publish && videoFile && !thumbnail) {
      setError('Thumbnail is required — wait for auto-generation or upload a cover image');
      return;
    }
    try {
      const result = await createVideo.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      const videoId = result.data.id;
      if (videoFile || thumbnail) {
        await uploadFiles.mutateAsync({
          id: videoId,
          video: videoFile ?? undefined,
          thumbnail: thumbnail ?? undefined,
        });
      }
      if (publish) {
        await updateVideo.mutateAsync({ id: videoId, isPublished: true });
      }
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailWithPreview(null, null);
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    }
  };

  const steps = [
    {
      id: 'details',
      label: 'Details',
      validate: () => {
        if (!title.trim()) {
          setStepError('Video title is required');
          return false;
        }
        setStepError('');
        return true;
      },
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-title">Title</Label>
            <Input
              id="video-title"
              placeholder="Video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-description">Description (optional)</Label>
            <Textarea
              id="video-description"
              placeholder="Tell fans about this video"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'video',
      label: 'Video file',
      validate: () => {
        if (videoFile && videoFile.size > MAX_VIDEO_BYTES) {
          setStepError('Video must be 200 MB or smaller');
          return false;
        }
        if (videoFile && thumbnailGenerating) {
          setStepError('Generating thumbnail…');
          return false;
        }
        setStepError('');
        return true;
      },
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-file">Video (MP4 or WebM, max 200 MB)</Label>
            <Input
              id="video-file"
              type="file"
              accept={ACCEPTED_VIDEO}
              onChange={(e) => void handleVideoSelect(e.target.files?.[0] ?? null)}
              className="text-sm text-muted-foreground file:mr-3 file:rounded-sm file:border file:border-border file:bg-muted file:px-3 file:py-2 file:text-sm file:text-foreground"
            />
            {videoFile && (
              <p className="text-sm text-muted-foreground">Selected: {videoFile.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-thumbnail">Cover image</Label>
            <p className="text-xs text-muted-foreground">
              A thumbnail is captured automatically from your video. Upload a custom image to
              override it.
            </p>
            {thumbnailGenerating && (
              <p className="text-sm text-muted-foreground">Generating thumbnail…</p>
            )}
            {thumbnailPreview && !thumbnailGenerating && (
              <div className="overflow-hidden rounded-md border border-border bg-muted">
                <img
                  src={thumbnailPreview}
                  alt="Video thumbnail preview"
                  className="aspect-video w-full max-w-xs object-cover"
                />
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  {thumbnailSource === 'custom' ? 'Custom cover' : 'Auto-generated from video'}
                </p>
              </div>
            )}
            <Input
              id="video-thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => handleThumbnailSelect(e.target.files?.[0] ?? null)}
              className="text-sm text-muted-foreground file:mr-3 file:rounded-sm file:border file:border-border file:bg-muted file:px-3 file:py-2 file:text-sm file:text-foreground"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'review',
      label: 'Publish',
      content: (
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Title</dt>
            <dd className="font-medium text-foreground">{title}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Description</dt>
            <dd className="max-w-[60%] text-right font-medium text-foreground">
              {description.trim() || '—'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Video</dt>
            <dd className="font-medium text-foreground">{videoFile?.name ?? 'None selected'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Thumbnail</dt>
            <dd className="font-medium text-foreground">
              {thumbnailGenerating
                ? 'Generating…'
                : thumbnail
                  ? thumbnailSource === 'custom'
                    ? 'Custom image'
                    : 'Auto-generated'
                  : 'None'}
            </dd>
          </div>
        </dl>
      ),
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-base font-semibold text-foreground">Upload video</h3>
      {(error || stepError) && (
        <p className="mb-4 text-sm text-destructive">{error || stepError}</p>
      )}
      <FormWizard
        steps={steps}
        isSubmitting={isPending}
        finalActions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => submit(false)}
              disabled={!title.trim() || isPending || thumbnailGenerating}
            >
              Save draft
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={() => {
                if (!videoFile) {
                  setStepError('Video file is required to publish');
                  return;
                }
                if (thumbnailGenerating) {
                  setStepError('Wait for thumbnail generation to finish');
                  return;
                }
                if (!thumbnail) {
                  setStepError('Thumbnail is required — upload a cover image');
                  return;
                }
                submit(true);
              }}
              disabled={
                !title.trim() || !videoFile || !thumbnail || isPending || thumbnailGenerating
              }
            >
              Publish
            </Button>
          </>
        }
      />
    </Card>
  );
}
