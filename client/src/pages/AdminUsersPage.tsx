import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminUsers, useDeactivateUser } from '@/hooks/useAdmin';
import { UserTable } from '@/components/admin/UserTable';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <AppShell maxWidth="6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[22px] font-medium text-foreground">Admin — Users</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin" className={buttonVariants({ variant: 'outline' })}>
            Overview
          </Link>
          <Link to="/admin/theme" className={buttonVariants({ variant: 'outline' })}>
            Theme
          </Link>
          <Link to="/admin/branding" className={buttonVariants({ variant: 'outline' })}>
            Branding
          </Link>
          <Link to="/dashboard" className={buttonVariants({ variant: 'outline' })}>
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <Label htmlFor="role-filter">Filter by role</Label>
        <Select
          value={role || 'ALL'}
          onValueChange={(value) => {
            setRole(value === 'ALL' ? '' : value);
            setOffset(0);
          }}
        >
          <SelectTrigger id="role-filter" className="w-full sm:w-48">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            <SelectItem value="LISTENER">Listener</SelectItem>
            <SelectItem value="ARTIST">Artist</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading users…</p>}

      {error && (
        <Card className="border-destructive/30 bg-muted p-6">
          <p className="text-sm text-destructive">Failed to load users</p>
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
            <span className="text-sm text-muted-foreground">
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
    </AppShell>
  );
}
