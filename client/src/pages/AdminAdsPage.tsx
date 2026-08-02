import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import {
  useAdminAdsConfig,
  useAdminCreatives,
  useCreateCreative,
  useDeleteCreative,
  useUpdateAdsConfig,
  useUpdateCreative,
  useUploadAdImage,
} from '@/hooks/useAds';

export function AdminAdsPage() {
  const { data: configData, isLoading: configLoading } = useAdminAdsConfig();
  const { data: creativesData, isLoading: creativesLoading } = useAdminCreatives();
  const updateConfig = useUpdateAdsConfig();
  const createCreative = useCreateCreative();
  const updateCreative = useUpdateCreative();
  const deleteCreative = useDeleteCreative();
  const uploadImage = useUploadAdImage();

  const config = configData?.data;
  const creatives = creativesData?.data ?? [];

  const [title, setTitle] = useState('');
  const [clickUrl, setClickUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [gateSeconds, setGateSeconds] = useState('30');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const saveConfig = async () => {
    setError('');
    setMessage('');
    try {
      await updateConfig.mutateAsync({
        adsEnabled: config?.adsEnabled ?? true,
        gateSeconds: Number(gateSeconds) || 5,
      });
      setMessage('Ad settings saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    }
  };

  const toggleAds = async () => {
    if (!config) return;
    setError('');
    try {
      await updateConfig.mutateAsync({ adsEnabled: !config.adsEnabled });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  const handleImageUpload = async (file: File) => {
    setError('');
    try {
      const res = await uploadImage.mutateAsync(file);
      setImageUrl(res.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const addCreative = async () => {
    setError('');
    setMessage('');
    if (!title.trim() || !imageUrl.trim()) {
      setError('Title and banner image are required');
      return;
    }
    try {
      await createCreative.mutateAsync({
        title: title.trim(),
        imageUrl,
        clickUrl: clickUrl.trim() || undefined,
        isActive: true,
      });
      setTitle('');
      setClickUrl('');
      setImageUrl('');
      setMessage('Creative added');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add creative');
    }
  };

  const toggleCreative = async (id: string, isActive: boolean) => {
    setError('');
    try {
      await updateCreative.mutateAsync({ id, isActive: !isActive });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update creative');
    }
  };

  const removeCreative = async (id: string) => {
    setError('');
    try {
      await deleteCreative.mutateAsync(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete creative');
    }
  };

  return (
    <AppShell maxWidth="6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-medium text-foreground">Admin — Ads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage house ad banners shown before free track downloads.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin" className={buttonVariants({ variant: 'outline' })}>
            Overview
          </Link>
          <Link to="/admin/branding" className={buttonVariants({ variant: 'outline' })}>
            Branding
          </Link>
          <Link to="/dashboard" className={buttonVariants({ variant: 'outline' })}>
            Dashboard
          </Link>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-destructive/30 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}
      {message && <p className="mb-4 text-sm text-muted-foreground">{message}</p>}

      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Platform settings</h2>
          {configLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="gate-seconds">Gate countdown (seconds)</Label>
                <Input
                  id="gate-seconds"
                  type="number"
                  min={1}
                  max={60}
                  value={gateSeconds}
                  onChange={(e) => setGateSeconds(e.target.value)}
                  className="w-32"
                />
              </div>
              <Button onClick={saveConfig} disabled={updateConfig.isPending}>
                Save settings
              </Button>
              <Button variant="outline" onClick={toggleAds} disabled={updateConfig.isPending}>
                {config?.adsEnabled ? 'Disable ads' : 'Enable ads'}
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Google AdSense</h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {import.meta.env.VITE_ADSENSE_PUBLISHER_ID ? (
                <span className="text-emerald-600">✅ Publisher configured</span>
              ) : (
                <span className="text-amber-600">⚠️ Not configured</span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              Google Ads are currently{' '}
              <strong className="text-foreground">
                {config?.googleAdsEnabled === false ? 'disabled' : 'enabled'}
              </strong>
              .
            </p>
            <Button
              variant="outline"
              onClick={() => {
                if (config) {
                  void updateConfig.mutateAsync({
                    googleAdsEnabled: !config.googleAdsEnabled,
                  });
                }
              }}
              disabled={!config || updateConfig.isPending}
            >
              {config?.googleAdsEnabled === false ? 'Enable Google Ads' : 'Disable Google Ads'}
            </Button>
            {!import.meta.env.VITE_ADSENSE_PUBLISHER_ID && (
              <p className="text-sm text-muted-foreground">
                Set VITE_ADSENSE_PUBLISHER_ID in client/.env and restart the dev server
              </p>
            )}
            <div className="rounded-md border border-border bg-slate-50 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Required AdSense env vars</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li><code>VITE_ADSENSE_PUBLISHER_ID</code> — Google AdSense publisher ID</li>
                <li><code>VITE_ADSENSE_SLOT_GATE</code> — ad-gate modal slot</li>
                <li><code>VITE_ADSENSE_SLOT_DISCOVER</code> — Discover page slot</li>
                <li><code>VITE_ADSENSE_SLOT_TRACK</code> — Track detail page slot</li>
                <li><code>VITE_ADSENSE_SLOT_ARTIST</code> — Public artist profile slot</li>
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                When Google Ads is enabled, manual ad placements only render if the corresponding slot IDs are configured.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Add creative</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ad-title">Title</Label>
              <Input id="ad-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ad-click">Click URL (optional)</Label>
              <Input
                id="ad-click"
                value={clickUrl}
                onChange={(e) => setClickUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ad-image">Banner image</Label>
              <Input
                id="ad-image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleImageUpload(file);
                }}
              />
              {imageUrl && (
                <img src={imageUrl} alt="Preview" className="mt-2 h-24 rounded-md object-cover" />
              )}
            </div>
          </div>
          <Button className="mt-4" onClick={addCreative} disabled={createCreative.isPending}>
            Add creative
          </Button>
        </Card>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Creatives</h2>
          {creativesLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : creatives.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No creatives yet. Listeners will see the Ngoma placeholder banner.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {creatives.map((creative) => (
                <Card key={creative.id} className="overflow-hidden">
                  <img
                    src={creative.imageUrl}
                    alt={creative.title}
                    className="aspect-[16/9] w-full object-cover"
                  />
                  <div className="space-y-3 p-4">
                    <p className="font-medium text-foreground">{creative.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {creative.isActive ? 'Active' : 'Inactive'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleCreative(creative.id, creative.isActive)}
                      >
                        {creative.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeCreative(creative.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
