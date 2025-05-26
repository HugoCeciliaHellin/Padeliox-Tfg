//routes/reservationRoutes.js
const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const auth    = require('../middlewares/authMiddleware');
const reservationController = require('../controllers/reservationController');
const organizerOnly = require('../middlewares/organizerOnly');


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
//Borrar reservas pasadas
router.delete('/past', reservationController.deletePastReservations);

// Borrar resultado de partida
router.delete('/:id/result', reservationController.removeMatchResult);

// borrar reserva
router.delete('/:id', reservationController.deleteReservation);





router.put(
  '/:id/result',
  body('result').isIn(['win','loss']),
  reservationController.setMatchResult
);



module.exports = router;
