import { useCallback } from 'react';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './auth-storage';

const TEKREM_AUTH_URL = import.meta.env.VITE_TEKREM_AUTH_URL || import.meta.env.VITE_TEKREM_OIDC_ISSUER || 'https://auth.tekreminnovations.com';
const TEKREM_CLIENT_ID = import.meta.env.VITE_TEKREM_CLIENT_ID || '182e05672cc44802a9e7f17c2ce46b58';
const TEKREM_REDIRECT_URI = import.meta.env.VITE_TEKREM_REDIRECT_URI || 'https://tekreminnovations.com/auth/tekrem/callback';

function generateCodeVerifier(length = 64): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = new Uint8Array(length);
  window.crypto.getRandomValues(values);
  return Array.from(values)
    .map((x) => possible[x % possible.length])
    .join('');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function initiateTekremLogin(returnPath: string = '/marketing/promotions') {
  const redirectUri = TEKREM_REDIRECT_URI;
  
  // PKCE (Proof Key for Code Exchange) requirements
  const codeVerifier = generateCodeVerifier();
  sessionStorage.setItem('pkce_code_verifier', codeVerifier);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: TEKREM_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'openid profile email offline_access',
    state: returnPath,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  window.location.href = `${TEKREM_AUTH_URL}/oauth/authorize?${params.toString()}`;
}

export function useAuthSession() {
  const isAuthenticated = !!getAccessToken();

  const logout = useCallback(() => {
    clearTokens();
    window.location.href = '/';
  }, []);

  const refreshSession = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';
      const res = await fetch(`${apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setTokens(json.data.accessToken, json.data.refreshToken);
          return true;
        }
      }
      clearTokens();
      return false;
    } catch {
      return false;
    }
  }, []);

  return { isAuthenticated, initiateTekremLogin, logout, refreshSession };
}
