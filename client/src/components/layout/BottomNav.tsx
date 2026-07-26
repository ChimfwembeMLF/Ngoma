import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Library, User } from 'lucide-react';
import { getAccessToken } from '@/lib/auth-storage';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function BottomNav() {
  const location = useLocation();
  const isLoggedIn = !!getAccessToken();
  const { meQuery } = useAuth();
  const user = meQuery?.data?.data;

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-background/95 pb-[max(0rem,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.05)] backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden">
      <Link
        to="/discover"
        className={cn(
          'flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground transition-colors',
          isActive('/discover') && 'text-primary'
        )}
      >
        <Compass className={cn("h-5 w-5", isActive('/discover') && 'fill-primary/20')} />
        <span className="text-[10px] font-medium">Discover</span>
      </Link>

      {isLoggedIn && (
        <Link
          to="/playlists"
          className={cn(
            'flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground transition-colors',
            isActive('/playlists') && 'text-primary'
          )}
        >
          <Library className={cn("h-5 w-5", isActive('/playlists') && 'fill-primary/20')} />
          <span className="text-[10px] font-medium">Playlists</span>
        </Link>
      )}

      {isLoggedIn && (
        <Link
          to={user?.role === 'ARTIST' ? '/artist/dashboard' : '/dashboard'}
          className={cn(
            'flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground transition-colors',
            (isActive('/dashboard') || isActive('/artist/dashboard')) && 'text-primary'
          )}
        >
          <User className={cn("h-5 w-5", (isActive('/dashboard') || isActive('/artist/dashboard')) && 'fill-primary/20')} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      )}

      {!isLoggedIn && (
        <Link
          to="/auth"
          className={cn(
            'flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground transition-colors',
            isActive('/auth') && 'text-primary'
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-medium">Sign in</span>
        </Link>
      )}
    </nav>
  );
}
