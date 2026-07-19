import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTrack } from '../hooks/useTracks';
import { useInitiatePayment, usePaymentOptions } from '../hooks/usePayments';
import { DesignSystemLayout } from '../components/layout/DesignSystemLayout';
import { PaymentStatusPanel } from '../components/payments/PaymentStatusPanel';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button, buttonVariants } from '../components/ui/Button';
import { cn } from '../lib/utils';

const selectClassName = cn(
  'w-full min-h-[56px] rounded-sm border border-hairline bg-canvas px-3 py-2 text-base text-ink',
  'focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-primary/20',
);

export function CheckoutPage() {
  const { trackId = '' } = useParams();
  const { data } = useTrack(trackId);
  const track = data?.data;
  const options = usePaymentOptions();
  const initiate = useInitiatePayment();
  const [provider, setProvider] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [depositId, setDepositId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const isPwyw = track?.pricingType === 'PAY_WHAT_YOU_WANT';
  const minAmount = isPwyw ? (track?.minPrice ?? 0) : Number(track?.price ?? 0);

  useEffect(() => {
    if (!track) return;
    if (track.pricingType === 'PAY_WHAT_YOU_WANT') {
      setAmount(String(track.minPrice ?? ''));
    } else if (track.pricingType === 'SET_PRICE') {
      setAmount(String(track.price ?? ''));
    }
  }, [track?.id, track?.pricingType, track?.minPrice, track?.price]);

  const zambia = options.data?.data?.[0];
  const providers = zambia?.providers ?? [];

  const pay = async () => {
    if (!track || !provider) return;
    const payAmount = Number(amount);
    if (isPwyw && payAmount < minAmount) {
      setError(`Amount must be at least ZMW ${minAmount.toFixed(2)}`);
      return;
    }
    setError('');
    try {
      const result = await initiate.mutateAsync({
        amount: payAmount,
        currency: 'ZMW',
        provider,
        purpose: 'TRACK_DOWNLOAD',
        itemId: track.id,
        phone,
      });
      setDepositId(result.data.depositId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed');
    }
  };

  if (!track) {
    return (
      <DesignSystemLayout maxWidth="md" centered>
        <p className="text-sm text-muted">Loading…</p>
      </DesignSystemLayout>
    );
  }

  const priceSummary = isPwyw
    ? `Pay what you want · minimum ZMW ${track.minPrice ?? 0}`
    : `ZMW ${track.price}`;

  return (
    <DesignSystemLayout maxWidth="md">
      <div className="space-y-6">
        <Link to={`/tracks/${track.id}`} className={buttonVariants('ghost', 'text-sm')}>
          ← Back to track
        </Link>

        <h1 className="text-[22px] font-medium text-ink">Checkout</h1>

        <Card>
          <div className="font-semibold text-ink">{track.title}</div>
          <div className="text-sm text-muted">{priceSummary}</div>
        </Card>

        {error && <p className="text-sm text-error">{error}</p>}

        {!depositId ? (
          <div className="space-y-4">
            {isPwyw && (
              <Input
                label="Your amount (ZMW)"
                type="number"
                min={String(minAmount)}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            )}
            <div className="space-y-1">
              <label htmlFor="provider" className="block text-sm font-medium text-ink">
                Mobile money provider
              </label>
              <select
                id="provider"
                className={selectClassName}
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value="">Select provider</option>
                {providers.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Phone number"
              placeholder="e.g. 0977123456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button
              type="button"
              variant="primary"
              className="w-full"
              onClick={pay}
              disabled={!provider || initiate.isPending}
            >
              Pay with mobile money
            </Button>
          </div>
        ) : (
          <PaymentStatusPanel depositId={depositId} onComplete={() => {}} />
        )}
      </div>
    </DesignSystemLayout>
  );
}
