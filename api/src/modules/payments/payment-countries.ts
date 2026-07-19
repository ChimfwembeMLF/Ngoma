export type MobileOperatorDefinition = {
  id: string;
  displayName: string;
  shortName: string;
  pawapayCode: string;
};

export type MobileOperatorPublic = {
  id: string;
  displayName: string;
  shortName: string;
};

import type { DecimalsInAmount } from './payment-amount.util';

export type PaymentCountryDefinition = {
  id: string;
  iso2: string;
  name: string;
  flag: string;
  dialCode: string;
  currency: string;
  phonePlaceholder: string;
  enabled: boolean;
  decimalsInAmount: DecimalsInAmount;
  operators: MobileOperatorDefinition[];
};

export type PaymentCountryPublic = {
  id: string;
  iso2: string;
  name: string;
  flag: string;
  dialCode: string;
  currency: string;
  phonePlaceholder: string;
  enabled: boolean;
  decimalsInAmount: DecimalsInAmount;
  operators: MobileOperatorPublic[];
};

function op(
  id: string,
  displayName: string,
  shortName: string,
  pawapayCode: string,
): MobileOperatorDefinition {
  return { id, displayName, shortName, pawapayCode };
}

function inferDecimalsInAmount(currency: string): DecimalsInAmount {
  if (['XOF', 'XAF', 'RWF', 'UGX'].includes(currency.toUpperCase())) {
    return 'NONE';
  }
  return 'TWO';
}

function country(
  entry: Omit<PaymentCountryDefinition, 'flag' | 'decimalsInAmount'> & {
    iso2: string;
    decimalsInAmount?: DecimalsInAmount;
  },
): PaymentCountryDefinition {
  return {
    ...entry,
    decimalsInAmount: entry.decimalsInAmount ?? inferDecimalsInAmount(entry.currency),
    flag: flagEmoji(entry.iso2),
  };
}

/** PawaPay v2 correspondent codes — https://docs.pawapay.io/v2/docs/providers */
export const PAYMENT_COUNTRY_CATALOG: PaymentCountryDefinition[] = [
  country({
    id: 'BJ',
    iso2: 'BJ',
    name: 'Benin',
    dialCode: '229',
    currency: 'XOF',
    phonePlaceholder: '97XXXXXXX',
    enabled: true,
    operators: [
      op('bj-moov', 'Moov Money', 'Moov', 'MOOV_BEN'),
      op('bj-mtn', 'MTN Mobile Money', 'MTN', 'MTN_MOMO_BEN'),
    ],
  }),
  country({
    id: 'CM',
    iso2: 'CM',
    name: 'Cameroon',
    dialCode: '237',
    currency: 'XAF',
    phonePlaceholder: '6XX XXX XXX',
    enabled: true,
    operators: [
      op('cm-mtn', 'MTN Mobile Money', 'MTN', 'MTN_MOMO_CMR'),
      op('cm-orange', 'Orange Money', 'Orange', 'ORANGE_CMR'),
    ],
  }),
  country({
    id: 'CI',
    iso2: 'CI',
    name: "Côte d'Ivoire",
    dialCode: '225',
    currency: 'XOF',
    phonePlaceholder: '07XXXXXXX',
    enabled: true,
    operators: [
      op('ci-mtn', 'MTN Mobile Money', 'MTN', 'MTN_MOMO_CIV'),
      op('ci-orange', 'Orange Money', 'Orange', 'ORANGE_CIV'),
    ],
  }),
  country({
    id: 'CD',
    iso2: 'CD',
    name: 'Democratic Republic of the Congo',
    dialCode: '243',
    currency: 'CDF',
    phonePlaceholder: '9XX XXX XXX',
    enabled: true,
    operators: [
      op('cd-airtel', 'Airtel Money', 'Airtel', 'AIRTEL_COD'),
      op('cd-orange', 'Orange Money', 'Orange', 'ORANGE_COD'),
      op('cd-vodacom', 'Vodacom M-Pesa', 'Vodacom', 'VODACOM_MPESA_COD'),
    ],
  }),
  country({
    id: 'CD_USD',
    iso2: 'CD',
    name: 'DR Congo (USD)',
    dialCode: '243',
    currency: 'USD',
    phonePlaceholder: '9XX XXX XXX',
    enabled: true,
    operators: [
      op('cd-usd-airtel', 'Airtel Money', 'Airtel', 'AIRTEL_COD'),
      op('cd-usd-orange', 'Orange Money', 'Orange', 'ORANGE_COD'),
      op('cd-usd-vodacom', 'Vodacom M-Pesa', 'Vodacom', 'VODACOM_MPESA_COD'),
    ],
  }),
  country({
    id: 'GA',
    iso2: 'GA',
    name: 'Gabon',
    dialCode: '241',
    currency: 'XAF',
    phonePlaceholder: '07XXXXXXX',
    enabled: true,
    operators: [op('ga-airtel', 'Airtel Money', 'Airtel', 'AIRTEL_GAB')],
  }),
  country({
    id: 'KE',
    iso2: 'KE',
    name: 'Kenya',
    dialCode: '254',
    currency: 'KES',
    phonePlaceholder: '7XX XXX XXX',
    enabled: true,
    operators: [op('ke-mpesa', 'M-Pesa', 'Safaricom', 'MPESA_KEN')],
  }),
  country({
    id: 'CG',
    iso2: 'CG',
    name: 'Republic of the Congo',
    dialCode: '242',
    currency: 'XAF',
    phonePlaceholder: '06XXXXXXX',
    enabled: true,
    operators: [
      op('cg-airtel', 'Airtel Money', 'Airtel', 'AIRTEL_COG'),
      op('cg-mtn', 'MTN Mobile Money', 'MTN', 'MTN_MOMO_COG'),
    ],
  }),
  country({
    id: 'RW',
    iso2: 'RW',
    name: 'Rwanda',
    dialCode: '250',
    currency: 'RWF',
    phonePlaceholder: '78XXXXXXX',
    enabled: true,
    operators: [
      op('rw-airtel', 'Airtel Money', 'Airtel', 'AIRTEL_RWA'),
      op('rw-mtn', 'MTN Mobile Money', 'MTN', 'MTN_MOMO_RWA'),
    ],
  }),
  country({
    id: 'SN',
    iso2: 'SN',
    name: 'Senegal',
    dialCode: '221',
    currency: 'XOF',
    phonePlaceholder: '77XXXXXXX',
    enabled: true,
    operators: [
      op('sn-free', 'Free Money', 'Free', 'FREE_SEN'),
      op('sn-orange', 'Orange Money', 'Orange', 'ORANGE_SEN'),
    ],
  }),
  country({
    id: 'SL',
    iso2: 'SL',
    name: 'Sierra Leone',
    dialCode: '232',
    currency: 'SLE',
    phonePlaceholder: '76XXXXXX',
    enabled: true,
    operators: [op('sl-orange', 'Orange Money', 'Orange', 'ORANGE_SLE')],
  }),
  country({
    id: 'UG',
    iso2: 'UG',
    name: 'Uganda',
    dialCode: '256',
    currency: 'UGX',
    phonePlaceholder: '7XX XXX XXX',
    enabled: true,
    operators: [
      op('ug-airtel', 'Airtel Money', 'Airtel', 'AIRTEL_OAPI_UGA'),
      op('ug-mtn', 'MTN Mobile Money', 'MTN', 'MTN_MOMO_UGA'),
    ],
  }),
  country({
    id: 'ZM',
    iso2: 'ZM',
    name: 'Zambia',
    dialCode: '260',
    currency: 'ZMW',
    phonePlaceholder: '97XXXXXXX',
    enabled: true,
    operators: [
      op('zm-airtel', 'Airtel Money', 'Airtel', 'AIRTEL_OAPI_ZMB'),
      op('zm-mtn', 'MTN Mobile Money', 'MTN', 'MTN_MOMO_ZMB'),
      op('zm-zamtel', 'Zamtel Kwacha', 'Zamtel', 'ZAMTEL_ZMB'),
    ],
  }),
];

export const DEFAULT_COUNTRY_ID = 'ZM';

export function flagEmoji(iso2: string): string {
  const code = iso2.toUpperCase();
  if (code.length !== 2) return '';
  return String.fromCodePoint(
    ...[...code].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65),
  );
}

function toPublicCountry(countryDef: PaymentCountryDefinition): PaymentCountryPublic {
  return {
    id: countryDef.id,
    iso2: countryDef.iso2,
    name: countryDef.name,
    flag: countryDef.flag,
    dialCode: countryDef.dialCode,
    currency: countryDef.currency,
    phonePlaceholder: countryDef.phonePlaceholder,
    enabled: countryDef.enabled,
    decimalsInAmount: countryDef.decimalsInAmount,
    operators: countryDef.operators.map(({ id, displayName, shortName }) => ({
      id,
      displayName,
      shortName,
    })),
  };
}

export function getCountryById(countryId: string): PaymentCountryDefinition {
  return resolveCountry(countryId);
}

export function getDecimalsInAmountForCountry(countryId?: string): DecimalsInAmount {
  return resolveCountry(countryId).decimalsInAmount;
}

export function listPaymentCountryOptions() {
  const countries = PAYMENT_COUNTRY_CATALOG.filter((c) => c.enabled).map(toPublicCountry);
  return {
    success: true,
    data: {
      countries,
      defaultCountryId: DEFAULT_COUNTRY_ID,
    },
  };
}

export function resolveCountry(countryId?: string): PaymentCountryDefinition {
  const id = countryId || DEFAULT_COUNTRY_ID;
  const match = PAYMENT_COUNTRY_CATALOG.find((c) => c.id === id && c.enabled);
  if (!match) {
    throw new Error(`Country not supported for payments: ${id}`);
  }
  return match;
}

export function resolveOperator(operatorId: string): MobileOperatorDefinition {
  for (const entry of PAYMENT_COUNTRY_CATALOG) {
    const operator = entry.operators.find((o) => o.id === operatorId);
    if (operator) return operator;
  }
  throw new Error(`Invalid mobile money operator: ${operatorId}`);
}

export function resolveOperatorByPawapayCode(
  pawapayCode: string,
): MobileOperatorDefinition | null {
  for (const entry of PAYMENT_COUNTRY_CATALOG) {
    const operator = entry.operators.find((o) => o.pawapayCode === pawapayCode);
    if (operator) return operator;
  }
  return null;
}

export function normalizeMobileMoneyPhone(dialCode: string, phone?: string): string {
  if (!phone?.trim()) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith(dialCode)) return digits;
  if (digits.startsWith('0')) return `${dialCode}${digits.slice(1)}`;
  return `${dialCode}${digits}`;
}

export type PaymentResolutionInput = {
  operatorId?: string;
  provider?: string;
  countryId?: string;
};

export function resolvePaymentCorrespondent(input: PaymentResolutionInput): {
  pawapayCode: string;
  dialCode: string;
  currency: string;
} {
  const entry = resolveCountry(input.countryId);

  if (input.operatorId) {
    const operator = resolveOperator(input.operatorId);
    const belongsToCountry = entry.operators.some((o) => o.id === operator.id);
    if (!belongsToCountry) {
      throw new Error('Operator not available in selected country');
    }
    return {
      pawapayCode: operator.pawapayCode,
      dialCode: entry.dialCode,
      currency: entry.currency,
    };
  }

  if (input.provider) {
    const operator = resolveOperatorByPawapayCode(input.provider);
    if (operator) {
      return {
        pawapayCode: operator.pawapayCode,
        dialCode: entry.dialCode,
        currency: entry.currency,
      };
    }
    return {
      pawapayCode: input.provider,
      dialCode: entry.dialCode,
      currency: entry.currency,
    };
  }

  throw new Error('Please select a mobile money provider');
}
