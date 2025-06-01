const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY.trim());

async function createCheckoutSession({
  userId,
  courtId,
  startTime,
  endTime,
  amount,
  successUrl,
  cancelUrl
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: `Reserva pista #${courtId}`
        },
        unit_amount: Math.round(amount * 100)
      },
      quantity: 1
    }],
    metadata: {
      userId: String(userId),
      courtId: String(courtId),
      startTime,
      endTime
    },
    success_url: successUrl,
    cancel_url: cancelUrl
  });

  return session;
}

module.exports = { createCheckoutSession };
