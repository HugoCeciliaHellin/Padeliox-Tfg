// index.js
require('dotenv').config();           // 1️⃣ Siempre lo primero
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courtRoutes       = require('./routes/courtRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const paymentCtrl = require('./controllers/paymentController');
const paymentRoutes = require('./routes/paymentRoutes');
const app = express();

// Variables de entorno
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3001';


app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentCtrl.webhook
);

// Middlewares
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

// Rutas públicas
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);

// Gestión global de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor'
  });
});


// Sincronizar DB e iniciar servidor
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor funcionando en http://localhost:${PORT} 🚀`);
    });
  })
  .catch(error => {
    console.error('Error al conectar a la DB:', error);
  });
