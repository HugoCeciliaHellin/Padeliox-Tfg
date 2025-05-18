import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SlotGrid from '../../components/SlotGrid/SlotGrid';
import { generateSlots } from '../../utils/slots';
import { toLocalISO } from '../../utils/date';
import { getCourtAvailability, getCourtById } from '../../api/courts';
import './ReserveCourt.css';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_…');
const ONE_HOUR = 60 * 60 * 1000;

export default function ReserveCourt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [court, setCourt] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [occupied, setOccupied] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const today = new Date().toISOString().slice(0,10);

  useEffect(() => {
    getCourtById(id).then(setCourt);
  }, [id]);

  useEffect(() => {
    getCourtAvailability(id, date)
      .then(slots => {
        const normalized = slots.map(o => ({
          start: toLocalISO(new Date(o.start)),
          end:   toLocalISO(new Date(o.end))
        }));
        setOccupied(normalized);
        setSelected(new Set());
      })
      .catch(console.error);
  }, [id, date]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (selected.size !== 1) return alert('Selecciona 1 hora');
    const slot = Array.from(selected)[0];
    const start = slot;
    const end   = toLocalISO(new Date(new Date(slot).getTime()+ONE_HOUR));
    const amount = court.price; // importe en euros

    const res = await fetch('/api/payments/create-session', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ courtId: id, startTime: start, endTime: end, amount })
    });
    const { url } = await res.json();
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: url.split('session_id=')[1] });
  };

  const slots = generateSlots({
    date, openTime: '08:00', closeTime: '22:00', intervalMs: ONE_HOUR
  });

  return (
    <div className="main-app reserve-court">
      <h2>Reservar pista #{id} – {court?.clubName}</h2>
      <label>
        Fecha:
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} min={today}/>
      </label>
      <SlotGrid
        slots={slots}
        occupiedSlots={occupied}
        selectedSlots={selected}
        onToggle={s=>!occupied.some(o=>s>=o.start&&s<o.end)&&setSelected(new Set([s]))}
      />
      <button onClick={handleSubmit} disabled={selected.size!==1}>
        Confirmar 1 hora
      </button>
    </div>
  );
}
