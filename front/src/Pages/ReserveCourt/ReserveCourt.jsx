import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ReserveCourt.css';
function ReserveCourt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    async function loadCourt() {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/courts/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        setErr('No se encontró la pista o no tienes permiso.');
        return;
      }
      setCourt(await res.json());
    }
    loadCourt();
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ courtId: id, startTime, endTime })
    });
    if (res.ok) {
      alert('✅ Reserva confirmada');
      navigate('/app/reservas');
    } else {
      const body = await res.json();
      alert('❌ Error: ' + (body.message || JSON.stringify(body)));
    }
  };

  if (err) return <p style={{ color: 'red', textAlign:'center' }}>{err}</p>;
  if (!court) return <p style={{ textAlign:'center' }}>Cargando pista…</p>;

  return (
    <div className='main-app'>
    <div className="reserve-court-container">
      <h2>Reservar: {court.clubName} – {court.city}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Inicio:</label><br/>
          <input
            type="datetime-local"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Fin:</label><br/>
          <input
            type="datetime-local"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '1.5rem' }}>
          Confirmar reserva
        </button>
      </form>
    </div>
    </div>
  );
}

export default ReserveCourt;
