// src/Pages/MyReservations/MyReservations.jsx
import { useState, useEffect } from 'react';
import ReservationCard from '../../components/ReservationCard/ReservationCard';
import EditReservation from '../EditReservation/EditReservation';
import { listMyReservations, deleteReservation } from '../../api/reservations';
import './MyReservations.css';

export default function MyReservations() {
  const [reservas, setReservas] = useState([]);
  const [mode, setMode] = useState(null); // { id } o null

  useEffect(() => {
    listMyReservations().then(setReservas);
  }, []);

  const now = Date.now();
  const próximas = reservas.filter(r => new Date(r.endTime).getTime() > now);
  const pasadas  = reservas.filter(r => new Date(r.endTime).getTime() <= now);

  const del = async id => {
    if (!window.confirm('¿Eliminar reserva?')) return;
    try {
      await deleteReservation(id);
      setReservas(rs => rs.filter(r => r.id !== id));
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert('Error: ' + msg);
    }
  };

  if (mode) {
    const reservation = reservas.find(r => r.id === mode.id);
    return (
      <EditReservation
        reservation={reservation}
        onDone={updated => {
          setReservas(rs => rs.map(r => r.id === updated.id ? updated : r));
          setMode(null);
        }}
        onCancel={() => setMode(null)}
      />
    );
  }

  return (
    <div className="main-app">
      <h2>Próximas Reservas</h2>
      {próximas.length
        ? próximas.map(r => (
            <ReservationCard
              key={r.id}
              reservation={r}
              onEdit={() => setMode({ id: r.id })}
              onDelete={() => del(r.id)}
            />
          ))
        : <p>No tienes próximas reservas.</p>
      }

      <h2>Reservas Jugadas</h2>
      {pasadas.length
        ? pasadas.map(r => (
            <ReservationCard key={r.id} reservation={r} readOnly />
          ))
        : <p>No tienes reservas pasadas.</p>
      }
    </div>
  );
}
