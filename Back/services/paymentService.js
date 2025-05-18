const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { Reservation, User } = require('../models');

async function createCheckoutSession({ userId, courtId, startTime, endTime, amount, successUrl, cancelUrl }) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('Usuario no encontrado');
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: user.email,
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: `Reserva pista #${courtId}`,
          description: `${startTime} → ${endTime}`
        },
        unit_amount: Math.round(amount * 100)
      },
      quantity: 1
    }],
    metadata: { reservationMeta: JSON.stringify({ userId, courtId, startTime, endTime }) },
    success_url: successUrl,
    cancel_url: cancelUrl
  });
  return session;
}

async function handleWebhook(event) {
  if (event.type === 'checkout.session.completed') {
    const sess = event.data.object;
    const meta = JSON.parse(sess.metadata.reservationMeta);
    // Actualiza la reserva pre-creada o crea si no existe
    const [r] = await Reservation.findOrCreate({
      where: { userId: meta.userId, courtId: meta.courtId, startTime: meta.startTime },
      defaults: {
        endTime: meta.endTime,
        paymentIntentId: sess.payment_intent
      }
    });
    if (!r.paymentIntentId) {
      r.paymentIntentId = sess.payment_intent;
      await r.save();
    }
  }
}

module.exports = { createCheckoutSession, handleWebhook };
