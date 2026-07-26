import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { BackgroundEditor } from '@/components/admin/BackgroundEditor';
import { BrandingTemplateGrid } from '@/components/admin/BrandingTemplateGrid';
import { LayoutTemplatePicker } from '@/components/admin/LayoutTemplatePicker';
import { LogoEditor } from '@/components/admin/LogoEditor';
import { Card } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { FormTabs } from '@/components/forms';
import { useAdminBranding } from '@/hooks/useAdminBranding';
import { DEFAULT_BRANDING } from '@/lib/branding-defaults';
import { hasActiveBackground } from '@/lib/branding-defaults';

export function AdminBrandingPage() {
  const { data, isLoading, error } = useAdminBranding();
  const branding = data?.data.branding ?? DEFAULT_BRANDING;
  const starters = data?.data.starters ?? [];
  const saved = data?.data.saved ?? [];
  const layouts = data?.data.layouts ?? [];
  const animatedPresets = data?.data.animatedPresets ?? [];

  const brandingTabs = [
    {
      id: 'logo',
      label: 'Logo',
      content: <LogoEditor branding={branding} />,
    },
    {
      id: 'background',
      label: 'Background',
      content: (
        <BackgroundEditor branding={branding} animatedPresets={animatedPresets} />
      ),
    },
    {
      id: 'layout',
      label: 'Layout',
      content: (
        <LayoutTemplatePicker layouts={layouts} activeId={branding.layoutTemplateId} />
      ),
    },
    {
      id: 'templates',
      label: 'Templates',
      content: <BrandingTemplateGrid starters={starters} saved={saved} />,
    },
  ];

  return (
    <AppShell maxWidth="6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-medium text-foreground">Admin — Branding</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Logo, backgrounds, layouts, and reusable templates for the whole platform.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin" className={buttonVariants({ variant: 'outline' })}>
            Overview
          </Link>
          <Link to="/admin/theme" className={buttonVariants({ variant: 'outline' })}>
            Theme
          </Link>
          <Link to="/admin/users" className={buttonVariants({ variant: 'outline' })}>
            Users
          </Link>
          <Link to="/dashboard" className={buttonVariants({ variant: 'outline' })}>
            Dashboard
          </Link>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading branding…</p>}

      {error && (
        <Card className="border-destructive/30 bg-muted p-6">
          <p className="text-sm text-destructive">Failed to load branding settings</p>
        </Card>
      )}

      {!isLoading && !error && (
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <FormTabs tabs={brandingTabs} defaultTabId="logo" />

          <aside className="hidden lg:block">
            <Card className="sticky top-8 overflow-hidden p-0">
              <p className="border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Live preview
              </p>
              <div className="relative min-h-[200px] bg-background">
                {hasActiveBackground(branding) && branding.background.type === 'animated' && (
                  <div className="absolute inset-0 opacity-60 ngoma-bg-aurora" />
                )}
                <div className="relative border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
                  {branding.logoUrl ? (
                    <img
                      src={branding.logoUrl}
                      alt=""
                      style={{ width: Math.min(branding.logoWidth, 160) }}
                      className="h-auto max-h-12 object-contain"
                    />
                  ) : (
                    <span className="font-bold text-foreground">Ngoma</span>
                  )}
                </div>
                <div className="relative p-4 text-xs text-muted-foreground">
                  Layout: {branding.layoutTemplateId}
                  <br />
                  Background: {branding.background.type}
                </div>
              </div>
            </Card>
          </aside>
        </div>
      )}
    </AppShell>
  );
}
