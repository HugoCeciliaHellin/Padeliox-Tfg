
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
        const occupied = isOccupied(slot);
        const selected = selectedSlots.has(slot);
        const past = isPast(slot);
        const className = [
          'slot-cell',
          past ? 'past' : occupied ? 'occupied' : selected ? 'selected' : 'free'
        ].join(' ');

        return (
          <div
            key={slot}
            className={className}
            tabIndex={!past && !occupied ? 0 : -1}
            onClick={() => !past && !occupied && onToggle(slot)}
          >
            {slot.slice(11)}
          </div>
        );
      })}
    </div>
  );
}
