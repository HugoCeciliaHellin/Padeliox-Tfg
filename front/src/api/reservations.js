// src/api/reservations.js
import client from './client';
export function listMyReservations() {
  return client.get('/reservations').then(r => r.data);
}
export function createReservation(courtId, start, end) {
  return client.post('/reservations', { courtId, startTime: start, endTime: end });
}
export function updateReservation(id, start, end) {
  return client.put(`/reservations/${id}`, { startTime: start, endTime: end });
}
export function deleteReservation(id) {
  return client.delete(`/reservations/${id}`);
}
