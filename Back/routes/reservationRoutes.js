//routes/reservationRoutes.js
const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const auth    = require('../middlewares/authMiddleware');
const reservationController = require('../controllers/reservationController');

router.use(auth);

// crear reserva
router.post('/',
  body('courtId').isInt(),
  body('startTime').isISO8601(),
  body('endTime').isISO8601(),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  },
  reservationController.createReservation
);

// listar mis reservas
router.get('/', reservationController.listMyReservations);

// editar reserva
router.put('/:id',
  body('startTime').optional().isISO8601(),
  body('endTime').optional().isISO8601(),
  reservationController.updateReservation
);

// borrar reserva
router.delete('/:id', reservationController.deleteReservation);


module.exports = router;
