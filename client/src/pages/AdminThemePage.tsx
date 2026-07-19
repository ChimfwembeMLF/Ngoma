import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ThemeEditor } from '@/components/admin/ThemeEditor';
import { Card } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { useAdminTheme } from '@/hooks/useAdminTheme';
import { DEFAULT_THEME } from '@/lib/theme-defaults';
import { FALLBACK_PRESETS } from '@/lib/theme-presets';

export function AdminThemePage() {
  const { data, isLoading, error } = useAdminTheme();

  const theme = data?.data.theme ?? DEFAULT_THEME;
  const presets = data?.data.presets ?? FALLBACK_PRESETS;
  const activePresetId = data?.data.activePresetId ?? 'spotify';

  return (
    <AppShell maxWidth="6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-medium text-foreground">Admin — Theme</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a preset swatch to brand the platform. Changes apply to all users immediately.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/users" className={buttonVariants({ variant: 'outline' })}>
            Users
          </Link>
          <Link to="/dashboard" className={buttonVariants({ variant: 'outline' })}>
            Dashboard
          </Link>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading theme…</p>}

      {error && (
        <Card className="border-destructive/30 bg-muted p-6">
          <p className="text-sm text-destructive">Failed to load theme settings</p>
        </Card>
      )}

      {!isLoading && !error && (
        <ThemeEditor
          presets={presets}
          activePresetId={activePresetId}
          initialTheme={theme}
        />
      )}
    </AppShell>
  );
}
