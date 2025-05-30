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
const PORT = parseInt(process.env.PORT, 10) || 3000;
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
app.set('trust proxy', 1); // Para entorno local con proxies/reverse proxies y rate-limit



// Error handler universal y friendly
app.use((err, req, res, next) => {
  // 1. Express-validator: convierte errors array a mensaje
  if (err.errors && Array.isArray(err.errors)) {
    return res.status(err.status || 400).json({
      message: err.errors.map(e => e.msg).join(' | '),
      errors: err.errors
    });
  }
  // 2. Sequelize errores de unicidad
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: err.errors?.[0]?.message || 'Ya existe un registro con ese valor único.'
    });
  }
  // 3. Otros errores de Sequelize
  if (err.name && err.name.startsWith('Sequelize')) {
    return res.status(400).json({ message: err.message });
  }
  // 4. Errores de validación manual (throw new Error('msg'))
  if (err.message) {
    return res.status(err.status || 400).json({ message: err.message });
  }
  // 5. Fallback por si acaso
  res.status(500).json({ message: 'Error inesperado en el servidor.' });
});

// Arranque
sequelize.sync()
.then(() => app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`)))
.catch(err => {
  console.error('❌ Error al conectar con la base de datos:', err);
  process.exit(1);
});

