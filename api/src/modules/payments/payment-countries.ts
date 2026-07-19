export type PaymentProviderOption = { code: string; label: string };

export type PaymentCountryOption = {
  id: string;
  countryCode: string;
  name: string;
  dialCode: string;
  currency: string;
  providers: PaymentProviderOption[];
};

export const PAYMENT_COUNTRY_OPTIONS: PaymentCountryOption[] = [
  {
    id: 'ZMB',
    countryCode: 'ZMB',
    name: 'Zambia',
    dialCode: '260',
    currency: 'ZMW',
    providers: [
      { code: 'AIRTEL_OAPI_ZMB', label: 'Airtel' },
      { code: 'MTN_MOMO_ZMB', label: 'MTN' },
      { code: 'ZAMTEL_ZMB', label: 'Zamtel' },
    ],
  },
];

export function listPaymentCountryOptions() {
  return { success: true, data: PAYMENT_COUNTRY_OPTIONS };
}

export function normalizeMobileMoneyPhone(dialCode: string, phone?: string): string {
  if (!phone?.trim()) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith(dialCode)) return digits;
  if (digits.startsWith('0')) return `${dialCode}${digits.slice(1)}`;
  return `${dialCode}${digits}`;
}
