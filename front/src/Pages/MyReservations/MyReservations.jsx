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

let inFlight = false; 
export default function MyReservations() {
  const [reservas, setReservas] = useState([]);
  const [mode, setMode] = useState(null);
  const [, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const qs = Object.fromEntries(new URLSearchParams(location.search));
    const sessionId = qs.session_id;
    const toastKey = `reservationToast-${sessionId}`;
    const handledKey = `reservationHandled-${sessionId}`;
    const alreadyHandled = sessionStorage.getItem(handledKey);

    if (!sessionId) {
      // 🚿 Limpieza de claves viejas
      Object.keys(sessionStorage).forEach(k => {
        if (k.startsWith('reservationHandled-') || k.startsWith('reservationToast-')) {
          sessionStorage.removeItem(k);
        }
      });
      listMyReservations().then(setReservas);
      return;
    }

    if (alreadyHandled || inFlight) return;

    inFlight = true;
    setLoading(true);

    apiClient
      .post('/payments/complete', { sessionId })
      .then(() => {
        if (!sessionStorage.getItem(toastKey)) {
          toast.success('¡Reserva guardada con éxito! ✅');
          sessionStorage.setItem(toastKey, 'true');
        }
        sessionStorage.setItem(handledKey, 'true');
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message;
        toast.error('Error al guardar la reserva: ' + msg);
      })
      .finally(() => {
        setLoading(false);
        navigate('/app/reservas', { replace: true });
        listMyReservations().then(setReservas);
      });
  }, [location.search, navigate]);

  const now = Date.now();
  const próximas = reservas.filter(r => new Date(r.endTime).getTime() > now);
  const pasadas = reservas.filter(r => new Date(r.endTime).getTime() <= now);

  const del = async id => {
    if (!window.confirm('¿Eliminar reserva?')) return;
    try {
      const resp = await deleteReservation(id);
      setReservas(rs => rs.filter(r => r.id !== id));
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

    if (deletedCount === 0) {
      toast.info('No había reservas pasadas sin registrar para eliminar.');
    } else {
      toast.success(`Se han eliminado ${deletedCount} reservas pasadas.`);
      setReservas(rs => rs.filter(r => new Date(r.endTime).getTime() > Date.now()));
    }

  } catch (err) {
    toast.error('Error al eliminar reservas pasadas: ' + (err.response?.data?.message || err.message));
  }
};


  return (
  <div className="main-app my-reservations">
    <h2>Próximas Reservas</h2>
    {próximas.length ? (
      próximas.map(r => (
        <ReservationCard
          key={r.id}
          reservation={r}
          onEdit={() => setMode({ id: r.id })}
          onDelete={() => del(r.id)}
        />
      ))
    ) : (
      <p className="no-reservations-msg">No tienes próximas reservas.</p>
    )}

    <h2>Reservas Jugadas</h2>
    {pasadas.length ? (
      <>
        <button className="btn-clear-all" onClick={delAllPast}>
          Eliminar todas
        </button>
        {pasadas.map(r => (
          <ReservationCard
            key={r.id}
            reservation={r}
            readOnly
            registered={!!r.result}
          />
        ))}
      </>
    ) : (
      <p className="no-reservations-msg">No tienes reservas pasadas.</p>
    )}
  </div>
);

}
