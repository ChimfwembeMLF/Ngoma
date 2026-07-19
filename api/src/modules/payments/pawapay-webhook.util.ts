import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('PawaPayWebhook');

export function isWebhookSignatureRequired(config: ConfigService): boolean {
  return Boolean(config.get<string>('PAWAPAY_PUBLIC_KEY_ID')?.trim());
}

/**
 * When PAWAPAY_PUBLIC_KEY_ID is configured, require a signature header.
 * Full RFC-9421 verification can be added when production keys are provisioned.
 */
export function assertWebhookSignature(
  headers: Record<string, string | string[] | undefined>,
  config: ConfigService,
): void {
  if (!isWebhookSignatureRequired(config)) return;

  const signature =
    headers['signature'] ||
    headers['x-pawapay-signature'] ||
    headers['pawapay-signature'];

  if (!signature || (Array.isArray(signature) && signature.length === 0)) {
    throw new UnauthorizedException('Missing PawaPay webhook signature');
  }

  logger.debug('Webhook signature header present');
}
