import { useEffect } from 'react';
import { usePaymentStatus } from '@/hooks/usePayments';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  depositId: string;
  pendingMessage?: string;
  onComplete?: () => void;
  onRetry?: () => void;
  completedMessage?: string;
};

function isPendingStatus(status: string | undefined) {
  return !status || status === 'PENDING' || status === 'INITIATED';
}

function statusMessage(
  status: string | undefined,
  options: {
    completedMessage?: string;
    pendingMessage?: string;
    errorMessage?: string | null;
  },
) {
  if (status === 'COMPLETED') {
    return options.completedMessage ?? 'Payment completed!';
  }
  if (status === 'FAILED') {
    return (
      options.errorMessage ??
      'Payment did not go through. Approve the prompt on your phone or try again.'
    );
  }
  return options.pendingMessage ?? 'Check your phone and approve the mobile money prompt.';
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

function statusDetail(status: string | undefined) {
  if (isPendingStatus(status)) {
    return 'Waiting for confirmation on your phone…';
  }
  if (status === 'COMPLETED') {
    return 'Payment confirmed';
  }
  if (status === 'FAILED') {
    return 'Payment not completed';
  }
  return null;
}

export function PaymentStatusPanel({
  depositId,
  pendingMessage,
  onComplete,
  onRetry,
  completedMessage,
}: Props) {
  const { data } = usePaymentStatus(depositId, true);
  const status = data?.data.status;
  const errorMessage = data?.data.errorMessage;
  const detail = statusDetail(status);

  useEffect(() => {
    if (status === 'COMPLETED') onComplete?.();
  }, [status, onComplete]);

  return (
    <Card className={cn('p-6', status === 'FAILED' && 'border-destructive/30')}>
      <p className={cn('font-semibold', statusTextClass(status))}>
        {statusMessage(status, { completedMessage, pendingMessage, errorMessage })}
      </p>
      {detail && (
        <p className={cn('mt-1 text-sm', statusTextClass(status))}>{detail}</p>
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
