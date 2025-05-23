//controllers/reservationController.js
const reservationService = require('../services/reservationService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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

exports.deleteReservation = async (req, res, next) => {
  try {
    const r = await reservationService.getByIdAndUser(req.params.id, req.user.userId);
    if (r.paymentIntentId && !r.refunded) {
      await stripe.refunds.create({ payment_intent: r.paymentIntentId });
      await r.update({ refunded: true });
    }
    await reservationService.deleteReservation(req.params.id, req.user.userId);
    res.status(204).send();
  } catch (err) {
    const status = err.status || 404;
    res.status(status).json({ message: err.message });
  }
};

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

exports.deletePastReservations = async (req, res, next) => {
  try {
    const deletedCount = await reservationService.deletePastReservations(req.user.userId);
    res.json({ deletedCount });
  } catch (err) {
     next(err);
   }
 }
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

exports.listAllFutureReservations = async (req, res) => {
  try {
    const now = new Date();
    // Incluye datos de usuario y pista si tienes asociaciones (ajusta según tus modelos)
    const reservas = await Reservation.findAll({
      where: { endTime: { [Op.gt]: now } },
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Court, attributes: ['id', 'clubName', 'city'] }
      ],
      order: [['startTime', 'ASC']]
    });

    // Opcional: mapea solo los campos que quieras mostrar
    res.json(reservas.map(r => ({
      id: r.id,
      pista: r.Court ? r.Court.clubName : r.courtId,
      ciudad: r.Court ? r.Court.city : '',
      usuario: r.User ? r.User.username : r.userId,
      email: r.User ? r.User.email : '',
      inicio: r.startTime,
      fin: r.endTime
    })));
  } catch (err) {
    res.status(500).json({ message: 'Error buscando reservas', error: err.message });
  }
};