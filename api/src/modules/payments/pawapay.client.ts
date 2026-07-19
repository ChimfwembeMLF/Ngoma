import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { isAxiosError } from 'axios';

export type PawaPayDepositInput = {
  depositId: string;
  amount: string;
  currency: string;
  correspondent: string;
  phone?: string;
  customerMessage: string;
};

export type ParsedPawaPayDepositStatus = {
  depositId?: string;
  depositStatus?: string;
  lookupStatus?: string;
};

const PAWAPAY_V2_SANDBOX = 'https://api.sandbox.pawapay.io/v2';
const PAWAPAY_V2_PROD = 'https://api.pawapay.io/v2';
const PAWAPAY_LOOKUP_STATUSES = new Set(['FOUND', 'NOT_FOUND']);

function firstNonEmpty(...values: Array<string | undefined>): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return '';
}

export function resolvePawaPayToken(config: ConfigService): string {
  return firstNonEmpty(
    config.get<string>('PAWAPAY_API_TOKEN'),
    config.get<string>('PAWAPAY_SANDBOX_API_TOKEN'),
  );
}

export function resolvePawaPayBaseUrl(config: ConfigService): string {
  const env = config.get<string>('PAWAPAY_ENV') || config.get<string>('PAWAPAY_ENVIRONMENT');
  const isSandbox = env !== 'production' && env !== 'prod';
  const raw = isSandbox
    ? firstNonEmpty(
        config.get<string>('PAWAPAY_BASE_URL_SANDBOX'),
        config.get<string>('PAWAPAY_SANDBOX_API_URL'),
      )
    : firstNonEmpty(
        config.get<string>('PAWAPAY_BASE_URL_PROD'),
        config.get<string>('PAWAPAY_API_URL'),
      );
  const fallback = isSandbox ? PAWAPAY_V2_SANDBOX : PAWAPAY_V2_PROD;
  let base = (raw || fallback).trim().replace(/\/$/, '');
  base = base.replace(/\/v1$/i, '/v2');
  if (!/\/v2$/i.test(base)) base = `${base}/v2`;
  return base;
}

export function buildPawaPayDepositPayload(input: PawaPayDepositInput) {
  const msg = input.customerMessage.trim().slice(0, 22);
  return {
    depositId: input.depositId,
    amount: input.amount,
    currency: input.currency,
    payer: {
      type: 'MMO',
      accountDetails: {
        provider: input.correspondent,
        phoneNumber: input.phone,
      },
    },
    customerMessage: msg,
  };
}

export function parsePawaPayDepositStatus(data: unknown): ParsedPawaPayDepositStatus | null {
  if (!data || typeof data !== 'object') return null;
  const record = data as Record<string, unknown>;

  if (record.data && typeof record.data === 'object') {
    const inner = record.data as Record<string, unknown>;
    const lookupStatus =
      typeof record.status === 'string' ? record.status.toUpperCase() : undefined;
    const depositStatus =
      typeof inner.status === 'string' ? inner.status.toUpperCase() : undefined;
    const depositId =
      typeof inner.depositId === 'string'
        ? inner.depositId
        : typeof record.depositId === 'string'
          ? record.depositId
          : undefined;
    if (lookupStatus === 'NOT_FOUND') {
      return { depositId, lookupStatus, depositStatus: undefined };
    }
    return { depositId, lookupStatus, depositStatus };
  }

  const topLevelStatus =
    typeof record.status === 'string' ? record.status.toUpperCase() : undefined;
  if (!topLevelStatus || PAWAPAY_LOOKUP_STATUSES.has(topLevelStatus)) {
    return {
      depositId: typeof record.depositId === 'string' ? record.depositId : undefined,
      lookupStatus: topLevelStatus,
      depositStatus: undefined,
    };
  }

  return {
    depositId: typeof record.depositId === 'string' ? record.depositId : undefined,
    depositStatus: topLevelStatus,
  };
}

export function isPawaPayDepositCompleted(status?: string | null): boolean {
  return (status ?? '').toUpperCase() === 'COMPLETED';
}

function formatPawaPayError(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { errorMessage?: string; message?: string } | undefined;
    return data?.errorMessage || data?.message || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown payment gateway error';
}

export async function postPawaPayDeposit(
  config: ConfigService,
  input: PawaPayDepositInput,
): Promise<ParsedPawaPayDepositStatus | null> {
  const token = resolvePawaPayToken(config);
  if (!token) return null;

  const baseUrl = resolvePawaPayBaseUrl(config);
  try {
    const response = await axios.post(`${baseUrl}/deposits`, buildPawaPayDepositPayload(input), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return parsePawaPayDepositStatus(response.data);
  } catch (error) {
    throw new BadRequestException(formatPawaPayError(error));
  }
}

export async function getPawaPayDepositStatus(
  config: ConfigService,
  depositId: string,
): Promise<unknown> {
  const token = resolvePawaPayToken(config);
  if (!token) return null;
  const baseUrl = resolvePawaPayBaseUrl(config);
  const response = await axios.get(`${baseUrl}/deposits/${depositId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
