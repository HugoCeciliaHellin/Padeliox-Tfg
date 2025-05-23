// /routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const paymentCtrl = require('../controllers/paymentController');

router.post('/create-session', auth, paymentCtrl.createSession);
router.post('/complete',       auth, paymentCtrl.completeSession);

module.exports = router;
