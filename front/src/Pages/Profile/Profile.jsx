import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Ejemplo de datos de resumen; puedes sustituirlos por los tuyos
  const summary = {
    played: 24,
    wins: 15,
    losses: 9
  };

  return (
    <div className="main-app">
      <div className="profile-page">
        {/* Header */}
        <div className="profile-header">
          <h1>Mi Perfil</h1>
          <p>Hola <strong>{user.username}</strong>, bienvenido a tu zona personal.</p>
        </div>

        {/* Información básica */}
        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">Rol:</span> {user.role}
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span> {user.email}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="profile-actions">
          <button
            className="btn-action"
            onClick={() => navigate('/app/registro')}
          >
            Registrar Partida
          </button>
          <button
            className="btn-action"
            onClick={() => navigate('/app/estadisticas')}
          >
            Estadísticas
          </button>
          <button
            className="btn-action"
            onClick={() => navigate('/app/invitaciones')}
          >
            Invitaciones <span className="badge">3</span>
          </button>
        </div>

        {/* Resumen rápido */}
        <div className="profile-extra">
          <h2>Resumen rápido</h2>
          <div className="summary-cards">
            <div className="card">
              <h3>Partidas jugadas</h3>
              <p>{summary.played}</p>
            </div>
            <div className="card">
              <h3>Victorias</h3>
              <p>{summary.wins}</p>
            </div>
            <div className="card">
              <h3>Derrotas</h3>
              <p>{summary.losses}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
