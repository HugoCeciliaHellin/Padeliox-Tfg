// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, refreshAccessToken, logout } = require('../controllers/authController');
const { body, validationResult } = require('express-validator');

router.post('/register',
  body('username').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['player', 'organizer']),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  },
  register
);

router.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  },
  login
);

// Refrescar token
router.post('/token', refreshAccessToken);

// Logout
router.post('/logout', logout);

module.exports = router;
