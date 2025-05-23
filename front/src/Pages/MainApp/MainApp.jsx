// src/Pages/MainApp/MainApp.jsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './MainApp.css';

const MainApp = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  return (
    <section className="main-app">
      <div className="welcome-box">
        <h1>👋 Hola, {user.username}</h1>
        <p>Listo para disfrutar del pádel. ¡Buena suerte en tu próximo partido!</p>
      </div>

      <div className="info-cards">
        <div className="info-card">
          <div className="info-icon">🎾</div>
          <h3>Reserva tu pista favorita</h3>
          <p>Accede al menú superior para elegir día, hora y superficie.</p>
        </div>

        <div className="info-card">
          <div className="info-icon">📅</div>
          <h3>Organiza tu agenda</h3>
          <p>Consulta y administra todas tus reservas fácilmente.</p>
        </div>

        <div className="info-card">
          <div className="info-icon">🏆</div>
          <h3>Prepárate para competir</h3>
          <p>Explora próximos torneos y mejora tu clasificación.</p>
        </div>
      </div>

      <Outlet />
    </section>
  );
};

export default MainApp;
