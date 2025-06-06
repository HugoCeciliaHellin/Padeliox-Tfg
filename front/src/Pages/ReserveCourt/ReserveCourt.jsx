import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SlotGrid from '../../components/SlotGrid/SlotGrid';
import { generateSlots } from '../../utils/slots';
import { toLocalISO } from '../../utils/date';
import { getCourtAvailability, getCourtById } from '../../api/courts';
import { createCheckoutSession } from '../../api/payments';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import './ReserveCourt.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
const ONE_HOUR = 60 * 60 * 1000;

export default function ReserveCourt() {
  const { id } = useParams();
  const [court, setCourt] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [occupied, setOccupied] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const today = date;

  useEffect(() => {
    getCourtById(id).then(setCourt).catch(console.error);
  }, [id]);

  useEffect(() => {
    getCourtAvailability(id, date)
      .then(slots => setOccupied(
        slots.map(o => ({
          start: toLocalISO(new Date(o.start)),
          end: toLocalISO(new Date(o.end))
        }))
      ))
      .catch(console.error);
    setSelected(new Set());
  }, [id, date]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (selected.size !== 1) return toast.error('Selecciona 1 hora');

    const slot = Array.from(selected)[0];
    const start = slot;
    const end = toLocalISO(new Date(new Date(slot).getTime() + ONE_HOUR));

    setLoading(true);

    try {
      const sessionId = await createCheckoutSession(id, start, end);
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      toast.error('Error al iniciar el pago: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const slots = generateSlots({
    date, openTime: '08:00', closeTime: '22:00', intervalMs: ONE_HOUR
  });

  return (
    <div className="main-app reserve-court">
  <h2>Reservar pista #{id}</h2>
  {court && <p className="court-name">Club: <strong>{court.clubName}</strong></p>}

  <div className="date-selector">
    <label htmlFor="date">Fecha:</label>
    <input
      type="date"
      id="date"
      value={date}
      onChange={e => setDate(e.target.value)}
      min={today}
    />
  </div>

  <SlotGrid
    slots={slots}
    occupiedSlots={occupied}
    selectedSlots={selected}
    onToggle={slot => {
      if (!occupied.some(o => slot >= o.start && slot < o.end)) {
        setSelected(new Set([slot]));
      }
    }}
  />

  <button onClick={handleSubmit} disabled={selected.size !== 1 || loading}>
    {loading ? 'Procesando...' : 'Confirmar 1 hora'}
  </button>
</div>

  );
}