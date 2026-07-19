import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTrack } from '../hooks/useTracks';
import { useInitiatePayment, usePaymentOptions } from '../hooks/usePayments';
import { PaymentStatusPanel } from '../components/payments/PaymentStatusPanel';

export function CheckoutPage() {
  const { trackId = '' } = useParams();
  const { data } = useTrack(trackId);
  const track = data?.data;
  const options = usePaymentOptions();
  const initiate = useInitiatePayment();
  const [provider, setProvider] = useState('');
  const [phone, setPhone] = useState('');
  const [depositId, setDepositId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const zambia = options.data?.data?.[0];
  const providers = zambia?.providers ?? [];

  const pay = async () => {
    if (!track || !provider) return;
    setError('');
    try {
      const result = await initiate.mutateAsync({
        amount: Number(track.price),
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

  if (!track) return <div className="p-8 text-cream">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-8 space-y-6">
      <Link to={`/tracks/${track.id}`} className="text-terracotta text-sm">
        ← Back to track
      </Link>
      <h1 className="text-2xl font-bold text-cream">Checkout</h1>
      <p className="text-cream/70">
        {track.title} · ZMW {track.price}
      </p>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!depositId ? (
        <>
          <select
            className="w-full rounded-lg bg-indigo-950 border border-indigo-700 px-3 py-2 text-cream"
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
          <input
            className="w-full rounded-lg bg-indigo-950 border border-indigo-700 px-3 py-2 text-cream"
            placeholder="Phone (e.g. 0977123456)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            type="button"
            onClick={pay}
            disabled={!provider || initiate.isPending}
            className="w-full px-4 py-2 rounded-lg bg-terracotta text-white"
          >
            Pay with mobile money
          </button>
        </>
      ) : (
        <PaymentStatusPanel
          depositId={depositId}
          onComplete={() => {}}
        />
      )}
    </div>
  );
}
