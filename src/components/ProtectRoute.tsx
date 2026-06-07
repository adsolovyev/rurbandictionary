import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { JSX } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div style={{ color: '#fff' }}>Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}