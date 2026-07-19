import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api-client';

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string | null;
};

type UsersResponse = {
  success: boolean;
  data: AdminUser[];
  pagination: { total: number; limit: number; offset: number };
};

export function useAdminUsers(params: { limit?: number; offset?: number; role?: string }) {
  const qs = new URLSearchParams();
  if (params.limit != null) qs.set('limit', String(params.limit));
  if (params.offset != null) qs.set('offset', String(params.offset));
  if (params.role) qs.set('role', params.role);
  const query = qs.toString();

  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => apiFetch<UsersResponse>(`/api/v1/admin/users${query ? `?${query}` : ''}`),
  });
}

export function useDeactivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      apiFetch(`/api/v1/admin/users/${userId}/deactivate`, { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}
