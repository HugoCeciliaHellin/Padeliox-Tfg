// src/components/SlotGrid/SlotGrid.jsx
import React from 'react';
import './SlotGrid.css';

export default function SlotGrid({
  slots,
  occupiedSlots,
  selectedSlots,
  onToggle,
}) {
  const now = new Date();
  const isOccupied = slot =>
    occupiedSlots.some(o => slot >= o.start && slot < o.end);
  const isPast = slot => new Date(slot) < now;

  return (
    <div className="slot-grid">
      {slots.map(slot => {
        const occ = isOccupied(slot);
        const sel = selectedSlots.has(slot);
        const past = isPast(slot);
        const cls = occ
          ? 'occupied'
          : past
          ? 'past'
          : sel
          ? 'selected'
          : 'free';
        return (
          <div
            key={slot}
            className={`slot-cell ${cls}`}
            style={past ? { opacity: 0.5, pointerEvents: 'none', background: '#ccc' } : {}}
            onClick={() => !occ && !past && onToggle(slot)}
          >
            {slot.slice(11)}
          </div>
        );
      })}
    </div>
  );
}
