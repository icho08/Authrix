import { Link } from 'react-router-dom';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="container-app py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p
                className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-slate-600"
                style={{ borderColor: 'rgb(var(--border))' }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: 'rgb(var(--brand))' }} />
                Authentication-as-a-Service for SaaS
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                Secure, multi-tenant authentication — without the overhead.
              </h1>
              <p className="mt-4 max-w-prose text-base text-slate-600">
                Authrix provides registration, login, sessions, email verification, password reset, and per-application isolation.
                Self-host it, keep control of your data, ship faster.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link className="btn btn-primary" to="/register">
                  Create an account
                </Link>
                <Link className="btn btn-secondary" to="/login">
                  Sign in
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="rounded-2xl border bg-white p-4" style={{ borderColor: 'rgb(var(--border))' }}>
                  <div className="font-medium text-slate-900">Multi-tenant</div>
                  <div className="mt-1">Users are isolated per application API key.</div>
                </div>
                <div className="rounded-2xl border bg-white p-4" style={{ borderColor: 'rgb(var(--border))' }}>
                  <div className="font-medium text-slate-900">Session-aware</div>
                  <div className="mt-1">Device tracking and refresh token rotation.</div>
                </div>
              </div>
            </div>

            <div className="card p-6 md:p-8">
              <div className="text-sm text-slate-600">Preview</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">A clean authentication experience</div>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border bg-slate-50 p-4" style={{ borderColor: 'rgb(var(--border))' }}>
                  <div className="text-xs text-slate-500">JWT access + refresh</div>
                  <div className="mt-1 text-sm text-slate-700">Short-lived access tokens and secure refresh flow.</div>
                </div>
                <div className="rounded-xl border bg-slate-50 p-4" style={{ borderColor: 'rgb(var(--border))' }}>
                  <div className="text-xs text-slate-500">Email verification (optional)</div>
                  <div className="mt-1 text-sm text-slate-700">Per-app setting: require verification before login.</div>
                </div>
                <div className="rounded-xl border bg-slate-50 p-4" style={{ borderColor: 'rgb(var(--border))' }}>
                  <div className="text-xs text-slate-500">Session management</div>
                  <div className="mt-1 text-sm text-slate-700">View active sessions and revoke all devices.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border-t" style={{ borderColor: 'rgb(var(--border))' }}>
          <div className="container-app py-14">
            <h2 className="text-2xl font-semibold text-slate-900">Built for production</h2>
            <p className="mt-2 max-w-prose text-slate-600">
              A focused auth platform: strong defaults, predictable API, and multi-tenant separation.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { title: 'API-key isolation', desc: 'Every request is scoped to an application (tenant).' },
                { title: 'Rate limiting', desc: 'Harden endpoints against brute force and abuse.' },
                { title: 'Device sessions', desc: 'Refresh tokens stored per device with rotation.' }
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border p-5" style={{ borderColor: 'rgb(var(--border))' }}>
                  <div className="font-medium text-slate-900">{c.title}</div>
                  <div className="mt-1 text-sm text-slate-600">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
