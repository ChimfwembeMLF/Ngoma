import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';
import { parseAudioDuration } from './audio-metadata.util';
import { S3StorageService } from './s3-storage.service';

const MAX_AUDIO_BYTES = 50 * 1024 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

export type SaveAudioResult = {
  url: string;
  duration: number | null;
};

export type SaveVideoResult = {
  url: string;
  duration: number | null;
};

export type MediaReadResult = {
  stream: Readable;
  contentType: string;
};

@Injectable()
export class MediaService {
  private readonly uploadRoot: string;

  constructor(
    private readonly config: ConfigService,
    private readonly s3: S3StorageService,
  ) {
    this.uploadRoot = this.config.get<string>('UPLOAD_DIR') || join(process.cwd(), 'uploads');
  }

  usesS3(): boolean {
    return this.s3.isEnabled();
  }

  async saveAudio(file: Express.Multer.File): Promise<SaveAudioResult> {
    if (!file?.buffer?.length) throw new BadRequestException('Audio file is required');
    if (file.size > MAX_AUDIO_BYTES) {
      throw new BadRequestException('Audio file exceeds 50 MB limit');
    }
    const allowed = ['.mp3', '.wav', '.flac', '.m4a'];
    const ext = extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      throw new BadRequestException('Unsupported audio format');
    }
    const duration = await parseAudioDuration(file.buffer);
    const url = await this.saveFile('tracks', file, ext);
    return { url, duration };
  }

  async saveImage(file: Express.Multer.File): Promise<string> {
    if (!file?.buffer?.length) throw new BadRequestException('Image file is required');
    if (file.size > MAX_IMAGE_BYTES) {
      throw new BadRequestException('Image file exceeds 5 MB limit');
    }
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    const ext = extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      throw new BadRequestException('Unsupported image format');
    }
    return this.saveFile('images', file, ext);
  }

  async saveVideo(file: Express.Multer.File): Promise<SaveVideoResult> {
    if (!file?.buffer?.length) throw new BadRequestException('Video file is required');
    if (file.size > MAX_VIDEO_BYTES) {
      throw new BadRequestException('Video file exceeds 200 MB limit');
    }
    const allowed = ['.mp4', '.webm'];
    const ext = extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      throw new BadRequestException('Unsupported video format');
    }
    const url = await this.saveFile('videos', file, ext);
    return { url, duration: null };
  }

  resolvePath(publicUrl: string): string {
    const relative = publicUrl.replace(/^\/uploads\//, '');
    return join(this.uploadRoot, relative);
  }

  async openReadStream(publicUrl: string, contentType?: string): Promise<MediaReadResult> {
    if (this.s3.isS3Url(publicUrl)) {
      const key = this.s3.pathFromPublicUrl(publicUrl);
      if (!key) throw new NotFoundException('File not found');
      const buffer = await this.s3.downloadBuffer(key);
      const ext = this.s3.extFromUrl(publicUrl);
      return {
        stream: Readable.from(buffer),
        contentType: contentType || this.s3.contentTypeFromExt(ext),
      };
    }

    const path = this.resolvePath(publicUrl);
    if (!existsSync(path)) throw new NotFoundException('File not found');
    const ext = extname(path);
    return {
      stream: createReadStream(path),
      contentType: contentType || this.s3.contentTypeFromExt(ext),
    };
  }

  private async saveFile(folder: string, file: Express.Multer.File, ext: string): Promise<string> {
    if (this.s3.isEnabled()) {
      const uploaded = await this.s3.uploadBuffer({
        folder,
        buffer: file.buffer,
        contentType: file.mimetype || this.s3.contentTypeFromExt(ext),
        ext,
      });
      return uploaded.publicUrl;
    }

    const dir = join(this.uploadRoot, folder);
    await mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}${ext}`;
    await writeFile(join(dir, filename), file.buffer);
    return `/uploads/${folder}/${filename}`;
  }
}
