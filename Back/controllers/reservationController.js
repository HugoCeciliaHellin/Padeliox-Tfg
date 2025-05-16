//controllers/reservationController.js
const reservationService = require('../services/reservationService');
const { toLocalISO }      = require('../utils/date');


exports.createReservation = async (req, res) => {
  try {
    const r = await reservationService.createReservation({
      userId: req.user.userId,
      courtId: req.body.courtId,
      startTime: req.body.startTime,
      endTime: req.body.endTime
    });
    res.status(201).json(r);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

exports.listMyReservations = async (req, res) => {
  const rows = await reservationService.listMyReservations(req.user.userId);
  res.json(rows.map(r => {
    const j = r.toJSON();
    return {
      ...j,
      startTime: toLocalISO(j.startTime),
      endTime:   toLocalISO(j.endTime)
    };
  }));
}
exports.updateReservation = async (req, res) => {
  try {
    const updated = await reservationService.updateReservation(
      req.params.id,
      req.user.userId,
      req.body
    );
    res.json(updated);
  } catch (err) {
    const status = err.status || 409;
    res.status(status).json({ message: err.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    await reservationService.deleteReservation(
      req.params.id,
      req.user.userId
    );
    res.status(204).send();
  } catch (err) {
    const status = err.status || 404;
    res.status(status).json({ message: err.message });
  }
}

exports.getAvailability = async (req, res) => {
  const rows = await reservationService.getAvailability(
    req.params.courtId,
    req.query.date
  );
  res.json(rows.map(r => ({
    start: toLocalISO(r.startTime),
    end:   toLocalISO(r.endTime)
  })));
};
