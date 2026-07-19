export type DecimalsInAmount = 'NONE' | 'TWO';

export class PaymentAmountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentAmountError';
  }
}

export function normalizePaymentAmount(
  amount: number,
  decimalsInAmount: DecimalsInAmount,
): { amount: number; amountString: string } {
  if (!Number.isFinite(amount)) {
    throw new PaymentAmountError('Invalid amount');
  }

  if (decimalsInAmount === 'NONE') {
    const normalized = Math.floor(amount);
    if (normalized < 1) {
      throw new PaymentAmountError('Amount must be a whole number of at least 1');
    }
    return { amount: normalized, amountString: String(normalized) };
  }

  const normalized = Math.round(amount * 100) / 100;
  if (normalized < 0.01) {
    throw new PaymentAmountError('Amount is too low');
  }
  return { amount: normalized, amountString: normalized.toFixed(2) };
}

export function getDecimalsInAmountForCurrency(currency: string): DecimalsInAmount {
  const upper = currency.toUpperCase();
  if (['XOF', 'XAF', 'RWF', 'UGX'].includes(upper)) {
    return 'NONE';
  }
  return 'TWO';
}
