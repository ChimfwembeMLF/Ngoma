import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { apiFetch } from '@/lib/api-client';
import { applyTheme } from '@/lib/apply-theme';
import { DEFAULT_THEME, type ThemeTokens } from '@/lib/theme-defaults';
import type { ThemePresetMeta } from '@/lib/theme-presets';

type ThemeResponse = {
  success: boolean;
  data: {
    theme: ThemeTokens;
    activePresetId: string;
    presets: ThemePresetMeta[];
    overrides: Partial<ThemeTokens>;
    defaults: ThemeTokens;
    updatedAt?: string;
  };
};

type ThemeContextValue = {
  theme: ThemeTokens;
  isLoading: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  isLoading: true,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ['platform', 'theme'],
    queryFn: () => apiFetch<ThemeResponse>('/api/v1/platform/theme'),
    staleTime: 60_000,
  });

  const theme = data?.data.theme ?? DEFAULT_THEME;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
