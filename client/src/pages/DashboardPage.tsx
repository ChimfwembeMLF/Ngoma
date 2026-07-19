import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DesignSystemLayout } from '../components/layout/DesignSystemLayout';
import { Card } from '../components/ui/Card';
import { Button, buttonVariants } from '../components/ui/Button';

export function DashboardPage() {
  const { meQuery, logout } = useAuth();
  const user = meQuery.data?.data;

  return (
    <DesignSystemLayout maxWidth="3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[22px] font-medium text-ink">Dashboard</h1>
        <Button variant="ghost" onClick={logout} className="min-h-0 px-2 py-1 text-sm underline">
          Sign out
        </Button>
      </div>

      {user && (
        <Card className="mb-6 space-y-2">
          <p className="text-ink">
            <span className="font-medium text-muted">Name:</span> {user.fullName}
          </p>
          <p className="text-ink">
            <span className="font-medium text-muted">Email:</span> {user.email}
          </p>
          <p className="text-ink">
            <span className="font-medium text-muted">Role:</span> {user.role}
          </p>
          {user.artistName && (
            <p className="text-ink">
              <span className="font-medium text-muted">Artist:</span> {user.artistName}
            </p>
          )}
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <Link to="/discover" className={buttonVariants('outline')}>
          Discover music
        </Link>
        <Link to="/purchases" className={buttonVariants('outline')}>
          Purchase history
        </Link>
        {user?.role === 'ADMIN' && (
          <Link to="/admin/users" className={buttonVariants('primary')}>
            Admin users
          </Link>
        )}
        {user?.role === 'ARTIST' && (
          <>
            <Link to="/artist/dashboard" className={buttonVariants('primary')}>
              Artist dashboard
            </Link>
            <Link to="/artist/profile" className={buttonVariants('outline')}>
              Edit profile
            </Link>
          </>
        )}
      </div>
    </DesignSystemLayout>
  );
}
