const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const auth    = require('../middlewares/authMiddleware');
const reservationController = require('../controllers/reservationController');
const organizerOnly = require('../middlewares/organizerOnly');


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
  reservationController.createReservation
);

router.get('/', reservationController.listMyReservations);

router.put('/:id',
  body('startTime').optional().isISO8601(),
  body('endTime').optional().isISO8601(),
  reservationController.updateReservation
);
router.delete('/past', reservationController.deletePastReservations);

router.delete('/:id/result', reservationController.removeMatchResult);

router.delete('/:id', reservationController.deleteReservation);



router.put(
  '/:id/result',
  body('result').isIn(['win','loss']),
  reservationController.setMatchResult
);



module.exports = router;
