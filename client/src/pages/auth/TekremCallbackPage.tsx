import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setTokens } from '../../lib/auth-storage';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

export const TekremCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code') || 'mock_auth_code_123';
    const state = searchParams.get('state') || '/marketing/promotions';

    async function exchangeCode() {
      try {
        const codeVerifier = sessionStorage.getItem('pkce_code_verifier') || undefined;
        const apiUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';
        const res = await fetch(`${apiUrl}/auth/tekrem/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            redirectUri: import.meta.env.VITE_TEKREM_REDIRECT_URI || 'https://ngoma.tekreminnovations.com/auth/tekrem/callback',
            codeVerifier,
          }),
        });

        if (!res.ok) {
          throw new Error('Authentication failed during token exchange');
        }

        const json = await res.json();
        if (json.success && json.data) {
          sessionStorage.removeItem('pkce_code_verifier');
          setTokens(json.data.accessToken, json.data.refreshToken);
          localStorage.setItem('user_mako_ws', json.data.user.makoWorkspaceId || '');
          navigate(state, { replace: true });
        } else {
          throw new Error(json.message || 'Invalid OIDC response');
        }
      } catch (err: any) {
        sessionStorage.removeItem('pkce_code_verifier');
        setError(err.message || 'Failed to complete Tekrem ID authentication');
      }
    }

    exchangeCode();
  }, [navigate, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold mb-2">Authenticating with Tekrem ID</h2>
        {error ? (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-500 text-red-300 rounded-xl flex items-center space-x-3 text-left text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-sm">Exchanging credentials and establishing single sign-on...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TekremCallbackPage;
