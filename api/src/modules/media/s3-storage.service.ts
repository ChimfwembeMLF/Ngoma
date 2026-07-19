import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import {
  getS3Key,
  getS3PublicUrl,
  isS3Configured,
  resolveS3Bucket,
} from '../../common/storage.config';

export type StorageUploadResult = {
  publicUrl: string;
  storagePath: string;
};

@Injectable()
export class S3StorageService {
  private readonly logger = new Logger(S3StorageService.name);
  private client: S3Client | null = null;

  constructor(private readonly config: ConfigService) {}

  isEnabled(): boolean {
    return isS3Configured(this.config);
  }

  assertConfigured(): void {
    if (!this.isEnabled()) {
      throw new ServiceUnavailableException(
        'S3 storage is not configured. Set AWS_S3_BUCKET_NAME_DEV/PROD (or AWS_S3_BUCKET_NAME), AWS_S3_BUCKET_NAME_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY.',
      );
    }
  }

  get bucket(): string {
    const bucket = resolveS3Bucket(this.config);
    if (!bucket) {
      throw new ServiceUnavailableException('S3 bucket is not configured');
    }
    return bucket;
  }

  isS3Url(url: string): boolean {
    if (!url || !this.isEnabled()) return false;
    try {
      getS3Key(url, this.bucket, this.config);
      return true;
    } catch {
      return false;
    }
  }

  pathFromPublicUrl(publicUrl: string): string | null {
    if (!this.isS3Url(publicUrl)) return null;
    try {
      return getS3Key(publicUrl, this.bucket, this.config);
    } catch {
      return null;
    }
  }

  private getClient(): S3Client {
    this.assertConfigured();
    if (this.client) return this.client;

    const region = this.config.get<string>('AWS_S3_BUCKET_NAME_REGION')!.trim();
    const endpoint = this.config.get<string>('AWS_S3_ENDPOINT')?.trim();
    const forcePathStyle =
      this.config.get<string>('AWS_S3_FORCE_PATH_STYLE') === 'true' || !!endpoint;

    this.client = new S3Client({
      region,
      endpoint: endpoint || undefined,
      forcePathStyle,
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID')!.trim(),
        secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY')!.trim(),
      },
    });

    return this.client;
  }

  buildObjectPath(folder: string, ext: string): string {
    const safeExt = ext.startsWith('.') ? ext : `.${ext}`;
    return `${folder}/${randomUUID()}${safeExt}`;
  }

  async uploadBuffer(params: {
    folder: string;
    buffer: Buffer;
    contentType: string;
    ext: string;
  }): Promise<StorageUploadResult> {
    const storagePath = this.buildObjectPath(params.folder, params.ext);
    const client = this.getClient();

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: storagePath,
          Body: params.buffer,
          ContentType: params.contentType,
          CacheControl: 'max-age=3600',
        }),
      );

      return {
        publicUrl: getS3PublicUrl(storagePath, this.bucket, this.config),
        storagePath,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'unknown error';
      this.logger.error(`S3 upload failed: ${message}`);
      throw new BadRequestException(`Storage upload failed: ${message}`);
    }
  }

  async downloadBuffer(storagePath: string): Promise<Buffer> {
    const client = this.getClient();
    try {
      const response = await client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: storagePath,
        }),
      );

      const stream = response.Body as NodeJS.ReadableStream;
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }
      return Buffer.concat(chunks);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'empty response';
      throw new BadRequestException(`Storage download failed: ${message}`);
    }
  }

  async deleteByUrl(publicUrl: string): Promise<void> {
    const path = this.pathFromPublicUrl(publicUrl);
    if (!path) return;
    await this.deleteByPath(path);
  }

  async deleteByPath(storagePath: string): Promise<void> {
    const client = this.getClient();
    try {
      await client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: storagePath,
        }),
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'unknown error';
      this.logger.warn(`S3 delete failed for ${storagePath}: ${message}`);
    }
  }

  contentTypeFromExt(ext: string): string {
    switch (ext.toLowerCase()) {
      case '.mp3':
        return 'audio/mpeg';
      case '.wav':
        return 'audio/wav';
      case '.flac':
        return 'audio/flac';
      case '.m4a':
        return 'audio/mp4';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.webp':
        return 'image/webp';
      case '.mp4':
        return 'video/mp4';
      case '.webm':
        return 'video/webm';
      default:
        return 'application/octet-stream';
    }
  }

  extFromUrl(url: string): string {
    return extname(url).toLowerCase() || '.bin';
  }
}
