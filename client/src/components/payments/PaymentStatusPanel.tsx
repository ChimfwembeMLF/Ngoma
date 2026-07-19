import { useEffect } from 'react';
import { usePaymentStatus } from '../../hooks/usePayments';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

type Props = {
  depositId: string;
  onComplete?: () => void;
};

function statusMessage(status: string | undefined) {
  switch (status) {
    case 'COMPLETED':
      return 'Payment completed! You can now download your track.';
    case 'FAILED':
      return 'Payment failed. Please try again.';
    default:
      return 'Waiting for payment confirmation...';
  }
}

function statusTextClass(status: string | undefined) {
  switch (status) {
    case 'COMPLETED':
      return 'text-ink';
    case 'FAILED':
      return 'text-error';
    default:
      return 'text-muted';
  }
}

export function PaymentStatusPanel({ depositId, onComplete }: Props) {
  const { data } = usePaymentStatus(depositId, true);
  const status = data?.data.status;

  useEffect(() => {
    if (status === 'COMPLETED') onComplete?.();
  }, [status, onComplete]);

  return (
    <Card className={cn(status === 'FAILED' && 'border-error/30')}>
      <p className={cn('font-semibold', statusTextClass(status))}>{statusMessage(status)}</p>
      <p className={cn('mt-1 text-sm', statusTextClass(status))}>
        Status: {status ?? 'PENDING'}
      </p>
      {depositId && (
        <p className="mt-2 text-xs text-muted-soft">Reference: {depositId}</p>
      )}
    </Card>
  );
}
