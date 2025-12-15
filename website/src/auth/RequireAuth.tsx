import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="container-app py-10 text-sm text-slate-600">Loading…</div>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
