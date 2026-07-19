import {
  DEFAULT_THEME,
  type ThemeTokenKey,
  themeVarName,
} from './theme-defaults';

export function applyTheme(theme: Partial<Record<ThemeTokenKey, string>>) {
  const root = document.documentElement;
  const merged = { ...DEFAULT_THEME, ...theme };

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
