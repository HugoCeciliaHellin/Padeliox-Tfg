import { useState, useEffect } from 'react';
import SlotGrid from '../../components/SlotGrid/SlotGrid';
import { generateSlots } from '../../utils/slots';
import { toLocalISO } from '../../utils/date';
import { getCourtAvailability } from '../../api/courts';
import { updateReservation } from '../../api/reservations';
import './EditReservation.css';
import { toast } from 'react-toastify';

const ONE_HOUR = 60 * 60 * 1000;

export default function EditReservation({ reservation, onDone, onCancel }) {
  const [occupied, setOccupied] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const date = reservation.startTime.slice(0, 10);

  useEffect(() => {
    getCourtAvailability(reservation.courtId, date)
      .then(all => {
        const norm = all.map(o => ({
          start: toLocalISO(new Date(o.start)),
          end:   toLocalISO(new Date(o.end))
        }));
        const blocked = norm.filter(o =>
          !(o.start === reservation.startTime && o.end === reservation.endTime)
        );
        setOccupied(blocked);

        const own = [];
        let cur = new Date(reservation.startTime).getTime();
        const endMs = new Date(reservation.endTime).getTime();
        while (cur + ONE_HOUR <= endMs) {
          own.push(toLocalISO(new Date(cur)));
          cur += ONE_HOUR;
        }
        setSelected(new Set(own));
      })
      .catch(console.error);
  }, [reservation, date]);

  const slots = generateSlots({
    date,
    openTime: '08:00',
    closeTime: '22:00',
    intervalMs: ONE_HOUR
  });

  const isPastSlot = slot => new Date(slot) < new Date();

  const toggle = slot => {
    if (isPastSlot(slot)) return;
    setSelected(prev => new Set(prev.has(slot) ? [] : [slot]));
  };

  const handleSave = async () => {
    if (selected.size !== 1) {
      return toast.error('Selecciona UNA franja de 1 hora');
    }

    const [start] = Array.from(selected);
    const end = toLocalISO(new Date(new Date(start).getTime() + ONE_HOUR));

    try {
      const updated = await updateReservation(reservation.id, start, end);
      onDone(updated);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
    }
  };

  return (
    <div className="main-app edit-reservation">
      <h2>Editar Reserva #{reservation.id}</h2>
      <SlotGrid
        slots={slots}
        occupiedSlots={occupied}
        selectedSlots={selected}
        onToggle={toggle}
        isPastSlot={isPastSlot}
      />
      <div className="edit-actions">
        <button onClick={handleSave} className="btn-save" disabled={selected.size !== 1}>
          Guardar
        </button>
        <button onClick={onCancel} className="btn-cancel">
          Cancelar
        </button>
      </div>
    </div>
  );
}
