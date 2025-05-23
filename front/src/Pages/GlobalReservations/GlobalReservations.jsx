// src/Pages/GlobalReservations/GlobalReservations.jsx
// src/Pages/GlobalReservations/GlobalReservations.jsx
import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import './GlobalReservations.css';

export default function GlobalReservations() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    apiClient.get('/global-reservations')
      .then(setReservas)
      .catch(err => {
        alert("Error cargando reservas globales: " + (err.response?.data?.message || err.message));
      });
  }, []);

  return (
    <div className="main-app">
      <h2>Reservas próximas (todas las pistas, todos los usuarios)</h2>
      <div className="table-container">
        <table className="global-res-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Pista</th>
              <th>Usuario</th>
              <th>Inicio</th>
              <th>Fin</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-data">
                  No hay reservas próximas.
                </td>
              </tr>
            ) : reservas.map((r, idx) => (
              <tr key={r.id}>
                <td className="id-col">{idx + 1}</td>
                <td>
                  <div className="court-info">
                    <span className="court-name">{r.Court?.clubName}</span>
                    <span className="court-city muted">({r.Court?.city})</span>
                  </div>
                </td>
                <td>
                  <div className="user-info">
                    <span className="user-name">{r.User?.username}</span>
                    <span className="user-email muted">{r.User?.email}</span>
                  </div>
                </td>
                <td>{r.startTime.replace('T', ' ')}</td>
                <td>{r.endTime.replace('T', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
