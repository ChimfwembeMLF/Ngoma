import { parseBuffer } from 'music-metadata';

export async function parseAudioDuration(buffer: Buffer): Promise<number | null> {
  if (!buffer?.length) return null;
  try {
    const metadata = await parseBuffer(buffer, undefined, { duration: true });
    const seconds = metadata.format.duration;
    if (seconds == null || !Number.isFinite(seconds)) return null;
    return Math.max(1, Math.round(seconds));
  } catch {
    return null;
  }
}
