import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { usePaymentConfig, usePaymentOptions } from '@/hooks/usePayments';
import { useArtistPublic, useInitiateTip } from '@/hooks/useTips';
import { AppShell } from '@/components/layout/AppShell';
import { PaymentStatusPanel } from '@/components/payments/PaymentStatusPanel';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const PRESETS = [5, 10, 25, 50] as const;

export function TipArtistPage() {
  const { artistId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const trackId = searchParams.get('trackId') ?? undefined;

  const { data: artistData, isLoading } = useArtistPublic(artistId);
  const artist = artistData?.data;
  const paymentConfig = usePaymentConfig();
  const options = usePaymentOptions();
  const initiate = useInitiateTip();

  const [selectedPreset, setSelectedPreset] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [provider, setProvider] = useState('');
  const [phone, setPhone] = useState('');
  const [depositId, setDepositId] = useState<string | null>(null);
  const [tipComplete, setTipComplete] = useState(false);
  const [error, setError] = useState('');

  const pawapayEnabled = paymentConfig.data?.data.pawapayEnabled ?? true;
  const zambia = options.data?.data?.[0];
  const providers = zambia?.providers ?? [];

  const amount = customAmount ? Number(customAmount) : selectedPreset;

  const resetPayment = () => {
    setDepositId(null);
    setTipComplete(false);
    setError('');
  };

  const sendTip = async () => {
    if (!artistId || !provider) return;
    if (pawapayEnabled && !phone.trim()) {
      setError('Phone number is required for mobile money payment');
      return;
    }
    if (amount < 1) {
      setError('Minimum tip is ZMW 1.00');
      return;
    }
    setError('');
    try {
      const result = await initiate.mutateAsync({
        artistId,
        amount,
        provider,
        phone,
        message: message.trim() || undefined,
        trackId,
        currency: 'ZMW',
      });
      setDepositId(result.data.depositId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tip failed');
    }
  };

  if (isLoading) {
    return (
      <AppShell maxWidth="md" centered>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </AppShell>
    );
  }

  if (!artist) {
    return (
      <AppShell maxWidth="md" centered>
        <p className="text-sm text-muted-foreground">Artist not found</p>
      </AppShell>
    );
  }

  return (
    <AppShell maxWidth="md">
      <div className="space-y-6">
        <Link
          to={trackId ? `/tracks/${trackId}` : '/discover'}
          className={buttonVariants({ variant: 'ghost', className: 'text-sm' })}
        >
          ← Back
        </Link>

        <div>
          <h1 className="text-[22px] font-medium text-foreground">Support {artist.artistName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Show your appreciation with a tip</p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {!depositId ? (
          <Card className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(preset);
                    setCustomAmount('');
                  }}
                  className={cn(
                    'rounded-md border px-3 py-3 text-sm font-medium',
                    !customAmount && selectedPreset === preset
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-foreground hover:border-foreground/30',
                  )}
                >
                  ZMW {preset}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-amount">Or custom amount (ZMW)</Label>
              <Input
                id="custom-amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tip-message">Message (optional)</Label>
              <Textarea
                id="tip-message"
                maxLength={500}
                rows={3}
                placeholder="Say something nice…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tip-provider">Mobile money provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger id="tip-provider" className="w-full">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p.code} value={p.code}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tip-phone">Phone number{pawapayEnabled ? ' *' : ''}</Label>
              <Input
                id="tip-phone"
                placeholder="e.g. 0977123456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required={pawapayEnabled}
              />
            </div>

            <Button
              type="button"
              variant="default"
              className="w-full"
              onClick={sendTip}
              disabled={!provider || initiate.isPending}
            >
              Send tip · ZMW {amount.toFixed(2)}
            </Button>

            <p className="text-xs text-muted-foreground">95% goes to the artist (minus payment processing)</p>
          </Card>
        ) : (
          <div className="space-y-4">
            <PaymentStatusPanel
              depositId={depositId}
              onComplete={() => setTipComplete(true)}
              onRetry={resetPayment}
              completedMessage={`Tip sent to ${artist.artistName}!`}
            />
            {tipComplete && (
              <Link
                to={trackId ? `/tracks/${trackId}` : '/discover'}
                className={buttonVariants({ variant: 'outline', className: 'inline-flex w-full justify-center' })}
              >
                {trackId ? 'Back to track' : 'Back to discover'}
              </Link>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
