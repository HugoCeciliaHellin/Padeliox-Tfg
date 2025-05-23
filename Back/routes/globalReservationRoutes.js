// routes/globalReservationRoutes.js
const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const organizerOnly = require('../middlewares/organizerOnly');
const globalCtrl = require('../controllers/globalReservationController');

// Solo organizers autenticados pueden ver todas las reservas
router.use(auth, organizerOnly);
router.get('/', globalCtrl.listAll);

module.exports = router;
