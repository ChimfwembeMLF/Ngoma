import { getProxiedImageUrl } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { getAccessToken } from '@/lib/auth-storage';
import { hasActiveBackground } from '@/lib/branding-defaults';
import { cn } from '@/lib/utils';
import { useBranding } from '@/providers/BrandingProvider';
import { buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { AudioPlayer } from '@/components/player/AudioPlayer';
import { usePlayer } from '@/providers/PlayerProvider';
import { useAuth } from '@/hooks/useAuth';
import { ReloadPrompt } from '@/components/pwa/ReloadPrompt';

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
  const { meQuery, logout } = useAuth();
  const user = meQuery.data?.data;
  const isLoggedIn = !!user;
  const isArtist = user?.role === 'ARTIST';
  
  const { branding } = useBranding();
  const layout = branding.layoutTemplateId;
  const bgActive = hasActiveBackground(branding);
  const { currentTrack } = usePlayer();

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
                src={getProxiedImageUrl(branding.logoUrl)}
                alt="Ngoma"
                style={{ width: branding.logoWidth }}
                className={cn('h-auto w-auto object-contain', layoutLogoMaxHeight[layout])}
              />
            ) : (
              <span className="text-lg font-bold text-foreground">Ngoma</span>
            )}
          </Link>
          <nav className={cn('hidden sm:flex flex-wrap items-center gap-2', layoutNavClasses[layout])}>
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
                  to={isArtist ? "/artist/dashboard" : "/dashboard"}
                  className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'normal-case' })}
                >
                  Dashboard
                </Link>
                {isArtist && (
                  <Link
                    to="/artist/settings"
                    className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'normal-case' })}
                  >
                    Settings
                  </Link>
                )}
                <button
                  onClick={logout}
                  className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'normal-case text-muted-foreground hover:text-destructive' })}
                >
                  Sign out
                </button>
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
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main
        className={cn(
          'relative z-10 mx-auto w-full px-4 pt-8 sm:px-8',
          maxWidthClasses[maxWidth],
          centered && 'flex min-h-[calc(100vh-4rem)] items-center justify-center',
          currentTrack ? 'pb-32 sm:pb-24' : 'pb-20 sm:pb-8'
        )}
      >
        {children}
      </main>
      <Footer />
      <AudioPlayer />
      <BottomNav />
      <ReloadPrompt />
    </div>
  );
}
