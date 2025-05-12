// index.js
require('dotenv').config();           // 1️⃣ Siempre lo primero
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courtRoutes       = require('./routes/courtRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

// Variables de entorno
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3001';

// Middlewares
app.use(express.json());
app.use(cors());   // permite cualquier origen

// Rutas públicas
app.use('/api/auth', authRoutes);

app.use('/api/courts', courtRoutes);
app.use('/api/reservations', reservationRoutes);



// Ruta protegida de ejemplo (más adelante añade authMiddleware)
app.get('/api/protected', (req, res) => {
  res.json({ message: 'Ruta protegida' });
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
