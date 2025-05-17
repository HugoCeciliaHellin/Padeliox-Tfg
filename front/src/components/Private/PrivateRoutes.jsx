// src/components/Private/PrivateRoutes.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute() {
  const { user } = useAuth();

  // Si no hay user logueado, redirige directamente a "/"
  if (!user) return <Navigate to="/" replace />;

  // Si hay user, permite el acceso
  return <Outlet />;
}
