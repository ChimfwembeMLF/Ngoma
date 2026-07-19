import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminUsers, useDeactivateUser } from '../hooks/useAdmin';
import { UserTable } from '../components/admin/UserTable';
import { DesignSystemLayout } from '../components/layout/DesignSystemLayout';
import { Card } from '../components/ui/Card';
import { Button, buttonVariants } from '../components/ui/Button';
import { cn } from '../lib/utils';

const PAGE_SIZE = 20;

const selectClassName = cn(
  'min-h-[44px] rounded-sm border border-hairline bg-canvas px-3 py-2 text-base text-ink',
  'focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-primary/20',
);

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
    <DesignSystemLayout maxWidth="6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[22px] font-medium text-ink">Admin — Users</h1>
        <Link to="/dashboard" className={buttonVariants('outline')}>
          Back to dashboard
        </Link>
      </div>

      <div className="mb-6">
        <label htmlFor="role-filter" className="mb-1 block text-sm font-medium text-ink">
          Filter by role
        </label>
        <select
          id="role-filter"
          className={selectClassName}
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

      {isLoading && <p className="text-sm text-muted">Loading users…</p>}

      {error && (
        <Card className="border-error/30 bg-surface-soft">
          <p className="text-sm text-error">Failed to load users</p>
        </Card>
      )}

      {!isLoading && !error && (
        <>
          <UserTable
            users={users}
            onDeactivate={(id) => deactivate.mutate(id)}
            deactivatingId={deactivate.isPending ? deactivate.variables : undefined}
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-muted">
              Showing {total === 0 ? 0 : offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={offset + PAGE_SIZE >= total}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </DesignSystemLayout>
  );
}
