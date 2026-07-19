import {
  normalizePaymentAmount,
  PaymentAmountError,
  getDecimalsInAmountForCurrency,
} from './payment-amount.util';

describe('normalizePaymentAmount', () => {
  it('floors XOF amounts to integers', () => {
    expect(normalizePaymentAmount(500.75, 'NONE')).toEqual({
      amount: 500,
      amountString: '500',
    });
  });

  it('rounds ZMW amounts to two decimals', () => {
    expect(normalizePaymentAmount(10.555, 'TWO')).toEqual({
      amount: 10.56,
      amountString: '10.56',
    });
  });

  it('rejects below-minimum whole amounts', () => {
    expect(() => normalizePaymentAmount(0.5, 'NONE')).toThrow(PaymentAmountError);
  });

  it('preserves two-decimal PWYW amounts', () => {
    expect(normalizePaymentAmount(10.5, 'TWO')).toEqual({
      amount: 10.5,
      amountString: '10.50',
    });
  });
});

describe('getDecimalsInAmountForCurrency', () => {
  it('returns NONE for XOF', () => {
    expect(getDecimalsInAmountForCurrency('XOF')).toBe('NONE');
  });

  it('returns TWO for ZMW', () => {
    expect(getDecimalsInAmountForCurrency('ZMW')).toBe('TWO');
  });
});
