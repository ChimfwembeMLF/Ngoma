import { useEffect, useState } from 'react';
import type { AdSessionStart } from '@/hooks/useAds';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

type AdGateModalProps = {
  session: AdSessionStart;
  onComplete: () => void;
  onCancel: () => void;
  completing: boolean;
  error?: string;
};

export function AdGateModal({
  session,
  onComplete,
  onCancel,
  completing,
  error,
}: AdGateModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(session.gateSeconds);

  useEffect(() => {
    setSecondsLeft(session.gateSeconds);
  }, [session.gateSeconds, session.sessionId]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const imageSrc = session.creative.imageUrl.startsWith('http')
    ? session.creative.imageUrl
    : session.creative.imageUrl.startsWith('/uploads')
      ? `${baseUrl}${session.creative.imageUrl}`
      : session.creative.imageUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-gate-title"
    >
      <Card className="w-full max-w-md space-y-4 p-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Sponsored</p>
        <div className="overflow-hidden rounded-md bg-muted">
          <img
            src={imageSrc}
            alt={session.creative.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
        <div>
          <h2 id="ad-gate-title" className="text-base font-medium text-foreground">
            {session.creative.title}
          </h2>
          {session.creative.clickUrl && (
            <a
              href={session.creative.clickUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-primary underline"
            >
              Learn more
            </a>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {secondsLeft > 0
            ? `Download available in ${secondsLeft}…`
            : 'You can download now'}
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <Button onClick={onComplete} disabled={secondsLeft > 0 || completing}>
            {completing ? 'Starting download…' : 'Download now'}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={completing}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
