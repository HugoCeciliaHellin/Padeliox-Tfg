//controllers/reservationController.js
const reservationService = require('../services/reservationService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { toLocalISO } = require('../utils/date');

exports.createReservation = async (req, res, next) => {
  try {
    const { courtId, startTime, endTime } = req.body;
    const userId = req.user.userId;

    const existing = await reservationService.findByUserCourtAndTime({
      userId, courtId, startTime, endTime
    });

    if (existing) {
      return res.status(409).json({ message: 'Ya tienes una reserva para ese horario' });
    }

    const reservation = await reservationService.createReservation({
      userId, courtId, startTime, endTime
    });

    res.status(201).json(reservation);
  } catch (err) {
    if (err.message === 'La franja ya está ocupada') {
      return res.status(409).json({ message: err.message });
    }
    next(err);
  }
};



exports.listMyReservations = async (req, res, next) => {
  try {
    const rows = await reservationService.listMyReservations(req.user.userId);
    res.json(rows.map(r => {
      const j = r.toJSON();
      return {
        ...j,
        startTime: toLocalISO(j.startTime),
        endTime: toLocalISO(j.endTime)
      };
    }));
  } catch (err) {
    next(err);
  }
};

exports.updateReservation = async (req, res, next) => {
  try {
    const updated = await reservationService.updateReservation(
      req.params.id,
      req.user.userId,
      req.body
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const r = await reservationService.getByIdAndUser(req.params.id, req.user.userId);
    let reembolsado = false;
    if (r.paymentIntentId && !r.refunded) {
      await stripe.refunds.create({ payment_intent: r.paymentIntentId });
      await r.update({ refunded: true });
      reembolsado = true;
    }
    await reservationService.deleteReservation(req.params.id, req.user.userId);
    // Ahora devuelve JSON indicando si hubo reembolso:
    res.json({ deleted: true, refunded: reembolsado });
  } catch (err) {
    next(err);
  }
};

exports.getAvailability = async (req, res, next) => {
  try {
    const rows = await reservationService.getAvailability(
      req.params.courtId,
      req.query.date
    );
    res.json(rows.map(r => ({
      start: toLocalISO(r.startTime),
      end: toLocalISO(r.endTime)
    })));
  } catch (err) {
    next(err);
  }
};

exports.deletePastReservations = async (req, res, next) => {
  try {
    const deletedCount = await reservationService.deletePastReservations(req.user.userId);
    res.json({ deletedCount });
  } catch (err) {
    next(err);
  }
};

exports.setMatchResult = async (req, res, next) => {
  try {
    const updated = await reservationService.setMatchResult(
      req.params.id,
      req.user.userId,
      req.body.result
    );
    res.json({
      id: updated.id,
      result: updated.result
    });
  } catch (err) {
    next(err);
  }
};

exports.removeMatchResult = async (req, res, next) => {
  try {
    const updated = await reservationService.setMatchResult(
      req.params.id,
      req.user.userId,
      null
    );
    res.json({ id: updated.id, result: updated.result });
  } catch (err) {
    next(err);
  }
};
