import { createContext, useContext, type ReactNode } from 'react';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';
import type { BrandingConfig } from '@/lib/branding-defaults';
import { DEFAULT_BRANDING } from '@/lib/branding-defaults';
import { selectBranding, usePlatformBranding } from '@/hooks/usePlatformBranding';

type BrandingContextValue = {
  branding: BrandingConfig;
  isLoading: boolean;
};

const BrandingContext = createContext<BrandingContextValue>({
  branding: DEFAULT_BRANDING,
  isLoading: true,
});

export function BrandingProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = usePlatformBranding();
  const branding = selectBranding(data);

  return (
    <BrandingContext.Provider value={{ branding, isLoading }}>
      <AnimatedBackground background={branding.background} />
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
