//routes/courtRoutes.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const {
  listCourts,
  getCourt,
  getAvailability   // lo importas desde tu controller
} = require('../controllers/courtController');

router.get('/', listCourts);
router.get('/:id', getCourt);
router.get('/:id/availability', auth, getAvailability);

module.exports = router;
