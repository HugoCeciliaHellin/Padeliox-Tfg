// src/Pages/EditReservation/EditReservation.jsx
import { useState, useEffect } from 'react';
import SlotGrid from '../../components/SlotGrid/SlotGrid';
import { generateSlots } from '../../utils/slots';
import { toLocalISO } from '../../utils/date';
import { getCourtAvailability } from '../../api/courts';
import { updateReservation } from '../../api/reservations';
import './EditReservation.css';

const ONE_HOUR = 60 * 60 * 1000;

export default function EditReservation({ reservation, onDone, onCancel }) {
  const [occupied, setOccupied] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const date = reservation.startTime.slice(0, 10);

  // ① Carga ocupadas y precalcula tus propios slots
  useEffect(() => {
    getCourtAvailability(reservation.courtId, date)
      .then(all => {
        // Filtra las franjas que no sean tu propia reserva
        const blocked = all.filter(o =>
          !(o.end <= reservation.startTime || o.start >= reservation.endTime)
        );
        setOccupied(blocked);

        // Preselecciona tus slots actuales
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

  // ② Genera grid de slots
  const slots = generateSlots({
    date,
    openTime: '08:00',
    closeTime: '22:00',
    intervalMs: ONE_HOUR
  });

  // ③ Toggle: solo 1 slot permitido
  const toggle = slot => {
    if (selected.has(slot)) {
      setSelected(new Set());
    } else {
      setSelected(new Set([slot]));
    }
  };

  // ④ Guardar cambios
  const handleSave = async () => {
    if (selected.size !== 1) {
      return alert('Selecciona UNA franja de 1 hora');
    }

    const arr = Array.from(selected).sort();
    const start = arr[0];
    const last = arr[arr.length - 1];
    const end = toLocalISO(new Date(new Date(last).getTime() + ONE_HOUR));

    try {
      const updated = await updateReservation(reservation.id, start, end);
      onDone(updated);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert('Error: ' + msg);
    }
  };

  return (
    <div className="main-app">
      <h2>Editar Reserva #{reservation.id}</h2>
      <SlotGrid
        slots={slots}
        occupiedSlots={occupied}
        selectedSlots={selected}
        onToggle={toggle}
      />
      <div className="edit-actions">
        <button onClick={handleSave} className="btn-save" disabled={selected.size !== 1}> Guardar</button>
        <button onClick={onCancel} className="btn-cancel">Cancelar</button>
      </div>
    </div>
  );
}
