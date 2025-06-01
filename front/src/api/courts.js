import { apiClient } from './client';

export function getCourts(filters) {
  return apiClient.get('/courts', { params: filters });
}

export function getCourtAvailability(courtId, date) {
  return apiClient.get(`/courts/${courtId}/availability`, {
    params: { date }
  });
}

export function getCourtById(id) {
  return apiClient.get(`/courts/${id}`);
}
