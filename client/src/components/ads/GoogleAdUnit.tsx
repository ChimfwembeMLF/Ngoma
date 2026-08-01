import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>> & {
      push: (config: Record<string, unknown>) => number;
    };
  }
}

type GoogleAdUnitProps = {
  slotId: string;
  format: 'auto' | 'rectangle' | 'leaderboard';
  className?: string;
};

export function GoogleAdUnit({ slotId, format, className }: GoogleAdUnitProps) {
  const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (!publisherId || !slotId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers and unavailable AdSense scripts are safe no-op cases.
    }
  }, [publisherId, slotId]);

  if (!publisherId || !slotId) return null;

  return (
    <ins
      className={`adsbygoogle block max-w-full ${className ?? ''}`.trim()}
      style={{ display: 'block' }}
      data-ad-client={publisherId}
      data-ad-slot={slotId}
      data-ad-format={format === 'leaderboard' ? 'horizontal' : format}
      data-full-width-responsive="true"
    />
  );
}