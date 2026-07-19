import type { AdminUser } from '../../hooks/useAdmin';
import { Button } from '../ui/Button';

type Props = {
  users: AdminUser[];
  onDeactivate: (userId: string) => void;
  deactivatingId?: string;
};

export function UserTable({ users, onDeactivate, deactivatingId }: Props) {
  if (users.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted">No users found.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-hairline">
      <table className="w-full text-left text-sm text-ink">
        <thead className="bg-surface-soft text-xs uppercase text-muted">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3">{user.fullName}</td>
              <td className="px-4 py-3 text-muted">{user.email}</td>
              <td className="px-4 py-3">{user.role}</td>
              <td className="px-4 py-3">
                {user.isActive ? (
                  <span className="text-ink">Active</span>
                ) : (
                  <span className="text-muted">Inactive</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                {user.isActive && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="min-h-0 px-2 py-1 text-error hover:bg-surface-soft"
                    onClick={() => onDeactivate(user.id)}
                    disabled={deactivatingId === user.id}
                  >
                    {deactivatingId === user.id ? 'Deactivating…' : 'Deactivate'}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
