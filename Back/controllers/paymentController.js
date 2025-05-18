// src/controllers/paymentController.js
const paymentService = require('../services/paymentService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createSession = async (req, res, next) => {
  const { courtId, startTime, endTime, amount } = req.body;
  const domain = process.env.FRONTEND_URL || 'http://localhost:3001';

  try {
    const session = await paymentService.createCheckoutSession({
      userId:    req.user.userId,
      courtId,
      startTime,
      endTime,
      amount,
      successUrl: `${domain}/app/reservas?paid=true`,
      cancelUrl:  `${domain}/app/reservar/${courtId}?canceled=true`
    });
    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

exports.webhook = async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    try {
      await paymentService.handleWebhook(event);
    } catch (err) {
      console.error('Error processing checkout.session.completed:', err);
      return res.status(500).end();
    }
  }

  // Acknowledge receipt of all events
  res.json({ received: true });
};
