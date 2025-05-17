// src/components/ReservationCard/ReservationCard.jsx
import React from 'react';
import './ReservationCard.css';
import { toLocalISO } from '../../utils/date';

export default function ReservationCard({ reservation, onEdit, onDelete, readOnly }) {
  // convierte "2025-05-14T21:00" → "2025-05-14 21:00"
  const fmt = iso => toLocalISO(iso).replace('T', ' ');

  return (
    <div className="reservation-card">
      <p><strong>Pista #{reservation.courtId}</strong></p>
      <p>Desde: {reservation.startTime}</p>
      <p>Hasta: {reservation.endTime}</p>


      {!readOnly && (
        <div className="reservation-actions">
          <button className="btn-edit"   onClick={onEdit}>Editar</button>
          <button className="btn-delete" onClick={onDelete}>Eliminar</button>
        </div>
      )}
    </div>
  );
}
