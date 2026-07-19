import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function DashboardPage() {
  const { meQuery, logout } = useAuth();
  const user = meQuery.data?.data;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-terracotta">Dashboard</h1>
        <button onClick={logout} className="text-sm underline text-cream">
          Sign out
        </button>
      </div>
      {user && (
        <div className="rounded-lg border border-indigo-800/40 bg-indigo-950/20 p-4 space-y-2 text-cream">
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.artistName && <p><strong>Artist:</strong> {user.artistName}</p>}
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/discover" className="px-4 py-2 rounded-lg border border-indigo-600 text-cream">
          Discover music
        </Link>
        <Link to="/purchases" className="px-4 py-2 rounded-lg border border-indigo-600 text-cream">
          Purchase history
        </Link>
        {user?.role === 'ARTIST' && (
          <>
            <Link to="/artist/dashboard" className="px-4 py-2 rounded-lg bg-terracotta text-white">
              Artist dashboard
            </Link>
            <Link to="/artist/profile" className="px-4 py-2 rounded-lg border border-indigo-600 text-cream">
              Edit profile
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
