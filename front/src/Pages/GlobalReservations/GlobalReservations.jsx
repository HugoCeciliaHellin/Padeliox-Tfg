import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import './GlobalReservations.css';
import axios from 'axios';

export default function GlobalReservations() {
  const [reservas, setReservas] = useState([]);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/global-reservations/export', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reservas_padelliox.csv';
      a.click();
    } catch (err) {
      console.error('❌ Error exportando CSV:', err);
      alert('No se pudo exportar el CSV. No hay reservas para exportar.');
    }
  };

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
      
      <div className="export-container">
        <button onClick={handleExport} className="btn-export">Exportar CSV</button>
      </div>

      <div className="table-container">
        <table className="global-res-table" aria-label="Tabla de reservas globales">
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
                <td colSpan={5} className="no-data">No hay reservas próximas.</td>
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
