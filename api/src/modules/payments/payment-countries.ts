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

export type PaymentCountryDefinition = {
  id: string;
  iso2: string;
  name: string;
  flag: string;
  dialCode: string;
  currency: string;
  phonePlaceholder: string;
  enabled: boolean;
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
  operators: MobileOperatorPublic[];
};

const ZAMBIA_OPERATORS: MobileOperatorDefinition[] = [
  {
    id: 'zm-mtn',
    displayName: 'MTN Mobile Money',
    shortName: 'MTN',
    pawapayCode: 'MTN_MOMO_ZMB',
  },
  {
    id: 'zm-airtel',
    displayName: 'Airtel Money',
    shortName: 'Airtel',
    pawapayCode: 'AIRTEL_OAPI_ZMB',
  },
  {
    id: 'zm-zamtel',
    displayName: 'Zamtel Kwacha',
    shortName: 'Zamtel',
    pawapayCode: 'ZAMTEL_ZMB',
  },
];

export const PAYMENT_COUNTRY_CATALOG: PaymentCountryDefinition[] = [
  {
    id: 'ZM',
    iso2: 'ZM',
    name: 'Zambia',
    flag: flagEmoji('ZM'),
    dialCode: '260',
    currency: 'ZMW',
    phonePlaceholder: '97XXXXXXX',
    enabled: true,
    operators: ZAMBIA_OPERATORS,
  },
];

export const DEFAULT_COUNTRY_ID = 'ZM';

export function flagEmoji(iso2: string): string {
  const code = iso2.toUpperCase();
  if (code.length !== 2) return '';
  return String.fromCodePoint(
    ...[...code].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65),
  );
}

function toPublicCountry(country: PaymentCountryDefinition): PaymentCountryPublic {
  return {
    id: country.id,
    iso2: country.iso2,
    name: country.name,
    flag: country.flag,
    dialCode: country.dialCode,
    currency: country.currency,
    phonePlaceholder: country.phonePlaceholder,
    enabled: country.enabled,
    operators: country.operators.map(({ id, displayName, shortName }) => ({
      id,
      displayName,
      shortName,
    })),
  };
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
  const country = PAYMENT_COUNTRY_CATALOG.find((c) => c.id === id && c.enabled);
  if (!country) {
    throw new Error(`Country not supported for payments: ${id}`);
  }
  return country;
}

export function resolveOperator(operatorId: string): MobileOperatorDefinition {
  for (const country of PAYMENT_COUNTRY_CATALOG) {
    const operator = country.operators.find((o) => o.id === operatorId);
    if (operator) return operator;
  }
  throw new Error(`Invalid mobile money operator: ${operatorId}`);
}

export function resolveOperatorByPawapayCode(
  pawapayCode: string,
): MobileOperatorDefinition | null {
  for (const country of PAYMENT_COUNTRY_CATALOG) {
    const operator = country.operators.find((o) => o.pawapayCode === pawapayCode);
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
  const country = resolveCountry(input.countryId);

  if (input.operatorId) {
    const operator = resolveOperator(input.operatorId);
    const belongsToCountry = country.operators.some((o) => o.id === operator.id);
    if (!belongsToCountry) {
      throw new Error('Operator not available in selected country');
    }
    return {
      pawapayCode: operator.pawapayCode,
      dialCode: country.dialCode,
      currency: country.currency,
    };
  }

  if (input.provider) {
    const operator = resolveOperatorByPawapayCode(input.provider);
    if (operator) {
      return {
        pawapayCode: operator.pawapayCode,
        dialCode: country.dialCode,
        currency: country.currency,
      };
    }
    return {
      pawapayCode: input.provider,
      dialCode: country.dialCode,
      currency: country.currency,
    };
  }

  throw new Error('Please select a mobile money provider');
}
