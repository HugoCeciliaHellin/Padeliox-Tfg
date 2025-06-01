const { Reservation } = require('../models');
const { Op } = require('sequelize');

async function isSlotTaken(courtId, newStart, newEnd, excludeId = null) {
  const where = {
    courtId,
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

async function createReservation({ userId, courtId, startTime, endTime, paymentIntentId }) {
  if (new Date(endTime) < new Date()) {
    const err = new Error('No puedes reservar en el pasado');
    err.status = 400;
    throw err;
  }
  if (await isSlotTaken(courtId, startTime, endTime)) {
    const err = new Error('La franja ya está ocupada');
    err.status = 409;
    throw err;
  }
  return Reservation.create({ userId, courtId, startTime, endTime, paymentIntentId });
}

async function listMyReservations(userId) {
  return Reservation.findAll({ where: { userId } });
}

async function updateReservation(id, userId, { startTime, endTime }) {
  const r = await Reservation.findOne({ where: { id, userId } });
  if (!r) {
    const err = new Error('Reserva no encontrada');
    err.status = 404;
    throw err;
  }

  const newStart = startTime || r.startTime;
  const newEnd   = endTime   || r.endTime;

  if (new Date(newEnd) < new Date()) {
    const err = new Error('No puedes reservar en el pasado');
    err.status = 400;
    throw err;
  }

  if (await isSlotTaken(r.courtId, newStart, newEnd, id)) {
    const err = new Error('La franja solapa con otra reserva');
    err.status = 409;
    throw err;
  }

  await r.update({ startTime: newStart, endTime: newEnd });
  return r;
}

async function deleteReservation(id, userId) {
  const r = await Reservation.findOne({ where: { id, userId } });
  if (!r) {
    const err = new Error('Reserva no encontrada');
    err.status = 404;
    throw err;
  }
  await r.destroy();
}

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
    attributes: ['startTime', 'endTime']
  });

  return ocupadas;
}

async function deletePastReservations(userId) {
  const now = new Date();
  const count = await Reservation.destroy({
    where: {
      userId,
      endTime: { [Op.lte]: now },
      result: null
    }
  });
  return count;
}

async function setMatchResult(id, userId, result) {
  const r = await Reservation.findOne({ where: { id, userId } });
  if (!r) {
    const err = new Error('Reserva no encontrada');
    err.status = 404;
    throw err;
  }
  await r.update({ result });
  return r;
}

async function getByIdAndUser(id, userId) {
  return Reservation.findOne({ where: { id, userId } });
}

async function findByUserCourtAndTime({ userId, courtId, startTime, endTime }) {
  return Reservation.findOne({
    where: { userId, courtId, startTime, endTime }
  });
}

module.exports = {
  isSlotTaken,
  createReservation,
  listMyReservations,
  updateReservation,
  deleteReservation,
  getAvailability,
  deletePastReservations,
  setMatchResult,
  findByUserCourtAndTime,
  getByIdAndUser
};
