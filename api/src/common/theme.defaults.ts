/** Default shadcn CSS variable values (Spotify dark). Keys map to --kebab-case vars on the client. */
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

export type ThemeTokenKey = keyof typeof DEFAULT_THEME;

export const THEME_TOKEN_KEYS = Object.keys(DEFAULT_THEME) as ThemeTokenKey[];

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

export function isValidThemeColor(value: string): boolean {
  return HEX_COLOR.test(value);
}

export function mergeTheme(overrides: Partial<Record<ThemeTokenKey, string>> = {}) {
  const theme: Record<ThemeTokenKey, string> = { ...DEFAULT_THEME };
  for (const key of THEME_TOKEN_KEYS) {
    const value = overrides[key];
    if (value && isValidThemeColor(value)) {
      theme[key] = value;
    }
  }
  return theme;
}

export function sanitizeThemeInput(
  input: Record<string, unknown>,
): Partial<Record<ThemeTokenKey, string>> {
  const result: Partial<Record<ThemeTokenKey, string>> = {};
  for (const key of THEME_TOKEN_KEYS) {
    const value = input[key];
    if (typeof value === 'string' && isValidThemeColor(value)) {
      result[key] = value;
    }
  }
  return result;
}
