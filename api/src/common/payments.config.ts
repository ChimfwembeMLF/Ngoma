import { ConfigService } from '@nestjs/config';

export type PawaPayEnvironment = 'sandbox' | 'production';

function firstNonEmpty(...values: Array<string | undefined>): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return '';
}

export function resolvePawaPayEnvironment(config: ConfigService): PawaPayEnvironment {
  const raw = firstNonEmpty(
    config.get<string>('PAWAPAY_ENV'),
    config.get<string>('PAWAPAY_ENVIRONMENT'),
  );
  if (raw === 'production' || raw === 'prod') return 'production';
  return 'sandbox';
}

export function isPawaPaySandbox(config: ConfigService): boolean {
  return resolvePawaPayEnvironment(config) === 'sandbox';
}

export function resolvePawaPayToken(config: ConfigService): string {
  const isSandbox = isPawaPaySandbox(config);
  if (isSandbox) {
    return firstNonEmpty(
      config.get<string>('PAWAPAY_API_TOKEN'),
      config.get<string>('PAWAPAY_SANDBOX_API_TOKEN'),
    );
  }
  return firstNonEmpty(
    config.get<string>('PAWAPAY_PRODUCTION_API_TOKEN'),
    config.get<string>('PAWAPAY_API_TOKEN'),
  );
}

export function isPawapayEnabled(config: ConfigService): boolean {
  return Boolean(resolvePawaPayToken(config));
}

export function isDevAutoCompleteEnabled(config: ConfigService): boolean {
  return config.get<string>('PAYMENTS_DEV_AUTO_COMPLETE') === 'true';
}

export function resolveWebhookUrl(config: ConfigService): string {
  const explicit = config.get<string>('PAWAPAY_WEBHOOK_URL')?.trim();
  if (explicit) return explicit;
  const port = config.get<string>('PORT') || '4000';
  return `http://localhost:${port}/api/v1/payments/webhook`;
}

export function resolvePawaPayBaseUrl(config: ConfigService): string {
  const isSandbox = isPawaPaySandbox(config);
  const raw = isSandbox
    ? firstNonEmpty(
        config.get<string>('PAWAPAY_BASE_URL_SANDBOX'),
        config.get<string>('PAWAPAY_SANDBOX_API_URL'),
      )
    : firstNonEmpty(
        config.get<string>('PAWAPAY_BASE_URL_PROD'),
        config.get<string>('PAWAPAY_API_URL'),
      );
  const fallback = isSandbox
    ? 'https://api.sandbox.pawapay.io/v2'
    : 'https://api.pawapay.io/v2';
  let base = (raw || fallback).trim().replace(/\/$/, '');
  base = base.replace(/\/v1$/i, '/v2');
  if (!/\/v2$/i.test(base)) base = `${base}/v2`;
  return base;
}
