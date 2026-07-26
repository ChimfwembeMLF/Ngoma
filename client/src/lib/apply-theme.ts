import {
  BRAND_THEME_KEYS,
  DEFAULT_LIGHT_THEME,
  DEFAULT_THEME,
  type ThemeTokenKey,
  type ThemeTokens,
  themeVarName,
} from './theme-defaults';
import type { ResolvedColorMode } from './color-mode';

export function resolveThemeForMode(
  platformTheme: Partial<ThemeTokens>,
  mode: ResolvedColorMode,
): ThemeTokens {
  if (mode === 'dark') {
    return { ...DEFAULT_THEME, ...platformTheme };
  }

  const brand: Partial<ThemeTokens> = {};
  for (const key of BRAND_THEME_KEYS) {
    if (platformTheme[key]) brand[key] = platformTheme[key];
  }
  return { ...DEFAULT_LIGHT_THEME, ...brand };
}

export function applyTheme(
  theme: Partial<Record<ThemeTokenKey, string>>,
  mode: ResolvedColorMode = 'dark',
) {
  const root = document.documentElement;
  const merged = resolveThemeForMode(theme, mode);

  for (const key of Object.keys(merged) as ThemeTokenKey[]) {
    root.style.setProperty(themeVarName(key), merged[key]);
  }
}

export function clearThemeOverrides() {
  const root = document.documentElement;
  for (const key of Object.keys(DEFAULT_THEME) as ThemeTokenKey[]) {
    root.style.removeProperty(themeVarName(key));
  }
}
