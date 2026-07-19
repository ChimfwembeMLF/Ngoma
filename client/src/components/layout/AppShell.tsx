import { Link } from 'react-router-dom';
import { getAccessToken } from '@/lib/auth-storage';
import { hasActiveBackground } from '@/lib/branding-defaults';
import { cn } from '@/lib/utils';
import { useBranding } from '@/providers/BrandingProvider';
import { buttonVariants } from '@/components/ui/button';

type MaxWidth = '6xl' | '4xl' | '3xl' | '2xl' | 'md';

const maxWidthClasses: Record<MaxWidth, string> = {
  '6xl': 'max-w-6xl',
  '4xl': 'max-w-4xl',
  '3xl': 'max-w-3xl',
  '2xl': 'max-w-2xl',
  md: 'max-w-md',
};

const layoutHeaderClasses = {
  default: 'py-4',
  minimal: 'py-2',
  hero: 'py-8',
} as const;

const layoutNavClasses = {
  default: '',
  minimal: 'text-sm',
  hero: '',
} as const;

const layoutLogoMaxHeight = {
  default: 'max-h-16',
  minimal: 'max-h-12',
  hero: 'max-h-24',
} as const;

type AppShellProps = {
  children: React.ReactNode;
  maxWidth?: MaxWidth;
  centered?: boolean;
  className?: string;
};

export function AppShell({
  children,
  maxWidth = '6xl',
  centered = false,
  className,
}: AppShellProps) {
  const isLoggedIn = !!getAccessToken();
  const { branding } = useBranding();
  const layout = branding.layoutTemplateId;
  const bgActive = hasActiveBackground(branding);

  return (
    <div className={cn('relative min-h-screen text-foreground', !bgActive && 'bg-background', className)}>
      <header
        className={cn(
          'relative z-10 border-b border-border',
          bgActive ? 'bg-background/80 backdrop-blur-md' : 'bg-background/95',
        )}
      >
        <div
          className={cn(
            'mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-8',
            layoutHeaderClasses[layout],
          )}
        >
          <Link to="/discover" className="shrink-0">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt="Ngoma"
                style={{ width: branding.logoWidth }}
                className={cn('h-auto w-auto object-contain', layoutLogoMaxHeight[layout])}
              />
            ) : (
              <span className="text-lg font-bold text-foreground">Ngoma</span>
            )}
          </Link>
          <nav className={cn('flex flex-wrap items-center gap-2', layoutNavClasses[layout])}>
            <Link
              to="/discover"
              className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'normal-case' })}
            >
              Discover
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to="/playlists"
                  className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'normal-case' })}
                >
                  Playlists
                </Link>
                <Link
                  to="/dashboard"
                  className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'normal-case' })}
                >
                  Dashboard
                </Link>
              </>
            )}
            {!isLoggedIn && (
              <Link
                to="/auth"
                className={buttonVariants({ variant: 'default', size: 'sm', className: 'normal-case' })}
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main
        className={cn(
          'relative z-10 mx-auto w-full px-4 py-8 sm:px-8',
          maxWidthClasses[maxWidth],
          centered && 'flex min-h-[calc(100vh-4rem)] items-center justify-center',
        )}
      >
        {children}
      </main>
    </div>
  );
}
