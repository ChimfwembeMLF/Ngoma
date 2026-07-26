export type ColorMode = 'light' | 'dark' | 'system';
export type ResolvedColorMode = 'light' | 'dark';

export const COLOR_MODE_STORAGE_KEY = 'ngoma-color-mode';

export function isColorMode(value: unknown): value is ColorMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function readStoredColorMode(): ColorMode {
  try {
    const raw = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (isColorMode(raw)) return raw;
  } catch {
    /* ignore */
  }
  return 'system';
}

export function writeStoredColorMode(mode: ColorMode) {
  try {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}

export function getSystemColorMode(): ResolvedColorMode {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveColorMode(mode: ColorMode): ResolvedColorMode {
  return mode === 'system' ? getSystemColorMode() : mode;
}

export function applyColorModeClass(resolved: ResolvedColorMode) {
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
}
