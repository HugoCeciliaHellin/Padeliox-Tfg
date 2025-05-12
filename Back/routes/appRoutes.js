const authMiddleware = require('./middlewares/authMiddleware');

app.use('/api/tournaments', authMiddleware, tournamentsRoutes);
app.use('/api/reservas', authMiddleware, reservasRoutes);