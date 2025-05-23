// src/Paes/RegisterMatch/RegisterMatch.jsx
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
      setPasadas(ps => ps.map(r => r.id===id?{...r, result}:r));
    } catch (e) {
      toast.error('Error: '+(e.response?.data?.message||e.message));
    }
  };
  
  const deactivate = async id => {
    try {
        await deleteMatchResult(id);
        setPasadas(ps => ps.map(r => r.id === id ? { ...r, result: null } : r));
    } catch (e) {
        toast.error('Error: ' + (e.response?.data?.message || e.message));
    }
};

  return (
    <div className="main-app register-match">
      <h2>Registrar Partidas</h2>
      {pasadas.map(r => (
        <div key={r.id} className="match-item">
          <span>Pista #{r.courtId} – {r.startTime.replace('T',' ')}</span>
          <button
            className={r.result==='win'?'win':'btn-action'}
            onClick={()=>mark(r.id,'win')}
          >Victoria</button>
          <button
            className={r.result==='loss'?'loss':'btn-action'}
            onClick={()=>mark(r.id,'loss')}
          >Derrota</button>
          {r.result && (
            <button
            className="btn-deactivate"
            onClick={() => deactivate(r.id)}
            >Desactivar</button>
            )}
        </div>
      ))}
    </div>
  );
}
