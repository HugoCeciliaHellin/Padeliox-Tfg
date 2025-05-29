// src/Pages/MyReservations/MyReservations.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReservationCard from '../../components/ReservationCard/ReservationCard';
import EditReservation from '../EditReservation/EditReservation';
import {
  listMyReservations,
  deleteReservation,
  deletePastReservations
} from '../../api/reservations';
import apiClient from '../../api/client';
import { toast } from 'react-toastify';

export default function MyReservations() {
  const [reservas, setReservas] = useState([]);
  const [mode, setMode] = useState(null);
const [, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

 useEffect(() => {
    const qs = Object.fromEntries(new URLSearchParams(location.search));
    if (qs.session_id) {
      setLoading(true);
      apiClient
  .post('/payments/complete', { sessionId: qs.session_id })
  .then(() => toast.success('¡Reserva guardada! ✅'))
  .catch(err => {
    const msg = err.response?.data?.message || err.message;
    toast.error(msg);
  })
        .finally(() => {
          setLoading(false);
          navigate('/app/reservas', { replace: true });
          listMyReservations().then(setReservas);
        });
    } else {
      listMyReservations().then(setReservas);
    }
  }, [location.search, navigate]);

  const now = Date.now();
  const próximas = reservas.filter(r => new Date(r.endTime).getTime() > now);
  const pasadas  = reservas.filter(r => new Date(r.endTime).getTime() <= now);

  const del = async id => {
  if (!window.confirm('¿Eliminar reserva?')) return;
  try {
    // Recoge la respuesta (puede ser undefined si no cambiaste el backend aún)
    const resp = await deleteReservation(id);
    setReservas(rs => rs.filter(r => r.id !== id));
    // Nuevo: cambia el mensaje según si hubo reembolso:
    if (resp?.refunded) {
      toast.success('Reserva eliminada y reembolso solicitado. 💸');
    } else {
      toast.success('Reserva eliminada correctamente.');
    }
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    toast.error('Error: ' + msg);
  }
};


  if (mode) {
    const reservation = reservas.find(r => r.id === mode.id);
    return (
      // Cuando cierras el modo edición tras guardar cambios
<EditReservation
  reservation={reservation}
  onDone={updated => {
    setReservas(rs => rs.map(r => r.id === updated.id ? updated : r));
    toast.success(`Tu próxima reserva ha sido editada con éxito.`);
    setMode(null);
  }}
  onCancel={() => setMode(null)}
/>

    );
  }

  const delAllPast = async () => {
    if (!window.confirm('¿Eliminar todas las reservas ya jugadas?')) return;
    try {
      const { deletedCount } = await deletePastReservations();
      toast.success(`Se han eliminado ${deletedCount} reservas pasadas.`);
      setReservas(rs => rs.filter(r => new Date(r.endTime).getTime() > Date.now()));
    } catch (err) {
      toast.error('Error al eliminar reservas pasadas: ' + (err.response?.data?.message || err.message));
    }
  };

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
        ? (
          <>
            <button className="btn-clear-all" onClick={delAllPast}>
              Eliminar todas
            </button>
            {pasadas.map(r => (
              <ReservationCard key={r.id} reservation={r} readOnly registered={!!r.result} />
            ))}
          </>
        )
        : <p>No tienes reservas pasadas.</p>
      }
    </div>
  );
}
