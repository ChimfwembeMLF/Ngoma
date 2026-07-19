import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SavedBrandingTemplate, StarterBrandingTemplate } from '@/lib/branding-defaults';
import {
  useApplyBrandingTemplate,
  useDeleteBrandingTemplate,
  useSaveBrandingTemplate,
} from '@/hooks/useAdminBranding';

type BrandingTemplateGridProps = {
  starters: StarterBrandingTemplate[];
  saved: SavedBrandingTemplate[];
};

export function BrandingTemplateGrid({ starters, saved }: BrandingTemplateGridProps) {
  const [name, setName] = useState('');
  const [showSave, setShowSave] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const applyTemplate = useApplyBrandingTemplate();
  const saveTemplate = useSaveBrandingTemplate();
  const deleteTemplate = useDeleteBrandingTemplate();

  const handleApply = async (templateId: string, source: 'starter' | 'saved') => {
    setError('');
    setMessage('');
    try {
      await applyTemplate.mutateAsync({ templateId, source });
      setMessage('Template applied');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Apply failed');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await saveTemplate.mutateAsync(name.trim());
      setName('');
      setShowSave(false);
      setMessage('Template saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this saved template?')) return;
    setError('');
    try {
      await deleteTemplate.mutateAsync(id);
      setMessage('Template deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Templates</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Apply starter bundles or save your current branding to reuse later (max 10).
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => setShowSave((v) => !v)}>
          Save current
        </Button>
      </div>

      {showSave && (
        <form onSubmit={handleSave} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1 space-y-2">
            <Label htmlFor="template-name">Template name</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
            />
          </div>
          <Button type="submit" variant="default" disabled={saveTemplate.isPending}>
            Save
          </Button>
        </form>
      )}

      <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Starter templates
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {starters.map((starter) => (
          <div key={starter.id} className="rounded-md border border-border p-4">
            <div className="mb-2 flex gap-1">
              <span
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: starter.preview.primary }}
              />
              <span
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: starter.preview.accent }}
              />
            </div>
            <p className="font-semibold text-foreground">{starter.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{starter.description}</p>
            <Button
              type="button"
              size="sm"
              className="mt-3"
              disabled={applyTemplate.isPending}
              onClick={() => handleApply(starter.id, 'starter')}
            >
              Apply
            </Button>
          </div>
        ))}
      </div>

      {saved.length > 0 && (
        <>
          <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            My templates
          </h3>
          <ul className="mt-3 space-y-2">
            {saved.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-4 py-3"
              >
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Saved {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    disabled={applyTemplate.isPending}
                    onClick={() => handleApply(item.id, 'saved')}
                  >
                    Apply
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={deleteTemplate.isPending}
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {message && <p className="mt-4 text-sm text-primary">{message}</p>}
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </Card>
  );
}
