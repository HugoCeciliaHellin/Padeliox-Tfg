// src/Pages/MainApp/MainApp.jsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './MainApp.css';

const MainApp = () => {
  const { user } = useAuth();

  // Si no hay user, redirigimos al login (o a /)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="main-app">
      <h1>👋 ¡Hola {user.username}!</h1>
      <p>Tu rol es <strong>{user.role}</strong></p>
      <Outlet />
    </div>
  );
};

export default MainApp;
