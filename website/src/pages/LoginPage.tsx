import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { useAuth } from '../auth/AuthProvider';

export function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from || '/dashboard';

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-app py-10 md:py-14">
        <AuthCard title="Sign in" subtitle="Access your Authrix dashboard.">
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              try {
                await login({ email, password });
                navigate(from, { replace: true });
              } catch (err: any) {
                setError(err?.message ?? 'Login failed');
              }
            }}
          >
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            ) : null}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="text-sm text-slate-600">
              Don’t have an account?{' '}
              <Link className="link" to="/register">
                Create one
              </Link>
            </div>
          </form>
        </AuthCard>
      </main>

      <SiteFooter />
    </div>
  );
}
