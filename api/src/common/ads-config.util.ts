export type AdsConfig = {
  adsEnabled: boolean;
  gateSeconds: number;
  googleAdsEnabled: boolean;
};

export const DEFAULT_ADS_CONFIG: AdsConfig = {
  adsEnabled: true,
  gateSeconds: 30,
  googleAdsEnabled: true,
};

export function mergeAdsConfig(raw?: Partial<AdsConfig> | null): AdsConfig {
  return {
    adsEnabled: raw?.adsEnabled ?? DEFAULT_ADS_CONFIG.adsEnabled,
    gateSeconds: raw?.gateSeconds ?? DEFAULT_ADS_CONFIG.gateSeconds,
    googleAdsEnabled: raw?.googleAdsEnabled ?? DEFAULT_ADS_CONFIG.googleAdsEnabled,
  };
}
