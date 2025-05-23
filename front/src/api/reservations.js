// src/api/reservations.js
import { apiClient } from './client';
import { toLocalISO } from '../utils/date';

export function listMyReservations() {
  return apiClient.get('/reservations');
}

export function createReservation(courtId, startTime, endTime) {
  return apiClient
    .post('/reservations', { courtId, startTime, endTime })
    .then(data => ({
      ...data,
      startTime: toLocalISO(new Date(data.startTime)),
      endTime:   toLocalISO(new Date(data.endTime)),
    }));
}

export function updateReservation(id, start, end) {
  return apiClient
    .put(`/reservations/${id}`, { startTime: start, endTime: end })
    .then(data => ({
      ...data,
      startTime: toLocalISO(new Date(data.startTime)),
      endTime:   toLocalISO(new Date(data.endTime)),
    }));
}

export function deleteReservation(id) {
  return apiClient.delete(`/reservations/${id}`);
}

export function deletePastReservations() {
  return apiClient.delete('/reservations/past');
}

export function updateMatchResult(id, result) {
  return apiClient.put(`/reservations/${id}/result`, { result });
}

export function deleteMatchResult(id) {
  return apiClient.delete(`/reservations/${id}/result`);
}
