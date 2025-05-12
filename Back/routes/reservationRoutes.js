// routes/reservationRoutes.js
const express = require('express');
const router  = express.Router();            // ← ¡Muy importante!
const { body, validationResult } = require('express-validator');
const auth    = require('../middlewares/authMiddleware');
const {
  createReservation,
  listMyReservations,
  updateReservation,
  deleteReservation
} = require('../controllers/reservationController');

// Todas las rutas aquí usan `router`, no `app`
router.use(auth);

router.post('/',
  body('courtId').isInt(),
  body('startTime').isISO8601(),
  body('endTime').isISO8601(),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  },
  createReservation
);

router.get('/', listMyReservations);

router.put('/:id',
  body('startTime').optional().isISO8601(),
  body('endTime').optional().isISO8601(),
  updateReservation
);

router.delete('/:id', deleteReservation);

module.exports = router;
