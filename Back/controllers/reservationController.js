// controllers/reservationController.js
const  Reservation  = require('../models/Reservation');

exports.createReservation = async (req, res) => {
  const { courtId, startTime, endTime } = req.body;
  const userId = req.user.userId;

  // Aquí podrías añadir comprobación de solapamientos…

  const r = await Reservation.create({ userId, courtId, startTime, endTime });
  res.status(201).json(r);
};

exports.listMyReservations = async (req, res) => {
  const userId = req.user.userId;
  const all = await Reservation.findAll({ where: { userId } });
  res.json(all);
};

exports.updateReservation = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const r = await Reservation.findOne({ where: { id, userId } });
  if (!r) return res.status(404).json({ message: 'Reserva no encontrada' });

  await r.update(req.body);
  res.json(r);
};

exports.deleteReservation = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const r = await Reservation.findOne({ where: { id, userId } });
  if (!r) return res.status(404).json({ message: 'Reserva no encontrada' });

  await r.destroy();
  res.status(204).send();
};
