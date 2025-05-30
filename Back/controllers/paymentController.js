// controllers/paymentController.js
const paymentService = require('../services/paymentService');
const reservationService = require('../services/reservationService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY.trim());
const { Court } = require('../models');

// Crear sesión de pago
exports.createSession = async (req, res, next) => {
  const { courtId, startTime, endTime } = req.body;
  const domain = process.env.FRONTEND_URL?.replace(/\/+$/, '') || 'http://localhost:3001';

  const court = await Court.findByPk(courtId);
  if (!court) return res.status(404).json({ message: 'Pista no encontrada' });

  const amount = court.price;
  const successUrl = `${domain}/app/reservas?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${domain}/app/reservar/${courtId}?canceled=true`;

  try {
    const session = await paymentService.createCheckoutSession({
      userId: req.user.userId,
      courtId,
      startTime,
      endTime,
      amount,
      successUrl,
      cancelUrl
    });
    res.json({ id: session.id });
  } catch (err) {
    next(err);
  }
};

// Finalizar sesión de pago
exports.completeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Metadata recibida:', session.metadata); // 👈 Aquí está bien

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ message: 'El pago no está completado. Estado: ' + session.payment_status });
    }

    const { userId, courtId, startTime, endTime } = session.metadata;

    const existing = await reservationService.findByUserCourtAndTime({
      userId: parseInt(userId, 10),
      courtId: parseInt(courtId, 10),
      startTime,
      endTime
    });

    if (existing) {
      // ✅ Lanza error controlado para evitar éxito falso en frontend
      return res.status(409).json({ message: 'Ya tenías una reserva registrada para ese horario.' });
    }

    const reservation = await reservationService.createReservation({
      userId: parseInt(userId, 10),
      courtId: parseInt(courtId, 10),
      startTime,
      endTime,
      paymentIntentId: session.payment_intent || null
    });

    res.status(201).json(reservation);
  } catch (err) {
    if (err.message === 'La franja ya está ocupada') {
      return res.status(409).json({ message: 'La franja horaria seleccionada ya está ocupada. Por favor, elige otra.' });
    }
    next(err);
  }
};
