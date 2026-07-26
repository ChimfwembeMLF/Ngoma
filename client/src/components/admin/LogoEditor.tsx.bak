import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { BrandingConfig } from '@/lib/branding-defaults';
import { useRemoveLogo, useUpdateBranding, useUploadLogo } from '@/hooks/useAdminBranding';

type LogoEditorProps = {
  branding: BrandingConfig;
};

export function LogoEditor({ branding }: LogoEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState(branding.logoWidth);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const uploadLogo = useUploadLogo();
  const removeLogo = useRemoveLogo();
  const updateBranding = useUpdateBranding();

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setMessage('');
    try {
      await uploadLogo.mutateAsync(file);
      setMessage('Logo uploaded');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const handleSaveWidth = async () => {
    setError('');
    setMessage('');
    try {
      await updateBranding.mutateAsync({ logoWidth: width });
      setMessage('Logo size saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const handleRemove = async () => {
    setError('');
    setMessage('');
    try {
      await removeLogo.mutateAsync();
      setWidth(120);
      setMessage('Logo removed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Remove failed');
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-foreground">Logo</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload PNG, JPG, WebP, or SVG. Adjust display width without re-uploading.
      </p>

      <div className="mt-4 flex min-h-[80px] items-center justify-center rounded-md border border-border bg-muted/30 p-4">
        {branding.logoUrl ? (
          <img
            src={branding.logoUrl}
            alt="Platform logo preview"
            style={{ width }}
            className="h-auto max-h-16 object-contain"
          />
        ) : (
          <span className="text-lg font-bold text-muted-foreground">Ngoma</span>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="sr-only"
        onChange={(e) => handleUpload(e.target.files?.[0])}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="default"
          disabled={uploadLogo.isPending}
          onClick={() => fileRef.current?.click()}
        >
          {uploadLogo.isPending ? 'Uploading…' : branding.logoUrl ? 'Replace logo' : 'Upload logo'}
        </Button>
        {branding.logoUrl && (
          <Button type="button" variant="outline" disabled={removeLogo.isPending} onClick={handleRemove}>
            Remove logo
          </Button>
        )}
      </div>

      <div className="mt-6 space-y-2">
        <Label htmlFor="logo-width">Display width: {width}px</Label>
        <input
          id="logo-width"
          type="range"
          min={48}
          max={320}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={updateBranding.isPending || width === branding.logoWidth}
          onClick={handleSaveWidth}
        >
          Save width
        </Button>
      </div>

      {message && <p className="mt-3 text-sm text-primary">{message}</p>}
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </Card>
  );
}
