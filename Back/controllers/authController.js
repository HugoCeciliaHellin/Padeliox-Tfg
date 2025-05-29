// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Registro de usuario
const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'Usuario registrado', userId: newUser.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Login de usuario
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '10h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    await User.update({ refreshToken }, { where: { id: user.id } });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        role: user.role,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Refrescar access token
const refreshAccessToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  let payload;
  try { payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); }
  catch { return res.sendStatus(403); }

  const user = await User.findByPk(payload.userId);
  if (!user || user.refreshToken !== refreshToken) return res.sendStatus(403);

  const newAccessToken = jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '10h' }
  );
  res.json({ accessToken: newAccessToken });
};

// Logout
const logout = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'No token provided' });
  try {
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) return res.status(200).json({ message: 'Logout OK' });
    await user.update({ refreshToken: null });
    res.status(200).json({ message: 'Logout OK' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refreshAccessToken, logout };
