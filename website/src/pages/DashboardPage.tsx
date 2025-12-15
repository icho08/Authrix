import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { useAuth } from '../auth/AuthProvider';
import { AuthrixClient } from '../lib/authrixClient';
import { getAccessToken } from '../lib/storage';
import type { Session } from '../lib/types';

const client = new AuthrixClient();

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function DashboardPage() {
  const { user, logoutAll, loading } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusLabel = useMemo(() => {
    if (!user) return 'Unknown';
    return user.isVerified ? 'Verified' : 'Unverified';
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSessionsLoading(true);
      setError(null);
      try {
        const access = getAccessToken();
        if (!access) return;
        const res = await client.getSessions(access);
        if (!cancelled) setSessions(res.sessions);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load sessions');
      } finally {
        if (!cancelled) setSessionsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-app py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">Account overview and active sessions.</p>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-secondary"
              onClick={async () => {
                await logoutAll();
                navigate('/login', { replace: true });
              }}
              disabled={loading}
            >
              Sign out everywhere
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <div className="text-xs text-slate-500">Status</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">{statusLabel}</div>
            {!user?.isVerified ? (
              <div className="mt-2 text-sm text-slate-600">
                Email verification is enabled for this application. Check your inbox for a verification link.
              </div>
            ) : null}
          </div>

          <div className="card p-5">
            <div className="text-xs text-slate-500">Email</div>
            <div className="mt-1 break-all text-sm font-medium text-slate-900">{user?.email ?? '-'}</div>
          </div>

          <div className="card p-5">
            <div className="text-xs text-slate-500">User ID</div>
            <div className="mt-1 break-all font-mono text-xs text-slate-700">{user?.id ?? '-'}</div>
          </div>
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Active sessions</h2>
            <button
              className="btn btn-secondary"
              onClick={async () => {
                setSessionsLoading(true);
                setError(null);
                try {
                  const access = getAccessToken();
                  if (!access) return;
                  const res = await client.getSessions(access);
                  setSessions(res.sessions);
                } catch (e: any) {
                  setError(e?.message ?? 'Failed to load sessions');
                } finally {
                  setSessionsLoading(false);
                }
              }}
              disabled={sessionsLoading}
            >
              {sessionsLoading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          ) : null}

          <div className="mt-4 card overflow-hidden">
            <div className="divide-y" style={{ borderColor: 'rgb(var(--border))' }}>
              {sessions.length === 0 ? (
                <div className="p-5 text-sm text-slate-600">
                  {sessionsLoading ? 'Loading sessions…' : 'No active sessions found.'}
                </div>
              ) : (
                sessions.map((s) => (
                  <div key={s.id} className="p-5">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="font-medium text-slate-900">{s.deviceName || 'Unknown device'}</div>
                        <div className="mt-1 text-sm text-slate-600">
                          {(s.browser || 'Browser')} · {(s.os || 'OS')} · {s.location || 'Unknown location'}
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          Last used: {formatDate(s.lastUsedAt)}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">IP: {s.ipAddress || '-'}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
