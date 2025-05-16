// services/reservationService.js
const { Reservation } = require('../models');
const { Op } = require('sequelize');

/**
 * Devuelve true si existe YA en BD una reserva
 * que solape *estrictamente* [newStart, newEnd),
 * permitiendo que terminen justo en newStart o empiecen en newEnd.
 */
async function hasOverlap(courtId, newStart, newEnd, excludeId = null) {
  const where = {
    courtId,
    // conflicto si EXISTING.start < newEnd  AND  EXISTING.end > newStart
    [Op.and]: [
      { startTime: { [Op.lt]: newEnd } },
      { endTime:   { [Op.gt]: newStart } },
    ]
  };
  if (excludeId) {
    where.id = { [Op.ne]: excludeId };
  }
  const conflict = await Reservation.findOne({ where });
  return !!conflict;
}

/**
 * Crea una nueva reserva tras comprobar solapamientos.
 * Lanza Error('La franja ya está ocupada') si no es posible.
 */
async function createReservation({ userId, courtId, startTime, endTime }) {
    // 0️⃣ rechazamos reservas en el pasado
  if (new Date(endTime) < new Date()) {
    const err = new Error('No puedes reservar en el pasado');
    err.status = 400;
    throw err;
  }

  // 1️⃣ comprobamos solapamientos
  if (await hasOverlap(courtId, startTime, endTime)) {
    throw new Error('La franja ya está ocupada');
  }

  // 2️⃣ si todo ok, creamos
  return Reservation.create({ userId, courtId, startTime, endTime });
}

/**
 * Devuelve todas las reservas de un usuario.
 */
async function listMyReservations(userId) {
  return Reservation.findAll({ where: { userId } });
}

/**
 * Actualiza una reserva concreta tras comprobar solapamientos.
 * Lanza Error('La franja solapa con otra reserva') si no es posible.
 */
async function updateReservation(id, userId, { startTime, endTime }) {
const r = await Reservation.findOne({ where: { id, userId } });
  if (!r) {
    const err = new Error('Reserva no encontrada');
    err.status = 404;
    throw err;
  }

  // 2️⃣ Determina los valores finales de start/end
  const newStart = startTime || r.startTime;
  const newEnd   = endTime   || r.endTime;

  // 3️⃣ Impide que el tramo actualizado quede completamente en el pasado
  if (new Date(newEnd) < new Date()) {
    const err = new Error('No puedes reservar en el pasado');
    err.status = 400;
    throw err;
  }

  // 4️⃣ Comprueba solapamientos, excluyendo esta misma reserva
  if (await hasOverlap(r.courtId, newStart, newEnd, id)) {
    throw new Error('La franja solapa con otra reserva');
  }

  // 5️⃣ Si todo OK, aplica la actualización
  await r.update({ startTime: newStart, endTime: newEnd });
  return r;
}

/**
 * Borra la reserva si existe y pertenece al usuario.
 */
async function deleteReservation(id, userId) {
  const r = await Reservation.findOne({ where: { id, userId } });
  if (!r) throw Object.assign(new Error('Reserva no encontrada'), { status: 404 });
  await r.destroy();
}

/**
 * Devuelve las franjas ocupadas de una pista en un día concreto.
 */
async function getAvailability(courtId, date) {
  const startOfDay = new Date(`${date}T00:00:00`);
  const endOfDay   = new Date(`${date}T23:59:59`);

  const ocupadas = await Reservation.findAll({
    where: {
      courtId,
      [Op.or]: [
        { startTime: { [Op.between]: [startOfDay, endOfDay] } },
        { endTime:   { [Op.between]: [startOfDay, endOfDay] } },
        {
          startTime: { [Op.lte]: startOfDay },
          endTime:   { [Op.gte]: endOfDay }
        }
      ]
    },
    attributes: ['startTime','endTime']
  });

  return ocupadas;
}

module.exports = {
  hasOverlap,
  createReservation,
  listMyReservations,
  updateReservation,
  deleteReservation,
  getAvailability
};
