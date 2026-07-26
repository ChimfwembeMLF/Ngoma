export type AdsConfig = {
  adsEnabled: boolean;
  gateSeconds: number;
};

export const DEFAULT_ADS_CONFIG: AdsConfig = {
  adsEnabled: true,
  gateSeconds: 5,
};

export function mergeAdsConfig(raw?: Partial<AdsConfig> | null): AdsConfig {
  return {
    adsEnabled: raw?.adsEnabled ?? DEFAULT_ADS_CONFIG.adsEnabled,
    gateSeconds: raw?.gateSeconds ?? DEFAULT_ADS_CONFIG.gateSeconds,
  };
}
