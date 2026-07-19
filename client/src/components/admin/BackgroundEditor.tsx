import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { AnimatedPresetMeta, BrandingConfig } from '@/lib/branding-defaults';
import { useUpdateBranding, useUploadBackgroundImage } from '@/hooks/useAdminBranding';

const ANIMATED_PREVIEW: Record<string, string> = {
  'gradient-drift': 'ngoma-bg-gradient-drift',
  aurora: 'ngoma-bg-aurora',
  'mesh-pulse': 'ngoma-bg-mesh-pulse',
  starfield: 'ngoma-bg-starfield',
};

type BackgroundEditorProps = {
  branding: BrandingConfig;
  animatedPresets: AnimatedPresetMeta[];
};

export function BackgroundEditor({ branding, animatedPresets }: BackgroundEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [overlay, setOverlay] = useState(Math.round(branding.background.overlayOpacity * 100));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const updateBranding = useUpdateBranding();
  const uploadBackground = useUploadBackgroundImage();

  const setType = async (type: 'none' | 'image' | 'animated', animatedId?: string) => {
    setError('');
    setMessage('');
    try {
      await updateBranding.mutateAsync({
        background: {
          type,
          imageUrl: type === 'image' ? branding.background.imageUrl : null,
          animatedId: type === 'animated' ? (animatedId ?? 'aurora') : null,
          overlayOpacity: overlay / 100,
        },
      });
      setMessage('Background updated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setMessage('');
    try {
      await uploadBackground.mutateAsync(file);
      setMessage('Background image uploaded');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const saveOverlay = async () => {
    setError('');
    setMessage('');
    try {
      await updateBranding.mutateAsync({
        background: {
          ...branding.background,
          overlayOpacity: overlay / 100,
        },
      });
      setMessage('Overlay saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-foreground">Background</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Full-page static image or CSS animated preset behind all pages.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(['none', 'image', 'animated'] as const).map((type) => (
          <Button
            key={type}
            type="button"
            variant={branding.background.type === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setType(type, branding.background.animatedId ?? 'aurora')}
          >
            {type === 'none' ? 'None' : type === 'image' ? 'Static image' : 'Animated'}
          </Button>
        ))}
      </div>

      {branding.background.type === 'image' && (
        <div className="mt-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(e) => handleUpload(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploadBackground.isPending}
            onClick={() => fileRef.current?.click()}
          >
            {uploadBackground.isPending ? 'Uploading…' : 'Upload background image'}
          </Button>
          {branding.background.imageUrl && (
            <div
              className="mt-3 h-24 rounded-md bg-cover bg-center"
              style={{ backgroundImage: `url(${branding.background.imageUrl})` }}
            />
          )}
        </div>
      )}

      {branding.background.type === 'animated' && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {animatedPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setType('animated', preset.id)}
              className={cn(
                'overflow-hidden rounded-md border text-left transition-colors',
                branding.background.animatedId === preset.id
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border hover:border-muted-foreground/50',
              )}
            >
              <div className={cn('h-20 w-full', ANIMATED_PREVIEW[preset.id])} />
              <div className="p-2">
                <p className="text-xs font-semibold text-foreground">{preset.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {branding.background.type !== 'none' && (
        <div className="mt-6 space-y-2">
          <Label htmlFor="overlay-opacity">Dark overlay: {overlay}%</Label>
          <input
            id="overlay-opacity"
            type="range"
            min={0}
            max={80}
            value={overlay}
            onChange={(e) => setOverlay(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <Button type="button" variant="outline" size="sm" onClick={saveOverlay}>
            Save overlay
          </Button>
        </div>
      )}

      {message && <p className="mt-3 text-sm text-primary">{message}</p>}
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </Card>
  );
}
