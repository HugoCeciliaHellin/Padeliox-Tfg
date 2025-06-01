import { apiClient } from './client';

export function createCheckoutSession(courtId, startTime, endTime) {
  return apiClient
    .post('/payments/create-session', { courtId, startTime, endTime })
    .then(response => {
      if (!response?.id) throw new Error('No llegó el session.id desde el servidor');
      return response.id;
    });
}

