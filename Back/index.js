// index.js 
require('dotenv').config();

const requiredEnvs = [
  'DB_HOST','DB_PORT','DB_NAME','DB_USER',
  'JWT_SECRET','REFRESH_TOKEN_SECRET',
  'STRIPE_SECRET_KEY',
  'FRONTEND_URL','CORS_ORIGIN'
];
const missing = requiredEnvs.filter(k => !process.env[k]?.trim());
if (missing.length) {
  console.error('🚨 Faltan estas vars de entorno:', missing.join(', '));
  process.exit(1);
}

const stripeKey = process.env.STRIPE_SECRET_KEY.trim();                       
if (!/^sk_(test|live)_/.test(stripeKey)) {
  console.error('❌ STRIPE_SECRET_KEY inválido:', stripeKey);
  process.exit(1);
}
const stripe = require('stripe')(stripeKey);

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courtRoutes = require('./routes/courtRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const globalReservationRoutes = require('./routes/globalReservationRoutes');

const app = express();
const PORT = +process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const rateLimit = require('./middlewares/rateLimit');
app.use(rateLimit);


app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/global-reservations', globalReservationRoutes);



// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

// Arranque
sequelize.sync()
.then(() => app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`)))
.catch(console.error);
