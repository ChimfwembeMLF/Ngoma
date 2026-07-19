import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api-client';
import { clearTokens, setTokens } from '../lib/auth-storage';

type AuthResponse = {
  success: boolean;
  data: {
    user: { id: string; email: string; fullName: string; role: string; artistId?: string };
    accessToken: string;
    refreshToken: string;
  };
};

type MeResponse = {
  success: boolean;
  data: {
    id: string;
    email: string;
    phone: string;
    fullName: string;
    role: string;
    country?: string;
    artistId?: string;
    artistName?: string;
  };
};

export function useAuth() {
  const qc = useQueryClient();

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiFetch<MeResponse>('/api/v1/auth/me'),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      apiFetch<AuthResponse>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: (res) => {
      setTokens(res.data.accessToken, res.data.refreshToken);
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch<AuthResponse>('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: (res) => {
      setTokens(res.data.accessToken, res.data.refreshToken);
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const logout = () => {
    clearTokens();
    qc.removeQueries({ queryKey: ['auth', 'me'] });
  };

  return { meQuery, loginMutation, registerMutation, logout };
}
