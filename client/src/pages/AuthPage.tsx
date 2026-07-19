import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AuthPage() {
  const navigate = useNavigate();
  const { loginMutation, registerMutation } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    try {
      if (mode === 'login') {
        await loginMutation.mutateAsync({
          email: String(fd.get('email')),
          password: String(fd.get('password')),
        });
      } else {
        await registerMutation.mutateAsync({
          email: String(fd.get('email')),
          phone: String(fd.get('phone')),
          password: String(fd.get('password')),
          fullName: String(fd.get('fullName')),
          country: String(fd.get('country') || 'ZM'),
          role: String(fd.get('role') || 'LISTENER'),
          artistName: String(fd.get('artistName') || fd.get('fullName')),
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-terracotta mb-2">Ngoma</h1>
        <p className="text-sm text-indigo/70 mb-6">The Heartbeat of African Music</p>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            className={`flex-1 py-2 rounded ${mode === 'login' ? 'bg-terracotta text-white' : 'bg-cream'}`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded ${mode === 'register' ? 'bg-terracotta text-white' : 'bg-cream'}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <input name="fullName" placeholder="Full name" required className="w-full border rounded px-3 py-2" />
              <input name="phone" placeholder="+260971234567" required className="w-full border rounded px-3 py-2" />
              <select name="role" className="w-full border rounded px-3 py-2">
                <option value="LISTENER">Listener</option>
                <option value="ARTIST">Artist</option>
              </select>
              <input name="artistName" placeholder="Artist name (optional)" className="w-full border rounded px-3 py-2" />
              <input name="country" defaultValue="ZM" placeholder="Country" className="w-full border rounded px-3 py-2" />
            </>
          )}
          <input name="email" type="email" placeholder="Email" required className="w-full border rounded px-3 py-2" />
          <input name="password" type="password" placeholder="Password" required className="w-full border rounded px-3 py-2" />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-terracotta text-white py-2 rounded font-medium"
            disabled={loginMutation.isPending || registerMutation.isPending}
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
