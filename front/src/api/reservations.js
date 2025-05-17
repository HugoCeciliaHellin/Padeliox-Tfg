// src/api/reservations.js
import client from './client';
import { toLocalISO } from '../utils/date';
export function listMyReservations() {
  return client.get('/reservations').then(r => r.data);
}
export function createReservation(courtId, start, end) {
  return client
    .post('/reservations', { courtId, startTime: start, endTime: end })
    // devolver directamente el objeto ya convertido
    .then(r => {
      const data = r.data;
      return {
        ...data,
        startTime: toLocalISO(new Date(data.startTime)),
        endTime:   toLocalISO(new Date(data.endTime)),
      };
    });
}

export function updateReservation(id, start, end) {
  return client
    .put(`/reservations/${id}`, { startTime: start, endTime: end })
    .then(r => {
      const data = r.data;
      return {
        ...data,
        startTime: toLocalISO(new Date(data.startTime)),
        endTime:   toLocalISO(new Date(data.endTime)),
      };
    });
  }

export function deleteReservation(id) {
  return client.delete(`/reservations/${id}`);
}
