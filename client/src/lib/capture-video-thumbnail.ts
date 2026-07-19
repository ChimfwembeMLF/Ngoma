type CaptureOptions = {
  seekSeconds?: number;
  maxWidth?: number;
};

export async function captureVideoThumbnail(
  videoFile: File,
  options: CaptureOptions = {},
): Promise<File> {
  const seekSeconds = options.seekSeconds ?? 1;
  const maxWidth = options.maxWidth ?? 640;
  const url = URL.createObjectURL(videoFile);

  try {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error('Could not load video for thumbnail'));
    });

    const duration = video.duration;
    const seekTo =
      Number.isFinite(duration) && duration > 0
        ? Math.min(Math.max(duration * 0.1, 0.1), duration - 0.1)
        : seekSeconds;
    video.currentTime = seekTo;

    await new Promise<void>((resolve, reject) => {
      video.onseeked = () => resolve();
      video.onerror = () => reject(new Error('Could not seek video for thumbnail'));
    });

    const scale = video.videoWidth > 0 ? Math.min(1, maxWidth / video.videoWidth) : 1;
    const width = Math.max(1, Math.round(video.videoWidth * scale));
    const height = Math.max(1, Math.round(video.videoHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create thumbnail');

    ctx.drawImage(video, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('Could not encode thumbnail'))),
        'image/jpeg',
        0.85,
      );
    });

    const baseName = videoFile.name.replace(/\.[^.]+$/, '') || 'video';
    return new File([blob], `${baseName}-thumbnail.jpg`, { type: 'image/jpeg' });
  } finally {
    URL.revokeObjectURL(url);
  }
}
