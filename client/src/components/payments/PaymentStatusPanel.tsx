import { useEffect } from 'react';
import { usePaymentStatus } from '@/hooks/usePayments';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  depositId: string;
  onComplete?: () => void;
  onRetry?: () => void;
  completedMessage?: string;
};

function statusMessage(status: string | undefined, customCompleted?: string) {
  switch (status) {
    case 'COMPLETED':
      return customCompleted ?? 'Payment completed!';
    case 'FAILED':
      return 'Payment failed. Please try again.';
    default:
      return 'Waiting for payment confirmation...';
  }
}

function statusTextClass(status: string | undefined) {
  switch (status) {
    case 'COMPLETED':
      return 'text-foreground';
    case 'FAILED':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
}

export function PaymentStatusPanel({
  depositId,
  onComplete,
  onRetry,
  completedMessage,
}: Props) {
  const { data } = usePaymentStatus(depositId, true);
  const status = data?.data.status;
  const errorMessage = data?.data.errorMessage;

  useEffect(() => {
    if (status === 'COMPLETED') onComplete?.();
  }, [status, onComplete]);

  return (
    <Card className={cn('p-6', status === 'FAILED' && 'border-destructive/30')}>
      <p className={cn('font-semibold', statusTextClass(status))}>
        {statusMessage(status, completedMessage)}
      </p>
      <p className={cn('mt-1 text-sm', statusTextClass(status))}>
        Status: {status ?? 'PENDING'}
      </p>
      {errorMessage && status === 'FAILED' && (
        <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
      )}
      {depositId && (
        <p className="mt-2 text-xs text-muted-foreground/80">Reference: {depositId}</p>
      )}
      {status === 'FAILED' && onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Card>
  );
}
