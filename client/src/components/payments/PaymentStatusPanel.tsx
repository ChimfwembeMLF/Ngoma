import { useEffect } from 'react';
import { usePaymentStatus } from '../../hooks/usePayments';

type Props = {
  depositId: string;
  onComplete?: () => void;
};

export function PaymentStatusPanel({ depositId, onComplete }: Props) {
  const { data } = usePaymentStatus(depositId, true);
  const status = data?.data.status;

  useEffect(() => {
    if (status === 'COMPLETED') onComplete?.();
  }, [status, onComplete]);

  if (status === 'COMPLETED') {
    return (
      <div className="rounded-lg bg-green-900/30 border border-green-700 p-4 text-green-300">
        Payment completed! You can now download your track.
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="rounded-lg bg-red-900/30 border border-red-700 p-4 text-red-300">
        Payment failed. Please try again.
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-indigo-900/30 border border-indigo-700 p-4 text-cream">
      <p className="font-medium">Waiting for payment confirmation...</p>
      <p className="text-sm text-cream/60 mt-1">Status: {status ?? 'PENDING'}</p>
    </div>
  );
}
