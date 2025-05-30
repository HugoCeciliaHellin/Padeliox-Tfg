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
    <div className={`reservation-card${registered ? ' reservation-card--registered' : ''}`}>
      <div className="reservation-info">
        <h3>Pista #{reservation.courtId}</h3>
        <p><strong>Desde:</strong> {reservation.startTime.replace('T', ' ')}</p>
        <p><strong>Hasta:</strong> {reservation.endTime.replace('T', ' ')}</p>
      </div>

      {!readOnly && (
        <div className="reservation-actions">
          <button className="btn-edit" onClick={onEdit}>Editar</button>
          <button className="btn-delete" onClick={onDelete}>Eliminar</button>
        </div>
      )}
    </div>
  );
}
