// src/components/ReservationCard/ReservationCard.jsx
import React from 'react';
import './ReservationCard.css';

export default function ReservationCard({
  reservation,
  onEdit,
  onDelete,
  readOnly,
  registered = false
}) {
  return (
    <div className={
      `reservation-card${registered ? ' reservation-card--registered' : ''}`
    }>
      <p><strong>Pista #{reservation.courtId}</strong></p>
      <p>Desde: {reservation.startTime.replace('T', ' ')}</p>
      <p>Hasta: {reservation.endTime.replace('T', ' ')}</p>

      {!readOnly && (
        <div className="reservation-actions">
          <button className="btn-edit" onClick={onEdit}>Editar</button>
          <button className="btn-delete" onClick={onDelete}>Eliminar</button>
        </div>
      )}
    </div>
  );
}
