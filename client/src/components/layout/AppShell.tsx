import { Link } from 'react-router-dom';
import { getAccessToken } from '@/lib/auth-storage';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

type MaxWidth = '6xl' | '4xl' | '3xl' | '2xl' | 'md';

const maxWidthClasses: Record<MaxWidth, string> = {
  '6xl': 'max-w-6xl',
  '4xl': 'max-w-4xl',
  '3xl': 'max-w-3xl',
  '2xl': 'max-w-2xl',
  md: 'max-w-md',
};

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

  return (
    <div className={cn('min-h-screen bg-background text-foreground', className)}>
      <header className="border-b border-border bg-background/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Link to="/discover" className="text-lg font-bold text-foreground">
            Ngoma
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
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
          'mx-auto w-full px-4 py-8 sm:px-8',
          maxWidthClasses[maxWidth],
          centered && 'flex min-h-[calc(100vh-4rem)] items-center justify-center',
        )}
      >
        {children}
      </main>
    </div>
  );
}
