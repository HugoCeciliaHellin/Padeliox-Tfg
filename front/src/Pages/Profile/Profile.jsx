import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { listMyReservations } from '../../api/reservations';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    played: 0,
    wins: 0,
    losses: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const rs = await listMyReservations();
        const now = Date.now();
        const past = rs.filter(r => new Date(r.endTime) <= now);
        const wins = past.filter(r => r.result === 'win').length;
        const losses = past.filter(r => r.result === 'loss').length;
        const played = wins + losses;
        setSummary({ played, wins, losses });
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="main-app">
      <div className="profile-page">
        <div className="profile-header">
          <h1>Mi Perfil</h1>
          <p><strong>{user.username}</strong></p>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">Rol:</span> {user.role}
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span> {user.email}
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-action" onClick={() => navigate('/app/registro')}>
            Registrar Partida
          </button>
          <button className="btn-action" onClick={() => navigate('/app/estadisticas')}>
            Estadísticas
          </button>
        </div>

        <div className="profile-extra">
          <h2>Resumen</h2>
          <div className="summary-cards">
            <div className="card card--played">
              <h3>Jugadas</h3>
              <p>{summary.played}</p>
            </div>
            <div className="card card--win">
              <h3>Victorias</h3>
              <p>{summary.wins}</p>
            </div>
            <div className="card card--loss">
              <h3>Derrotas</h3>
              <p>{summary.losses}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
