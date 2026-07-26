/** Dark palette — also the platform default / admin theme baseline */
export const DEFAULT_THEME = {
  background: '#121212',
  foreground: '#ffffff',
  card: '#181818',
  cardForeground: '#ffffff',
  popover: '#282828',
  popoverForeground: '#ffffff',
  primary: '#1ed760',
  primaryForeground: '#000000',
  secondary: '#1f1f1f',
  secondaryForeground: '#ffffff',
  muted: '#1f1f1f',
  mutedForeground: '#b3b3b3',
  accent: '#282828',
  accentForeground: '#ffffff',
  destructive: '#f3727f',
  destructiveForeground: '#ffffff',
  border: '#4d4d4d',
  input: '#1f1f1f',
  ring: '#1ed760',
} as const;

/** Light surfaces — brand accents still come from platform theme */
export const DEFAULT_LIGHT_THEME = {
  background: '#f7f7f5',
  foreground: '#121212',
  card: '#ffffff',
  cardForeground: '#121212',
  popover: '#ffffff',
  popoverForeground: '#121212',
  primary: '#1ed760',
  primaryForeground: '#000000',
  secondary: '#ecece8',
  secondaryForeground: '#121212',
  muted: '#ecece8',
  mutedForeground: '#5c5c5c',
  accent: '#e8e8e4',
  accentForeground: '#121212',
  destructive: '#dc2626',
  destructiveForeground: '#ffffff',
  border: '#d4d4d0',
  input: '#ffffff',
  ring: '#1ed760',
} as const;

export type ThemeTokens = typeof DEFAULT_THEME;
export type ThemeTokenKey = keyof ThemeTokens;

export const THEME_TOKEN_KEYS = Object.keys(DEFAULT_THEME) as ThemeTokenKey[];

/** Keys carried from admin/platform theme into light mode */
export const BRAND_THEME_KEYS: ThemeTokenKey[] = [
  'primary',
  'primaryForeground',
  'ring',
  'destructive',
  'destructiveForeground',
];

/** CSS variable name for a camelCase token key */
export function themeVarName(key: ThemeTokenKey): string {
  return `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
}

export const THEME_GROUPS: { label: string; keys: ThemeTokenKey[] }[] = [
  {
    label: 'Brand',
    keys: ['primary', 'primaryForeground', 'ring'],
  },
  {
    label: 'Surfaces',
    keys: ['background', 'foreground', 'card', 'cardForeground', 'muted', 'mutedForeground'],
  },
  {
    label: 'UI',
    keys: [
      'secondary',
      'secondaryForeground',
      'accent',
      'accentForeground',
      'popover',
      'popoverForeground',
      'border',
      'input',
    ],
  },
  {
    label: 'Feedback',
    keys: ['destructive', 'destructiveForeground'],
  },
];

export function formatTokenLabel(key: ThemeTokenKey): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}
