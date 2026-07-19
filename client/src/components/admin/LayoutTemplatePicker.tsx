import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { LayoutTemplateMeta } from '@/lib/branding-defaults';
import { useUpdateBranding } from '@/hooks/useAdminBranding';

type LayoutTemplatePickerProps = {
  layouts: LayoutTemplateMeta[];
  activeId: string;
};

export function LayoutTemplatePicker({ layouts, activeId }: LayoutTemplatePickerProps) {
  const updateBranding = useUpdateBranding();

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-foreground">UI layout</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Change header density and logo area across the platform.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            type="button"
            disabled={updateBranding.isPending}
            onClick={() => updateBranding.mutate({ layoutTemplateId: layout.id })}
            className={cn(
              'rounded-md border p-4 text-left transition-colors',
              activeId === layout.id
                ? 'border-primary ring-2 ring-primary/30'
                : 'border-border hover:border-muted-foreground/50',
            )}
          >
            <div className="mb-3 rounded-sm bg-muted">
              <div
                className={cn(
                  'border-b border-border bg-card',
                  layout.id === 'hero' && 'h-10',
                  layout.id === 'default' && 'h-6',
                  layout.id === 'minimal' && 'h-4',
                )}
              />
              <div className="h-8 bg-background/50" />
            </div>
            <p className="font-semibold text-foreground">{layout.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{layout.description}</p>
          </button>
        ))}
      </div>
    </Card>
  );
}
