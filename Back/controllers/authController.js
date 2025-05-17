// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Registro de usuario
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Validar campos
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'Usuario registrado', userId: newUser.id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const accessToken = jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '10h' }
  );

  // 2️⃣ Refresh token de larga vida
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  // 3️⃣ Guardar el refresh token en tu base de datos o cache
  await User.update({ refreshToken }, { where: { id: user.id } });

  // 4️⃣ Enviar ambos al cliente
  res.json({ accessToken, refreshToken, userId: user.id, role: user.role, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
const refreshAccessToken = async (req,res) => {
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


module.exports = { register, login, refreshAccessToken };