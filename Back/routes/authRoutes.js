const express = require('express');
const router = express.Router();
const { register, login, refreshAccessToken, logout } = require('../controllers/authController');
const { body, validationResult } = require('express-validator');

router.post('/register',
  body('username').isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('role').isIn(['player', 'organizer']).withMessage('Rol inválido'),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  },
  register
);

router.post('/login',
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  },
  login
);

router.post('/token', refreshAccessToken);
router.post('/logout', logout);

module.exports = router;

