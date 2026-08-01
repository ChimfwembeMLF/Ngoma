import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePaymentOptions } from '@/hooks/usePayments';
import { initiateTekremLogin } from '@/lib/auth';
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
import { FormWizard } from '@/components/forms';
import { cn } from '@/lib/utils';

function formatRegisterPhone(dialCode: string, localPhone: string): string {
  const digits = localPhone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith(dialCode)) return `+${digits}`;
  if (digits.startsWith('0')) return `+${dialCode}${digits.slice(1)}`;
  return `+${dialCode}${digits}`;
}

export function AuthPage() {
  const navigate = useNavigate();
  const { loginMutation, registerMutation } = useAuth();
  const paymentOptions = usePaymentOptions();
  const countries = paymentOptions.data?.data.countries ?? [];
  const defaultCountryId = paymentOptions.data?.data.defaultCountryId ?? 'ZM';
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState('LISTENER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('ZM');
  const [artistName, setArtistName] = useState('');
  const [stepError, setStepError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultCountryId) {
      setCountry(defaultCountryId);
    }
  }, [defaultCountryId]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      const res = await loginMutation.mutateAsync({ email, password });
      if (res.data.user.role === 'ARTIST') {
        navigate('/artist/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  }

  async function handleRegisterComplete() {
    setStepError(null);
    setError(null);
    if (!fullName.trim() || !phone.trim()) {
      setStepError('Full name and phone are required');
      return;
    }
    const dialCode = selectedCountry?.dialCode ?? '260';
    const formattedPhone = formatRegisterPhone(dialCode, phone);
    if (!/^\+[1-9]\d{7,14}$/.test(formattedPhone)) {
      setStepError('Enter a valid phone number');
      return;
    }
    if (role === 'ARTIST' && !artistName.trim()) {
      setStepError('Artist name is required for artist accounts');
      return;
    }
    try {
      const res = await registerMutation.mutateAsync({
        email,
        phone: formattedPhone,
        password,
        fullName,
        country: country || 'ZM',
        role,
        artistName: artistName.trim() || fullName,
      });
      if (res.data.user.role === 'ARTIST') {
        navigate('/artist/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  }

  const pending = loginMutation.isPending || registerMutation.isPending;

  const selectedCountry =
    countries.find((c) => c.id === country) ??
    countries.find((c) => c.id === defaultCountryId) ??
    countries[0];

  const registerSteps = [
    {
      id: 'account',
      label: 'Account',
      validate: () => {
        if (!email.trim() || !password.trim()) {
          setStepError('Email and password are required');
          return false;
        }
        setStepError(null);
        return true;
      },
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={country}
              onValueChange={setCountry}
              disabled={paymentOptions.isLoading || countries.length === 0}
            >
              <SelectTrigger id="country" className="w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.flag} {c.name} · {c.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="flex gap-2">
              <span className="flex items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground">
                +{selectedCountry?.dialCode ?? '260'}
              </span>
              <Input
                id="phone"
                placeholder={selectedCountry?.phonePlaceholder ?? '971234567'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="flex-1"
              />
            </div>
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
          {role === 'ARTIST' && (
            <div className="space-y-2">
              <Label htmlFor="artistName">Artist name</Label>
              <Input
                id="artistName"
                placeholder="Stage name"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                required
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <AppShell maxWidth="md" centered>
      <Card className="w-full p-6 shadow-lg shadow-black/30">
        <h1 className="text-[22px] font-medium text-foreground">Ngoma</h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">The Heartbeat of African Music</p>

        <div className="mb-6 space-y-3">
          <button
            type="button"
            onClick={() => initiateTekremLogin('/artist/dashboard')}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-slate-100 shadow-md transition-all flex items-center justify-center space-x-3 border border-slate-700 hover:border-slate-600 cursor-pointer"
          >
            <span className="flex-shrink-0">
              <svg className="w-5 h-5 rounded-full shadow-sm" viewBox="0 0 226.56 226.56" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="tekremGrad" gradientUnits="userSpaceOnUse" x1="0.01" y1="113.28" x2="226.56" y2="113.28">
                    <stop offset="0" stopColor="#CA7486" />
                    <stop offset="1" stopColor="#515AA6" />
                  </linearGradient>
                </defs>
                <path fill="url(#tekremGrad)" d="M113.28 0c62.56,0 113.28,50.72 113.28,113.28 0,62.56 -50.72,113.28 -113.28,113.28 -62.56,0 -113.28,-50.72 -113.28,-113.28 0,-62.56 50.72,-113.28 113.28,-113.28z" />
                <path fill="#FEFEFE" d="M175.75 107.23l25.81 -37.47c-47.89,-1.15 -86.07,-10.67 -114.21,27.26 -3.01,4.06 -5.72,7.77 -8.11,11.18 -22.86,32.58 -17.69,38.64 12.25,78.14 3.78,-7.78 5.58,-23.94 9.27,-33.1 4.2,-10.43 8.39,-15.88 15.36,-24.78 17.04,-21.77 23.69,-21.23 59.62,-21.23z" />
                <path fill="#FEFEFE" d="M25.01 70.28c4.37,9.19 14.97,23.36 21.22,32.5 4.53,6.63 6.41,4.68 28.88,3.62 16.99,-30.57 36.43,-33.75 41.33,-36.62l-91.43 0.5z" />
              </svg>
            </span>
            <span className="tracking-wide font-extrabold">Continue with Tekrem ID</span>
          </button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border/60"></div>
            <span className="flex-shrink mx-3 text-[11px] text-muted-foreground uppercase tracking-wider font-bold">Or sign in with email</span>
            <div className="flex-grow border-t border-border/60"></div>
          </div>
        </div>

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

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="default" className="w-full" disabled={pending}>
              {pending ? 'Please wait…' : 'Sign In'}
            </Button>
          </form>
        ) : (
          <>
            {(stepError || error) && (
              <p className="mb-4 text-sm text-destructive">{stepError ?? error}</p>
            )}
            <FormWizard
              steps={registerSteps}
              onComplete={handleRegisterComplete}
              completeLabel="Create Account"
              isSubmitting={pending}
            />
          </>
        )}
      </Card>
    </AppShell>
  );
}
