import { useState, useEffect } from 'react';
import { listMyReservations, updateMatchResult, deleteMatchResult } from '../../api/reservations';
import './RegisterMatch.css';
import { toast } from 'react-toastify';

export default function RegisterMatch() {
  const [pasadas, setPasadas] = useState([]);

  useEffect(() => {
    listMyReservations().then(rs => {
      const now = Date.now();
      setPasadas(rs.filter(r => new Date(r.endTime) <= now));
    });
  }, []);

  const mark = async (id, result) => {
    try {
      await updateMatchResult(id, result);
      setPasadas(ps => ps.map(r => r.id === id ? { ...r, result } : r));
      toast.success(`Partida #${id} registrada como ${result === 'win' ? 'Victoria' : 'Derrota'}.`);
    } catch (e) {
      toast.error('Error: ' + (e.response?.data?.message || e.message));
    }
  };

  const deactivate = async id => {
    try {
      await deleteMatchResult(id);
      setPasadas(ps => ps.map(r => r.id === id ? { ...r, result: null } : r));
      toast.info(`Resultado desactivado para partida #${id}.`);
    } catch (e) {
      toast.error('Error: ' + (e.response?.data?.message || e.message));
    }
  };

  return (
    <div className="main-app register-match">
      <h2>Registrar Partidas Jugadas</h2>
      {pasadas.length === 0 ? (
        <p className="no-matches">No tienes partidas jugadas todavía.</p>
      ) : (
        pasadas.map(r => (
          <div key={r.id} className="match-item">
            <span className="match-info">Pista #{r.courtId} – {r.startTime.replace('T',' ')}</span>
            <div className="match-buttons">
              <button
                className={r.result === 'win' ? 'btn-result win' : 'btn-action'}
                onClick={() => mark(r.id, 'win')}
              >
                Victoria
              </button>
              <button
                className={r.result === 'loss' ? 'btn-result loss' : 'btn-action'}
                onClick={() => mark(r.id, 'loss')}
              >
                Derrota
              </button>
              {r.result && (
                <button className="btn-deactivate" onClick={() => deactivate(r.id)}>
                  Desactivar
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
