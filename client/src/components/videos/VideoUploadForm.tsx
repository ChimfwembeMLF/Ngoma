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
import { FileUploadZone } from '@/components/ui/file-upload-zone';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MAX_VIDEO_BYTES = 200 * 1024 * 1024;
const ACCEPTED_VIDEO = 'video/mp4,video/webm,.mp4,.webm';

export function VideoUploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const createVideo = useCreateVideo();
  const uploadFiles = useUploadVideoFiles();
  const updateVideo = useUpdateVideo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [sourceType, setSourceType] = useState<'upload' | 'link'>('upload');
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
    } else if (videoFile && sourceType === 'upload') {
      void handleVideoSelect(videoFile);
    } else {
      setThumbnailWithPreview(null, null);
    }
  };

  const submit = async (publish: boolean) => {
    setError('');
    
    // Check thumbnail if publishing (but only required if uploading, or if they just want a thumbnail anyway)
    if (publish && sourceType === 'upload' && !thumbnail) {
      setError('Thumbnail is required — wait for auto-generation or upload a cover image');
      return;
    }

    try {
      const result = await createVideo.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      const videoId = result.data.id;
      
      if (sourceType === 'upload' && (videoFile || thumbnail)) {
        await uploadFiles.mutateAsync({
          id: videoId,
          video: videoFile ?? undefined,
          thumbnail: thumbnail ?? undefined,
        });
      } else if (sourceType === 'link' && thumbnail) {
        // Upload just the thumbnail if provided for a link
        await uploadFiles.mutateAsync({
          id: videoId,
          thumbnail: thumbnail,
        });
      }
      
      // Update with external URL if link mode
      const isExtUrlMode = sourceType === 'link' && externalUrl.trim();
      
      if (publish || isExtUrlMode) {
        await updateVideo.mutateAsync({ 
          id: videoId, 
          isPublished: publish ? true : undefined,
          externalUrl: isExtUrlMode ? externalUrl.trim() : undefined,
        });
      }
      
      setTitle('');
      setDescription('');
      setExternalUrl('');
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
      label: 'Video source',
      validate: () => {
        if (sourceType === 'upload') {
          if (videoFile && videoFile.size > MAX_VIDEO_BYTES) {
            setStepError('Video must be 200 MB or smaller');
            return false;
          }
          if (videoFile && thumbnailGenerating) {
            setStepError('Generating thumbnail…');
            return false;
          }
        } else {
          if (!externalUrl.trim()) {
            setStepError('External link is required');
            return false;
          }
          try {
            new URL(externalUrl);
          } catch {
            setStepError('Must be a valid URL');
            return false;
          }
        }
        setStepError('');
        return true;
      },
      content: (
        <div className="space-y-6">
          <Tabs value={sourceType} onValueChange={(v) => setSourceType(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Video</TabsTrigger>
              <TabsTrigger value="link">External Link</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="video-file">Video (MP4 or WebM, max 200 MB)</Label>
                <FileUploadZone
                  id="video-file"
                  accept={ACCEPTED_VIDEO}
                  selectedFile={videoFile}
                  onFileSelect={(file) => void handleVideoSelect(file)}
                  label="Click or drag video file"
                  description="MP4, WebM up to 200MB"
                  maxSize={MAX_VIDEO_BYTES}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="link" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="video-url">External URL (e.g. YouTube, Vimeo)</Label>
                <Input
                  id="video-url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Provide a link to a video hosted on an external site.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="video-thumbnail">Cover image</Label>
            <p className="text-xs text-muted-foreground">
              {sourceType === 'upload' 
                ? 'A thumbnail is captured automatically from your video. Upload a custom image to override it.'
                : 'Upload a cover image to display on Ngoma.'}
            </p>
            {thumbnailGenerating && (
              <p className="text-sm text-muted-foreground">Generating thumbnail…</p>
            )}
            {thumbnailPreview && !thumbnailGenerating && (
              <div className="overflow-hidden rounded-md border border-border bg-muted mb-2">
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
            <FileUploadZone
              id="video-thumbnail"
              accept="image/*"
              selectedFile={thumbnailSource === 'custom' ? thumbnail : null}
              onFileSelect={handleThumbnailSelect}
              label="Click or drag cover image"
              description="Upload a custom cover image"
              maxSize={10 * 1024 * 1024}
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
            <dt className="text-muted-foreground">Video Source</dt>
            <dd className="font-medium text-foreground">
              {sourceType === 'upload' ? (videoFile?.name ?? 'None selected') : (externalUrl || 'No link')}
            </dd>
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
                if (sourceType === 'upload' && !videoFile) {
                  setStepError('Video file is required to publish');
                  return;
                }
                if (sourceType === 'link' && !externalUrl.trim()) {
                  setStepError('External link is required to publish');
                  return;
                }
                if (thumbnailGenerating) {
                  setStepError('Wait for thumbnail generation to finish');
                  return;
                }
                if (sourceType === 'upload' && !thumbnail) {
                  setStepError('Thumbnail is required — upload a cover image');
                  return;
                }
                submit(true);
              }}
              disabled={
                !title.trim() || (sourceType === 'upload' && (!videoFile || !thumbnail)) || (sourceType === 'link' && !externalUrl.trim()) || isPending || thumbnailGenerating
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
