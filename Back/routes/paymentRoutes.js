const express = require('express');
const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const paymentCtrl = require('../controllers/paymentController');


router.post('/create-session', auth, paymentCtrl.createSession);


module.exports = router;
