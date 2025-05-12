// src/components/Private/PrivateRoutes.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  // solo /app queda libre; el resto bajo /app/* sí exige user
  const alwaysPublic = ['/app'];

  if (!user && !alwaysPublic.includes(pathname)) {
    // si NO estamos logueados y no es la ruta pública /app
    return <Navigate to="/login" replace />;
  }

  // user válido o estamos en /app → renderiza el Outlet
  return <Outlet />;
}
