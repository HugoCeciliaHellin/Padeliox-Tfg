// src/api/courts.js
import client from './client';
export function getCourts(filters) {
  return client.get('/courts', { params: filters }).then(r => r.data);
}
export function getCourtAvailability(courtId, date) {
  return client
    .get(`/courts/${courtId}/availability`, { params: { date } })
    .then(r => r.data);
}

export function getCourtById(id) {
  return client.get(`/courts/${id}`).then(r => r.data);
}
