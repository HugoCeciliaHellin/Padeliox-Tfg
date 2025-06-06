import { toLocalISO } from './date';

/**
 * @param {string} date      "YYYY-MM-DD"
 * @param {string} openTime  "HH:mm"
 * @param {string} closeTime "HH:mm"
 * @param {number} intervalMs  intervalo en milisegundos
 * @returns {string[]} lista de ISO-local "YYYY-MM-DDTHH:mm"
 */
export function generateSlots({ date, openTime, closeTime, intervalMs }) {
  const [oh, om] = openTime.split(':').map(Number);
  const [ch, cm] = closeTime.split(':').map(Number);

  const slots = [];
  let cur = new Date(`${date}T${String(oh).padStart(2,'0')}:${String(om).padStart(2,'0')}:00`).getTime();
  const end = new Date(`${date}T${String(ch).padStart(2,'0')}:${String(cm).padStart(2,'0')}:00`).getTime();

  while (cur < end) {
    const d = new Date(cur);
    slots.push(toLocalISO(d));
    cur += intervalMs;
  }

  return slots;
}
