// src/Pages/ReserveCourt/ReserveCourt.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SlotGrid from '../../components/SlotGrid/SlotGrid';
import { generateSlots } from '../../utils/slots';
import { toLocalISO } from '../../utils/date';
import { getCourtAvailability } from '../../api/courts';
import { createReservation } from '../../api/reservations';
import './ReserveCourt.css';

const ONE_HOUR = 60 * 60 * 1000;

export default function ReserveCourt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [occupied, setOccupied] = useState([]);              // [{start,end},…]
  const [selected, setSelected] = useState(new Set());       // Set<string> de ISO-local
  const today = new Date().toISOString().slice(0, 10);


    const fetchAvailability = () => {
    getCourtAvailability(id, date)
      .then(slots => {
        // convertir fechas con Z a ISO-local, para que cuadren con generateSlots()
        const normalized = slots.map(o => ({
          start: toLocalISO(new Date(o.start)),
          end:   toLocalISO(new Date(o.end))
        }));
        setOccupied(normalized);
        setSelected(new Set());
      })
      .catch(console.error);
  };

  // ① Cada vez que cambien pista o fecha
  useEffect(fetchAvailability, [id, date]);

  // ④ Al confirmar, recargar *antes* de navegar
  const handleSubmit = async e => {
    e.preventDefault();
    if (selected.size !== 1) {
      return alert('Selecciona exactamente una franja de 1 hora.');
    }
    const slot = Array.from(selected)[0];
    const start = slot;
    const end   = toLocalISO(new Date(new Date(slot).getTime() + ONE_HOUR));

    try {
      await createReservation(id, start, end);
      await fetchAvailability();      // recarga ocupadas al instante
      // opcional: mostrar toast “Reservado”
      navigate('/app/reservas');      // o, si prefieres quedarte en la misma página, comentar esta línea
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || err.message));
    }
  };
  
  // ② Genera todos los slots de 1h
  const slots = generateSlots({
    date,
    openTime: '08:00',
    closeTime: '22:00',
    intervalMs: ONE_HOUR
  });

  // ③ Toggle de selección
  const toggle = slot => {
    setSelected(s => {
      const next = new Set(s);
      if (next.has(slot)) next.delete(slot);
      else next.add(slot);
      return next;
    });
  };

  

  return (
    <div className="main-app reserve-court">
      <h2>Reservar pista #{id}</h2>
      <label>
        Fecha:
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          min={today}
        />
      </label>

      <SlotGrid
        slots={slots}
        occupiedSlots={occupied}
        selectedSlots={selected}
        onToggle={toggle}
      />

      <button 
        onClick={handleSubmit} 
        disabled={selected.size !== 1}
      >
        Confirmar 1 hora
      </button>
    </div>
  );
}
