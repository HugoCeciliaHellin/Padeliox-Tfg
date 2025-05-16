// src/components/SlotGrid/SlotGrid.jsx
import React from 'react';
import './SlotGrid.css';

export default function SlotGrid({
  slots,
  occupiedSlots,     // [{ start, end }, …] en ISO-local sin Z
  selectedSlots,     // Set de ISO-local strings
  onToggle,          // fn(slot: ISO-local)
}) {
  // ② Comprueba ocupación comparando ISO-local con las props.{start,end}
  const isOccupied = slot =>
    occupiedSlots.some(o =>
      slot >= o.start && slot < o.end
    );

  return (
    <div className="slot-grid">
      {slots.map(slot => {
        const occ = isOccupied(slot);
        const sel = selectedSlots.has(slot);
        const cls = occ ? 'occupied' : sel ? 'selected' : 'free';
        return (
          <div
            key={slot}
            className={`slot-cell ${cls}`}
            onClick={() => !occ && onToggle(slot)}
          >
            {slot.slice(11)} {/* muestra "HH:mm" */}
          </div>
        );
      })}
    </div>
  );
}
