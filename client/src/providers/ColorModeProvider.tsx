import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  applyColorModeClass,
  readStoredColorMode,
  resolveColorMode,
  writeStoredColorMode,
  type ColorMode,
  type ResolvedColorMode,
} from '@/lib/color-mode';

type ColorModeContextValue = {
  mode: ColorMode;
  resolvedMode: ResolvedColorMode;
  setMode: (mode: ColorMode) => void;
  cycleMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'system',
  resolvedMode: 'dark',
  setMode: () => undefined,
  cycleMode: () => undefined,
});

const CYCLE: ColorMode[] = ['light', 'dark', 'system'];

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ColorMode>(() => readStoredColorMode());
  const [resolvedMode, setResolvedMode] = useState<ResolvedColorMode>(() =>
    resolveColorMode(readStoredColorMode()),
  );

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next);
    writeStoredColorMode(next);
    const resolved = resolveColorMode(next);
    setResolvedMode(resolved);
    applyColorModeClass(resolved);
  }, []);

  const cycleMode = useCallback(() => {
    setModeState((current) => {
      const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
      writeStoredColorMode(next);
      const resolved = resolveColorMode(next);
      setResolvedMode(resolved);
      applyColorModeClass(resolved);
      return next;
    });
  }, []);

  useEffect(() => {
    applyColorModeClass(resolvedMode);
  }, [resolvedMode]);

  useEffect(() => {
    if (mode !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const resolved = resolveColorMode('system');
      setResolvedMode(resolved);
      applyColorModeClass(resolved);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, resolvedMode, setMode, cycleMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  return useContext(ColorModeContext);
}
