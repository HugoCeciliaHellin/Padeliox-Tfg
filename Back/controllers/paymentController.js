// controller/paymentController.js
const paymentService = require('../services/paymentService');
const reservationService = require('../services/reservationService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY.trim());
const { Court } = require('../models');

// Crear sesión de pago
exports.createSession = async (req, res, next) => {
  const { courtId, startTime, endTime } = req.body;
  const domain = process.env.FRONTEND_URL?.replace(/\/+$/, '') || 'http://localhost:3001';

  // Consulta el precio real de la pista (backend authority)
  const court = await Court.findByPk(courtId);
  if (!court) return res.status(404).json({ message: 'Pista no encontrada' });

  const amount = court.price;
  const successUrl = `${domain}/app/reservas?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${domain}/app/reservar/${courtId}?canceled=true`;

  // ✅ Pon el console.log DESPUÉS de definir successUrl
  console.log('SUCCESS_URL:', successUrl);

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


// Confirmar pago y crear reserva
exports.completeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    console.log('[STRIPE][COMPLETE] Recibido sessionId:', sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('[STRIPE][COMPLETE] Sesión Stripe:', session);


    // IMPRESCINDIBLE: SOLO crea la reserva si el pago está COMPLETADO
    if (session.payment_status !== 'paid') {
      console.log('🎟️ [STRIPE SESSION EN /payments/complete]', JSON.stringify(session, null, 2));
      return res.status(402).json({ message: 'El pago no está completado. Estado: ' + session.payment_status });
    }

    const { userId, courtId, startTime, endTime } = session.metadata;

    const reservation = await reservationService.createReservation({
      userId:    parseInt(userId, 10),
      courtId:   parseInt(courtId, 10),
      startTime,
      endTime
    });
    res.status(201).json(reservation);
  } catch (err) {
    console.error('[STRIPE][COMPLETE] ERROR:', err);
    next(err);
  }
};
