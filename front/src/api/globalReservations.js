import { apiClient } from './client';

export function listAllReservations() {
  return apiClient.get('/global-reservations');
}
