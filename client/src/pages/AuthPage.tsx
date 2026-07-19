import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DesignSystemLayout } from '../components/layout/DesignSystemLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button, buttonVariants } from '../components/ui/Button';
import { cn } from '../lib/utils';

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

  const pending = loginMutation.isPending || registerMutation.isPending;

  return (
    <DesignSystemLayout maxWidth="md" centered>
      <Card className="w-full shadow-card">
        <h1 className="text-[22px] font-medium text-ink">Ngoma</h1>
        <p className="mb-6 mt-1 text-sm text-muted">The Heartbeat of African Music</p>

        <div className="mb-6 flex gap-2">
          <button
            type="button"
            className={cn(
              buttonVariants(mode === 'login' ? 'primary' : 'outline', 'flex-1'),
            )}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={cn(
              buttonVariants(mode === 'register' ? 'primary' : 'outline', 'flex-1'),
            )}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <Input name="fullName" label="Full name" placeholder="Full name" required />
              <Input name="phone" label="Phone" placeholder="+260971234567" required />
              <div className="space-y-1">
                <label htmlFor="role" className="block text-sm font-medium text-ink">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full min-h-[56px] rounded-sm border border-hairline bg-canvas px-3 py-2 text-base text-ink focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="LISTENER">Listener</option>
                  <option value="ARTIST">Artist</option>
                </select>
              </div>
              <Input name="artistName" label="Artist name" placeholder="Optional" />
              <Input name="country" label="Country" defaultValue="ZM" placeholder="ZM" />
            </>
          )}
          <Input name="email" type="email" label="Email" placeholder="you@example.com" required />
          <Input name="password" type="password" label="Password" placeholder="••••••••" required />
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={pending}>
            {pending ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </Card>
    </DesignSystemLayout>
  );
}
