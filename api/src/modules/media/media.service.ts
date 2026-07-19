import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';

const MAX_AUDIO_BYTES = 50 * 1024 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

@Injectable()
export class MediaService {
  private readonly uploadRoot: string;

  constructor(private readonly config: ConfigService) {
    this.uploadRoot = this.config.get<string>('UPLOAD_DIR') || join(process.cwd(), 'uploads');
  }

  async saveAudio(file: Express.Multer.File): Promise<string> {
    if (!file?.buffer?.length) throw new BadRequestException('Audio file is required');
    if (file.size > MAX_AUDIO_BYTES) {
      throw new BadRequestException('Audio file exceeds 50 MB limit');
    }
    const allowed = ['.mp3', '.wav', '.flac', '.m4a'];
    const ext = extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      throw new BadRequestException('Unsupported audio format');
    }
    return this.saveFile('tracks', file, ext);
  }

  async saveImage(file: Express.Multer.File): Promise<string> {
    if (!file?.buffer?.length) throw new BadRequestException('Image file is required');
    if (file.size > MAX_IMAGE_BYTES) {
      throw new BadRequestException('Image file exceeds 5 MB limit');
    }
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      throw new BadRequestException('Unsupported image format');
    }
    return this.saveFile('images', file, ext);
  }

  resolvePath(publicUrl: string): string {
    const relative = publicUrl.replace(/^\/uploads\//, '');
    return join(this.uploadRoot, relative);
  }

  private async saveFile(folder: string, file: Express.Multer.File, ext: string): Promise<string> {
    const dir = join(this.uploadRoot, folder);
    await mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}${ext}`;
    await writeFile(join(dir, filename), file.buffer);
    return `/uploads/${folder}/${filename}`;
  }
}
