import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';

export function DashboardPage() {
  const { meQuery, logout } = useAuth();
  const user = meQuery.data?.data;

  return (
    <AppShell maxWidth="3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[22px] font-medium text-foreground">Dashboard</h1>
        <Button variant="ghost" onClick={logout} className="min-h-0 px-2 py-1 text-sm underline">
          Sign out
        </Button>
      </div>

      {user && (
        <Card className="mb-6 space-y-2 p-6">
          <p className="text-foreground">
            <span className="font-medium text-muted-foreground">Name:</span> {user.fullName}
          </p>
          <p className="text-foreground">
            <span className="font-medium text-muted-foreground">Email:</span> {user.email}
          </p>
          <p className="text-foreground">
            <span className="font-medium text-muted-foreground">Role:</span> {user.role}
          </p>
          {user.artistName && (
            <p className="text-foreground">
              <span className="font-medium text-muted-foreground">Artist:</span> {user.artistName}
            </p>
          )}
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <Link to="/discover" className={buttonVariants({ variant: 'outline' })}>
          Discover music
        </Link>
        <Link to="/purchases" className={buttonVariants({ variant: 'outline' })}>
          Purchase history
        </Link>
        {user?.role === 'ADMIN' && (
          <Link to="/admin/users" className={buttonVariants({ variant: 'default' })}>
            Admin users
          </Link>
        )}
        {user?.role === 'ARTIST' && (
          <>
            <Link to="/artist/dashboard" className={buttonVariants({ variant: 'default' })}>
              Artist dashboard
            </Link>
            <Link to="/artist/profile" className={buttonVariants({ variant: 'outline' })}>
              Edit profile
            </Link>
          </>
        )}
      </div>
    </AppShell>
  );
}
