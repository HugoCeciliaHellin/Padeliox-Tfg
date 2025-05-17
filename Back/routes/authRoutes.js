// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, refreshAccessToken } = require('../controllers/authController');

// Registro
router.post('/register', register);

// Login
router.post('/login', login);

// Refrescar token
router.post('/token', refreshAccessToken);

module.exports = router;