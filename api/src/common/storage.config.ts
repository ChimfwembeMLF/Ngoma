import { ConfigService } from '@nestjs/config';

/** Resolve bucket from AWS_S3_BUCKET_NAME or NODE_ENV-specific dev/prod vars. */
export function resolveS3Bucket(config: ConfigService): string | undefined {
  const explicit = config.get<string>('AWS_S3_BUCKET_NAME')?.trim();
  if (explicit) return explicit;

  const isProd = config.get<string>('NODE_ENV') === 'production';
  const envKey = isProd ? 'AWS_S3_BUCKET_NAME_PROD' : 'AWS_S3_BUCKET_NAME_DEV';
  return config.get<string>(envKey)?.trim() || undefined;
}

export function isS3Configured(config: ConfigService): boolean {
  const bucket = resolveS3Bucket(config);
  const region = config.get<string>('AWS_S3_BUCKET_NAME_REGION')?.trim();
  const accessKey = config.get<string>('AWS_ACCESS_KEY_ID')?.trim();
  return Boolean(bucket && region && accessKey);
}

export function getS3Endpoint(config: ConfigService): string {
  const endpoint = config.get<string>('AWS_S3_ENDPOINT')?.trim();
  const region = config.get<string>('AWS_S3_BUCKET_NAME_REGION')?.trim() || 'us-east-1';
  return endpoint?.replace(/\/$/, '') || `https://s3.${region}.amazonaws.com`;
}

export function getS3PublicUrl(
  key: string,
  bucket: string,
  config: ConfigService,
): string {
  return `${getS3Endpoint(config)}/${bucket}/${key}`;
}

export function getS3Key(
  publicUrl: string,
  bucket: string,
  config: ConfigService,
): string {
  const prefix = `${getS3Endpoint(config)}/${bucket}/`;
  if (!publicUrl.startsWith(prefix)) {
    throw new TypeError('publicUrl is not an S3 object URL for the configured bucket');
  }
  return publicUrl.slice(prefix.length);
}
