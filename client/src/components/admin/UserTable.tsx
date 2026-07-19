import type { AdminUser } from '../../hooks/useAdmin';

type Props = {
  users: AdminUser[];
  onDeactivate: (userId: string) => void;
  deactivatingId?: string;
};

export function UserTable({ users, onDeactivate, deactivatingId }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-indigo-800/40">
      <table className="w-full text-sm text-left text-cream">
        <thead className="bg-indigo-950/50 text-cream/70 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-indigo-800/30">
              <td className="px-4 py-3">{user.fullName}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.role}</td>
              <td className="px-4 py-3">
                {user.isActive ? (
                  <span className="text-green-400">Active</span>
                ) : (
                  <span className="text-red-400">Inactive</span>
                )}
              </td>
              <td className="px-4 py-3">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                {user.isActive && (
                  <button
                    type="button"
                    onClick={() => onDeactivate(user.id)}
                    disabled={deactivatingId === user.id}
                    className="text-red-400 hover:underline disabled:opacity-50"
                  >
                    {deactivatingId === user.id ? 'Deactivating...' : 'Deactivate'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
