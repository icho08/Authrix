import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { useAuth } from '../auth/AuthProvider';

export function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-app py-10 md:py-14">
        <AuthCard title="Create your account" subtitle="Start using Authrix for your application.">
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);

              if (password !== confirm) {
                setError('Passwords do not match');
                return;
              }

              try {
                await register({ email, password, username });
                navigate('/dashboard', { replace: true });
              } catch (err: any) {
                setError(err?.message ?? 'Registration failed');
              }
            }}
          >
            {error ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>
            ) : null}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
              <input className="input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

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
                minLength={8}
              />
              <div className="mt-1 text-xs text-slate-500">Use at least 8 characters.</div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Confirm password</label>
              <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>

            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? 'Creating…' : 'Create account'}
            </button>

            <div className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link className="link" to="/login">
                Sign in
              </Link>
            </div>
          </form>
        </AuthCard>
      </main>

      <SiteFooter />
    </div>
  );
}
