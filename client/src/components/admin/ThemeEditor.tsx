import { useEffect, useState } from 'react';
import {
  DEFAULT_THEME,
  THEME_GROUPS,
  formatTokenLabel,
  type ThemeTokenKey,
  type ThemeTokens,
} from '@/lib/theme-defaults';
import {
  CUSTOM_PRESET_ID,
  previewTokensForPreset,
  type ThemePresetMeta,
} from '@/lib/theme-presets';
import { applyTheme } from '@/lib/apply-theme';
import { ThemeSwatchGrid } from '@/components/admin/ThemeSwatchGrid';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  useApplyThemePreset,
  useResetAdminTheme,
  useUpdateAdminTheme,
} from '@/hooks/useAdminTheme';

type ThemeEditorProps = {
  presets: ThemePresetMeta[];
  activePresetId: string;
  initialTheme: ThemeTokens;
};

export function ThemeEditor({ presets, activePresetId, initialTheme }: ThemeEditorProps) {
  const applyPreset = useApplyThemePreset();
  const updateTheme = useUpdateAdminTheme();
  const resetTheme = useResetAdminTheme();

  const [selectedPresetId, setSelectedPresetId] = useState(activePresetId);
  const [draft, setDraft] = useState<ThemeTokens>(initialTheme);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [savedPresetId, setSavedPresetId] = useState(activePresetId);
  const [savedTheme, setSavedTheme] = useState<ThemeTokens>(initialTheme);

  useEffect(() => {
    setSelectedPresetId(activePresetId);
    setDraft(initialTheme);
    setSavedPresetId(activePresetId);
    setSavedTheme(initialTheme);
  }, [activePresetId, initialTheme]);

  useEffect(() => {
    applyTheme(draft);
  }, [draft]);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setDraft((prev) => ({
      ...prev,
      ...previewTokensForPreset(presetId),
    }));
  };

  const setToken = (key: ThemeTokenKey, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const presetChanged = selectedPresetId !== savedPresetId && selectedPresetId !== CUSTOM_PRESET_ID;
  const themeChanged = (Object.keys(DEFAULT_THEME) as ThemeTokenKey[]).some(
    (key) => draft[key] !== savedTheme[key],
  );
  const hasChanges = presetChanged || themeChanged;
  const isCustom =
    selectedPresetId === CUSTOM_PRESET_ID ||
    activePresetId === CUSTOM_PRESET_ID ||
    (themeChanged && !presetChanged);

  const handleSave = async () => {
    if (presetChanged) {
      await applyPreset.mutateAsync(selectedPresetId);
    } else if (themeChanged) {
      const changes: Partial<ThemeTokens> = {};
      for (const key of Object.keys(DEFAULT_THEME) as ThemeTokenKey[]) {
        if (draft[key] !== savedTheme[key]) {
          changes[key] = draft[key];
        }
      }
      await updateTheme.mutateAsync({ theme: changes });
    }
  };

  const handleRevertDraft = () => {
    setSelectedPresetId(savedPresetId);
    setDraft({ ...savedTheme });
  };

  const handleReset = async () => {
    await resetTheme.mutateAsync();
    setSelectedPresetId('spotify');
    setDraft({ ...DEFAULT_THEME, ...previewTokensForPreset('spotify') });
  };

  const saving = applyPreset.isPending || updateTheme.isPending;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Theme presets
            </h2>
            {isCustom && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Custom variant
              </span>
            )}
          </div>
          <ThemeSwatchGrid
            presets={presets}
            activePresetId={savedPresetId === CUSTOM_PRESET_ID ? activePresetId : savedPresetId}
            selectedPresetId={
              selectedPresetId === CUSTOM_PRESET_ID ? savedPresetId : selectedPresetId
            }
            onSelect={handleSelectPreset}
          />
        </section>

        <details
          className="group rounded-lg border border-border"
          open={advancedOpen}
          onToggle={(e) => setAdvancedOpen((e.target as HTMLDetailsElement).open)}
        >
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground">
            Advanced customization
          </summary>
          <div className="space-y-6 border-t border-border p-4">
            {THEME_GROUPS.map((group) => (
              <div key={group.label} className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {group.label}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.keys.map((key) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`theme-${key}`}>{formatTokenLabel(key)}</Label>
                      <div className="flex items-center gap-2">
                        <input
                          id={`theme-${key}`}
                          type="color"
                          value={draft[key]}
                          onChange={(e) => setToken(key, e.target.value)}
                          className="h-10 w-12 cursor-pointer rounded border border-border bg-transparent p-1"
                        />
                        <Input
                          value={draft[key]}
                          onChange={(e) => setToken(key, e.target.value)}
                          className="font-mono text-sm uppercase"
                          maxLength={7}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>

        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={handleSave} disabled={!hasChanges || saving}>
            {saving ? 'Saving…' : 'Save theme'}
          </Button>
          <Button type="button" variant="outline" onClick={handleRevertDraft} disabled={!hasChanges}>
            Revert draft
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleReset}
            disabled={resetTheme.isPending}
          >
            {resetTheme.isPending ? 'Resetting…' : 'Reset to defaults'}
          </Button>
        </div>

        {(applyPreset.isSuccess || updateTheme.isSuccess) && (
          <p className="text-sm text-primary">Theme saved successfully.</p>
        )}
        {resetTheme.isSuccess && (
          <p className="text-sm text-primary">Theme reset to defaults.</p>
        )}
      </div>

      <Card className="h-fit space-y-4 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Preview
        </h2>
        <div className="space-y-3 rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-foreground">Track card</p>
          <p className="text-xs text-muted-foreground">Artist name · 3:42</p>
          <Button type="button" size="sm">
            Play
          </Button>
        </div>
        <div className="space-y-2 rounded-lg border border-border bg-muted p-4">
          <p className="text-xs text-muted-foreground">Muted surface</p>
          <Button type="button" variant="outline" size="sm">
            Secondary
          </Button>
        </div>
        <p className="text-xs text-destructive">Error / destructive text sample</p>
      </Card>
    </div>
  );
}
