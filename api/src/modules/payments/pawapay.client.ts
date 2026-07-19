import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { isAxiosError } from 'axios';
import {
  resolvePawaPayBaseUrl,
  resolvePawaPayToken,
} from '../../common/payments.config';

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
  transactionId?: string;
  errorCode?: string;
  errorMessage?: string;
};

const PAWAPAY_LOOKUP_STATUSES = new Set(['FOUND', 'NOT_FOUND']);

export { resolvePawaPayToken, resolvePawaPayBaseUrl };

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

function readRecord(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== 'object') return null;
  return data as Record<string, unknown>;
}

export function extractPawaPayMetadata(data: unknown): {
  transactionId?: string;
  errorCode?: string;
  errorMessage?: string;
} {
  const record = readRecord(data);
  if (!record) return {};

  const inner =
    record.data && typeof record.data === 'object'
      ? (record.data as Record<string, unknown>)
      : record;

  const failureReason = inner.failureReason;
  const failureObj =
    failureReason && typeof failureReason === 'object'
      ? (failureReason as Record<string, unknown>)
      : null;

  return {
    transactionId:
      typeof inner.financialTransactionId === 'string'
        ? inner.financialTransactionId
        : typeof inner.transactionId === 'string'
          ? inner.transactionId
          : undefined,
    errorCode:
      typeof inner.errorCode === 'string'
        ? inner.errorCode
        : typeof failureObj?.code === 'string'
          ? failureObj.code
          : undefined,
    errorMessage:
      typeof inner.errorMessage === 'string'
        ? inner.errorMessage
        : typeof failureReason === 'string'
          ? failureReason
          : typeof failureObj?.message === 'string'
            ? failureObj.message
            : undefined,
  };
}

export function parsePawaPayDepositStatus(data: unknown): ParsedPawaPayDepositStatus | null {
  const record = readRecord(data);
  if (!record) return null;

  const metadata = extractPawaPayMetadata(data);

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
      return { depositId, lookupStatus, depositStatus: undefined, ...metadata };
    }
    return { depositId, lookupStatus, depositStatus, ...metadata };
  }

  const topLevelStatus =
    typeof record.status === 'string' ? record.status.toUpperCase() : undefined;
  if (!topLevelStatus || PAWAPAY_LOOKUP_STATUSES.has(topLevelStatus)) {
    return {
      depositId: typeof record.depositId === 'string' ? record.depositId : undefined,
      lookupStatus: topLevelStatus,
      depositStatus: undefined,
      ...metadata,
    };
  }

  return {
    depositId: typeof record.depositId === 'string' ? record.depositId : undefined,
    depositStatus: topLevelStatus,
    ...metadata,
  };
}

export function isPawaPayDepositCompleted(status?: string | null): boolean {
  return (status ?? '').toUpperCase() === 'COMPLETED';
}

export function isPawaPayDepositFailed(status?: string | null): boolean {
  return (status ?? '').toUpperCase() === 'FAILED';
}

function formatPawaPayError(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { errorMessage?: string; message?: string } | undefined;
    return data?.errorMessage || data?.message || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown payment gateway error';
}

export type PawaPayPayoutInput = {
  payoutId: string;
  amount: string;
  currency: string;
  correspondent: string;
  phone: string;
};

export function buildPawaPayPayoutPayload(input: PawaPayPayoutInput) {
  return {
    payoutId: input.payoutId,
    amount: input.amount,
    currency: input.currency,
    recipient: {
      type: 'MMO',
      accountDetails: {
        provider: input.correspondent,
        phoneNumber: input.phone,
      },
    },
  };
}

export type ParsedPawaPayPayoutStatus = {
  payoutId?: string;
  payoutStatus?: string;
  transactionId?: string;
  errorCode?: string;
  errorMessage?: string;
};

export function parsePawaPayPayoutStatus(data: unknown): ParsedPawaPayPayoutStatus | null {
  const record = readRecord(data);
  if (!record) return null;
  const metadata = extractPawaPayMetadata(data);

  if (record.data && typeof record.data === 'object') {
    const inner = record.data as Record<string, unknown>;
    return {
      payoutId:
        typeof inner.payoutId === 'string'
          ? inner.payoutId
          : typeof record.payoutId === 'string'
            ? record.payoutId
            : undefined,
      payoutStatus:
        typeof inner.status === 'string' ? inner.status.toUpperCase() : undefined,
      ...metadata,
    };
  }

  const status =
    typeof record.status === 'string' ? record.status.toUpperCase() : undefined;
  return {
    payoutId: typeof record.payoutId === 'string' ? record.payoutId : undefined,
    payoutStatus: status,
    ...metadata,
  };
}

export function isPawaPayPayoutCompleted(status?: string | null): boolean {
  return (status ?? '').toUpperCase() === 'COMPLETED';
}

export function isPawaPayPayoutFailed(status?: string | null): boolean {
  return (status ?? '').toUpperCase() === 'FAILED';
}

export async function postPawaPayPayout(
  config: ConfigService,
  input: PawaPayPayoutInput,
): Promise<ParsedPawaPayPayoutStatus | null> {
  const token = resolvePawaPayToken(config);
  if (!token) return null;

  const baseUrl = resolvePawaPayBaseUrl(config);
  try {
    const response = await axios.post(
      `${baseUrl}/payouts`,
      buildPawaPayPayoutPayload(input),
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return parsePawaPayPayoutStatus(response.data);
  } catch (error) {
    throw new BadRequestException(formatPawaPayError(error));
  }
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
