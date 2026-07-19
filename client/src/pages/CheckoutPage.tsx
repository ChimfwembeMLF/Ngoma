import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTrack } from '@/hooks/useTracks';
import { useInitiatePayment, usePaymentConfig, usePaymentOptions } from '@/hooks/usePayments';
import { AppShell } from '@/components/layout/AppShell';
import { PaymentStatusPanel } from '@/components/payments/PaymentStatusPanel';
import {
  MobileMoneyForm,
  type MobileMoneyFormValue,
} from '@/components/payments/MobileMoneyForm';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { buttonVariants } from '@/components/ui/button';
import { FormWizard } from '@/components/forms';

export function CheckoutPage() {
  const { trackId = '' } = useParams();
  const queryClient = useQueryClient();
  const { data } = useTrack(trackId);
  const track = data?.data;
  const paymentConfig = usePaymentConfig();
  const options = usePaymentOptions();
  const initiate = useInitiatePayment();
  const [mobileMoney, setMobileMoney] = useState<MobileMoneyFormValue>({
    countryId: 'ZM',
    operatorId: '',
    phone: '',
  });
  const [amount, setAmount] = useState('');
  const [depositId, setDepositId] = useState<string | null>(null);
  const [depositMessage, setDepositMessage] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [error, setError] = useState('');
  const [stepError, setStepError] = useState('');

  const pawapayEnabled = paymentConfig.data?.data.pawapayEnabled ?? true;
  const countries = options.data?.data.countries ?? [];
  const defaultCountryId = options.data?.data.defaultCountryId ?? 'ZM';
  const isPwyw = track?.pricingType === 'PAY_WHAT_YOU_WANT';
  const minAmount = isPwyw ? (track?.minPrice ?? 0) : Number(track?.price ?? 0);

  useEffect(() => {
    if (defaultCountryId) {
      setMobileMoney((prev) => ({ ...prev, countryId: defaultCountryId }));
    }
  }, [defaultCountryId]);

  useEffect(() => {
    if (!track) return;
    if (track.pricingType === 'PAY_WHAT_YOU_WANT') {
      setAmount(String(track.minPrice ?? ''));
    } else if (track.pricingType === 'SET_PRICE') {
      setAmount(String(track.price ?? ''));
    }
  }, [track?.id, track?.pricingType, track?.minPrice, track?.price]);

  const selectedCountry =
    countries.find((c) => c.id === mobileMoney.countryId) ?? countries[0];
  const wholeAmountsOnly = selectedCountry?.decimalsInAmount === 'NONE';
  const currencyLabel = selectedCountry?.currency ?? 'ZMW';

  const resetPayment = () => {
    setDepositId(null);
    setDepositMessage(null);
    setPaymentComplete(false);
    setError('');
  };

  const pay = async () => {
    if (!track || !mobileMoney.operatorId) return;
    if (pawapayEnabled && !mobileMoney.phone.trim()) {
      setError('Phone number is required for mobile money payment');
      return;
    }
    const payAmount = Number(amount);
    if (isPwyw && payAmount < minAmount) {
      setError(`Amount must be at least ${currencyLabel} ${minAmount.toFixed(wholeAmountsOnly ? 0 : 2)}`);
      return;
    }
    setError('');
    try {
      const result = await initiate.mutateAsync({
        amount: payAmount,
        currency: selectedCountry?.currency ?? 'ZMW',
        operatorId: mobileMoney.operatorId,
        countryId: mobileMoney.countryId,
        purpose: 'TRACK_DOWNLOAD',
        itemId: track.id,
        phone: mobileMoney.phone,
      });
      setDepositId(result.data.depositId);
      setDepositMessage(result.data.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed');
    }
  };

  if (!track) {
    return (
      <AppShell maxWidth="md" centered>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </AppShell>
    );
  }

  const priceSummary = isPwyw
    ? `Pay what you want · minimum ZMW ${track.minPrice ?? 0}`
    : `ZMW ${track.price}`;

  const buySteps = [
    {
      id: 'track',
      label: 'Track',
      validate: () => {
        const payAmount = Number(amount);
        if (isPwyw && payAmount < minAmount) {
          setStepError(`Amount must be at least ${currencyLabel} ${minAmount.toFixed(wholeAmountsOnly ? 0 : 2)}`);
          return false;
        }
        setStepError('');
        return true;
      },
      content: (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="font-semibold text-foreground">{track.title}</div>
            <div className="text-sm text-muted-foreground">{priceSummary}</div>
          </Card>
          {isPwyw && (
            <div className="space-y-2">
              <Label htmlFor="amount">Your amount ({currencyLabel})</Label>
              <Input
                id="amount"
                type="number"
                min={String(minAmount)}
                step={wholeAmountsOnly ? '1' : '0.01'}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {wholeAmountsOnly && (
                <p className="text-xs text-muted-foreground">Whole amounts only</p>
              )}
            </div>
          )}
          {!isPwyw && (
            <p className="text-sm text-muted-foreground">
              Total: {currencyLabel} {Number(amount).toFixed(wholeAmountsOnly ? 0 : 2)}
            </p>
          )}
        </div>
      ),
    },
    {
      id: 'pay',
      label: 'Pay',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pay {currencyLabel} {Number(amount).toFixed(wholeAmountsOnly ? 0 : 2)} for{' '}
            <strong>{track.title}</strong>
          </p>
          <MobileMoneyForm
            countries={countries}
            defaultCountryId={defaultCountryId}
            pawapayEnabled={pawapayEnabled}
            value={mobileMoney}
            onChange={setMobileMoney}
            disabled={initiate.isPending}
          />
        </div>
      ),
    },
  ];

  return (
    <AppShell maxWidth="md">
      <div className="space-y-6">
        <Link
          to={`/tracks/${track.id}`}
          className={buttonVariants({ variant: 'ghost', className: 'text-sm' })}
        >
          ← Back to track
        </Link>

        <h1 className="text-[22px] font-medium text-foreground">Buy track</h1>
        <p className="text-sm text-muted-foreground">
          Complete your purchase with mobile money
        </p>

        {(error || stepError) && (
          <p className="text-sm text-destructive">{error || stepError}</p>
        )}

        {!depositId ? (
          <Card className="p-6">
            <FormWizard
              steps={buySteps}
              onComplete={pay}
              completeLabel="Pay now"
              isSubmitting={initiate.isPending}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            <PaymentStatusPanel
              depositId={depositId}
              pendingMessage={depositMessage ?? undefined}
              onComplete={() => {
                setPaymentComplete(true);
                queryClient.invalidateQueries({ queryKey: ['track', trackId] });
              }}
              onRetry={resetPayment}
              completedMessage="Purchase complete! You can now download your track."
            />
            {paymentComplete && (
              <Link
                to={`/tracks/${track.id}`}
                className={buttonVariants({
                  variant: 'default',
                  className: 'inline-flex w-full justify-center',
                })}
              >
                Go to track & download
              </Link>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
