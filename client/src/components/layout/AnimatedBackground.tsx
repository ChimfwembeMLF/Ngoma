import { cn } from '@/lib/utils';
import type { BrandingBackground } from '@/lib/branding-defaults';

const ANIMATED_CLASS: Record<string, string> = {
  'gradient-drift': 'ngoma-bg-gradient-drift',
  aurora: 'ngoma-bg-aurora',
  'mesh-pulse': 'ngoma-bg-mesh-pulse',
  starfield: 'ngoma-bg-starfield',
};

type AnimatedBackgroundProps = {
  background: BrandingBackground;
};

export function AnimatedBackground({ background }: AnimatedBackgroundProps) {
  if (background.type === 'none') {
    return null;
  }

  const overlayStyle = { opacity: background.overlayOpacity };

  if (background.type === 'image' && background.imageUrl) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${background.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-black" style={overlayStyle} />
      </div>
    );
  }

  if (background.type === 'animated' && background.animatedId) {
    const animClass = ANIMATED_CLASS[background.animatedId];
    if (!animClass) return null;

    return (
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className={cn('absolute inset-0', animClass)} />
        <div className="absolute inset-0 bg-black" style={overlayStyle} />
      </div>
    );
  }

  return null;
}
