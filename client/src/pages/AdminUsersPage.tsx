import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminUsers, useDeactivateUser } from '../hooks/useAdmin';
import { UserTable } from '../components/admin/UserTable';

const PAGE_SIZE = 20;

export function AdminUsersPage() {
  const [offset, setOffset] = useState(0);
  const [role, setRole] = useState('');
  const { data, isLoading, error } = useAdminUsers({
    limit: PAGE_SIZE,
    offset,
    role: role || undefined,
  });
  const deactivate = useDeactivateUser();

  const users = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cream">Admin — Users</h1>
        <Link to="/dashboard" className="text-terracotta text-sm hover:underline">
          ← Dashboard
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <select
          className="rounded-lg bg-indigo-950 border border-indigo-700 px-3 py-2 text-cream"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setOffset(0);
          }}
        >
          <option value="">All roles</option>
          <option value="LISTENER">Listener</option>
          <option value="ARTIST">Artist</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {isLoading && <p className="text-cream/70">Loading users...</p>}
      {error && <p className="text-red-400">Failed to load users</p>}

      {!isLoading && !error && (
        <>
          <UserTable
            users={users}
            onDeactivate={(id) => deactivate.mutate(id)}
            deactivatingId={deactivate.isPending ? deactivate.variables : undefined}
          />
          <div className="flex items-center justify-between mt-4 text-cream/70 text-sm">
            <span>
              Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                className="px-3 py-1 rounded border border-indigo-600 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={offset + PAGE_SIZE >= total}
                onClick={() => setOffset(offset + PAGE_SIZE)}
                className="px-3 py-1 rounded border border-indigo-600 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
