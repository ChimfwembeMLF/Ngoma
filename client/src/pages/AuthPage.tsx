import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export function AuthPage() {
  const navigate = useNavigate();
  const { loginMutation, registerMutation } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState('LISTENER');
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
          role,
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
    <AppShell maxWidth="md" centered>
      <Card className="w-full p-6 shadow-lg shadow-black/30">
        <h1 className="text-[22px] font-medium text-foreground">Ngoma</h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">The Heartbeat of African Music</p>

        <div className="mb-6 flex gap-2">
          <button
            type="button"
            className={cn(
              buttonVariants({
                variant: mode === 'login' ? 'default' : 'outline',
                className: 'flex-1',
              }),
            )}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={cn(
              buttonVariants({
                variant: mode === 'register' ? 'default' : 'outline',
                className: 'flex-1',
              }),
            )}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" name="fullName" placeholder="Full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" placeholder="+260971234567" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LISTENER">Listener</SelectItem>
                    <SelectItem value="ARTIST">Artist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="artistName">Artist name</Label>
                <Input id="artistName" name="artistName" placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" defaultValue="ZM" placeholder="ZM" />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="default" className="w-full" disabled={pending}>
            {pending ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </Card>
    </AppShell>
  );
}
