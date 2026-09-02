import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function PublicOnly() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/notes" replace /> : <Outlet />;
}
