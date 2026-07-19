import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OperatorOption } from '@/components/payments/OperatorOption';

export type PaymentCountryOption = {
  id: string;
  iso2: string;
  name: string;
  flag: string;
  dialCode: string;
  currency: string;
  phonePlaceholder: string;
  enabled: boolean;
  operators: Array<{
    id: string;
    displayName: string;
    shortName: string;
  }>;
};

export type MobileMoneyFormValue = {
  countryId: string;
  operatorId: string;
  phone: string;
};

type MobileMoneyFormProps = {
  countries: PaymentCountryOption[];
  defaultCountryId: string;
  pawapayEnabled: boolean;
  value: MobileMoneyFormValue;
  onChange: (value: MobileMoneyFormValue) => void;
  disabled?: boolean;
};

export function MobileMoneyForm({
  countries,
  defaultCountryId,
  pawapayEnabled,
  value,
  onChange,
  disabled,
}: MobileMoneyFormProps) {
  const country =
    countries.find((c) => c.id === value.countryId) ??
    countries.find((c) => c.id === defaultCountryId) ??
    countries[0];

  if (!country) {
    return (
      <p className="text-sm text-muted-foreground">Mobile money unavailable in your region.</p>
    );
  }

  const setCountryId = (countryId: string) => {
    onChange({
      countryId,
      operatorId: '',
      phone: value.phone,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Country</Label>
        {countries.length <= 1 ? (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
            <span aria-hidden>{country.flag}</span>
            <span className="font-medium text-foreground">{country.name}</span>
            <span className="text-muted-foreground">· {country.currency}</span>
          </div>
        ) : (
          <Select value={value.countryId} onValueChange={setCountryId} disabled={disabled}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.flag} {c.name} · {c.currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-3">
        <Label>Pay with mobile money</Label>
        <div className="space-y-2" role="radiogroup" aria-label="Mobile money provider">
          {country.operators.map((operator) => (
            <OperatorOption
              key={operator.id}
              displayName={operator.displayName}
              selected={value.operatorId === operator.id}
              onSelect={() =>
                onChange({ ...value, countryId: country.id, operatorId: operator.id })
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobile-phone">
          Mobile number{pawapayEnabled ? ' *' : ''}
        </Label>
        <div className="flex gap-2">
          <span className="flex items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground">
            +{country.dialCode}
          </span>
          <Input
            id="mobile-phone"
            placeholder={country.phonePlaceholder}
            value={value.phone}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
            disabled={disabled}
            required={pawapayEnabled}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
