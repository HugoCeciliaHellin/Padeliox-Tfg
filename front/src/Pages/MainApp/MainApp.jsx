import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './MainApp.css';

const MainApp = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  return (
    <section className="main-app">
      <div className="welcome-box">
        <h1>Bienvenido, {user.username}</h1>
        <p>Accede al menú superior para gestionar tus reservas de forma rápida y sencilla.</p>
      </div>

      <div className="info-cards">
        <div className="info-card">
          <h3>Reservar pista</h3>
          <p>Elige la pista perfecta para ti según superficie, ciudad y precio.</p>
        </div>

        <div className="info-card">
          <h3>Mis reservas</h3>
          <p>Consulta y edita tus reservas activas. Elimina o modifica según necesites.</p>
        </div>

        <div className="info-card">
          <h3>Historial</h3>
          <p>Revisa tus reservas pasadas y registra el resultado si lo deseas.</p>
        </div>
      </div>

      <Outlet />
    </section>
  );
};

export default MainApp;
