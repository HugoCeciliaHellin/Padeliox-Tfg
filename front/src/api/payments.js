// src/api/payments.js
import { apiClient } from './client';

// Crea sesión Stripe y devuelve el id
export function createCheckoutSession(courtId, startTime, endTime) {
  return apiClient
    .post('/payments/create-session', { courtId, startTime, endTime })
    .then(response => {
      if (!response?.id) throw new Error('No llegó el session.id desde el servidor');
      return response.id;
    });
}

