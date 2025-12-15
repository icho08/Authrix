import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export function SiteHeader() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="border-b bg-white" style={{ borderColor: 'rgb(var(--border))' }}>
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">A</span>
          <span>Authrix</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm ${isActive ? 'text-slate-900' : 'text-slate-600'} hover:text-slate-900`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-sm ${isActive ? 'text-slate-900' : 'text-slate-600'} hover:text-slate-900`
            }
          >
            Dashboard
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-slate-600 md:inline">{user.email}</span>
              <button className="btn btn-secondary" onClick={logout} disabled={loading}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-secondary" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/register">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
