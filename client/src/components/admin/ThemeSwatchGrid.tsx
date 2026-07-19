import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ThemePresetMeta } from '@/lib/theme-presets';

type ThemeSwatchGridProps = {
  presets: ThemePresetMeta[];
  activePresetId: string;
  selectedPresetId: string;
  onSelect: (presetId: string) => void;
};

export function ThemeSwatchGrid({
  presets,
  activePresetId,
  selectedPresetId,
  onSelect,
}: ThemeSwatchGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {presets.map((preset) => {
        const isSelected = selectedPresetId === preset.id;
        const isActive = activePresetId === preset.id;

        return (
          <button
            key={preset.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(preset.id)}
            className="text-left"
          >
            <Card
              className={cn(
                'cursor-pointer space-y-3 p-4 transition-colors hover:border-primary/50',
                isSelected && 'ring-2 ring-primary',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground">{preset.name}</p>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                </div>
                {isActive && (
                  <span className="flex items-center gap-1 text-xs text-primary">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    Active
                  </span>
                )}
              </div>
              <div className="flex gap-2" aria-hidden>
                {preset.preview.map((color, i) => (
                  <span
                    key={`${preset.id}-${i}`}
                    className="h-8 w-8 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
