import { DEFAULT_THEME, mergeTheme, type ThemeTokenKey } from './theme.defaults';

export const CUSTOM_PRESET_ID = 'custom';

export type ThemePresetDefinition = {
  id: string;
  name: string;
  description: string;
  preview: [string, string, string, string];
  tokens: Partial<Record<ThemeTokenKey, string>>;
};

export const THEME_PRESETS: Record<string, ThemePresetDefinition> = {
  spotify: {
    id: 'spotify',
    name: 'Spotify Green',
    description: 'Default Ngoma dark palette',
    preview: ['#1ed760', '#121212', '#181818', '#b3b3b3'],
    tokens: {
      primary: '#1ed760',
      primaryForeground: '#000000',
      ring: '#1ed760',
    },
  },
  terracotta: {
    id: 'terracotta',
    name: 'Ngoma Terracotta',
    description: 'Warm brand accent from product requirements',
    preview: ['#C0672E', '#121212', '#181818', '#b3b3b3'],
    tokens: {
      primary: '#C0672E',
      primaryForeground: '#ffffff',
      ring: '#C0672E',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Cool blue accent on dark surfaces',
    preview: ['#3B82F6', '#121212', '#181818', '#b3b3b3'],
    tokens: {
      primary: '#3B82F6',
      primaryForeground: '#ffffff',
      ring: '#3B82F6',
    },
  },
  violet: {
    id: 'violet',
    name: 'Violet Pulse',
    description: 'Purple accent for bold branding',
    preview: ['#A855F7', '#121212', '#181818', '#b3b3b3'],
    tokens: {
      primary: '#A855F7',
      primaryForeground: '#ffffff',
      ring: '#A855F7',
    },
  },
  amber: {
    id: 'amber',
    name: 'Warm Amber',
    description: 'Golden warm accent',
    preview: ['#F59E0B', '#121212', '#181818', '#b3b3b3'],
    tokens: {
      primary: '#F59E0B',
      primaryForeground: '#000000',
      ring: '#F59E0B',
    },
  },
  rose: {
    id: 'rose',
    name: 'Rose Signal',
    description: 'Bold red-pink accent',
    preview: ['#F43F5E', '#121212', '#181818', '#b3b3b3'],
    tokens: {
      primary: '#F43F5E',
      primaryForeground: '#ffffff',
      ring: '#F43F5E',
    },
  },
};

export const SELECTABLE_PRESET_IDS = Object.keys(THEME_PRESETS);

export function isSelectablePresetId(id: string): boolean {
  return id in THEME_PRESETS;
}

export function getPresetCatalogMetadata() {
  return SELECTABLE_PRESET_IDS.map((id) => {
    const preset = THEME_PRESETS[id];
    return {
      id: preset.id,
      name: preset.name,
      description: preset.description,
      preview: preset.preview,
    };
  });
}

export function resolvePresetTokens(presetId: string): Partial<Record<ThemeTokenKey, string>> {
  if (presetId === CUSTOM_PRESET_ID) {
    return THEME_PRESETS.spotify.tokens;
  }
  return THEME_PRESETS[presetId]?.tokens ?? THEME_PRESETS.spotify.tokens;
}

export function resolveThemeFromSettings(
  presetId: string,
  overrides: Partial<Record<ThemeTokenKey, string>> = {},
) {
  if (presetId === CUSTOM_PRESET_ID) {
    return mergeTheme(overrides);
  }
  return mergeTheme({ ...resolvePresetTokens(presetId), ...overrides });
}

export function overridesDifferFromPreset(
  presetId: string,
  overrides: Partial<Record<ThemeTokenKey, string>>,
): boolean {
  if (presetId === CUSTOM_PRESET_ID) {
    return Object.keys(overrides).length > 0;
  }
  const base = resolvePresetTokens(presetId);
  for (const [key, value] of Object.entries(overrides)) {
    const tokenKey = key as ThemeTokenKey;
    if (base[tokenKey] !== value && DEFAULT_THEME[tokenKey] !== value) {
      return true;
    }
  }
  return Object.keys(overrides).some((key) => {
    const tokenKey = key as ThemeTokenKey;
    const expected = base[tokenKey] ?? DEFAULT_THEME[tokenKey];
    return overrides[tokenKey] !== expected;
  });
}

export function computeOverridesFromDefault(
  theme: Partial<Record<ThemeTokenKey, string>>,
): Partial<Record<ThemeTokenKey, string>> {
  const result: Partial<Record<ThemeTokenKey, string>> = {};
  for (const [key, value] of Object.entries(theme) as [ThemeTokenKey, string][]) {
    if (value !== DEFAULT_THEME[key]) {
      result[key] = value;
    }
  }
  return result;
}
