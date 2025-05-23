// services/paymentService.js
const { User } = require('../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY.trim());

async function createCheckoutSession({ userId, courtId, startTime, endTime, amount, successUrl, cancelUrl }) {
  const user = await User.findByPk(userId);
  if (!user?.email) throw new Error('Usuario sin email');
  return stripe.checkout.sessions.create({
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
    metadata: { userId, courtId, startTime, endTime },
    success_url: successUrl,
    cancel_url: cancelUrl
  });
}

module.exports = { createCheckoutSession };
