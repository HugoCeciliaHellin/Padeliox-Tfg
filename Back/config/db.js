// config/db.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

// Lee también el puerto de MySQL (por si no usas el 3306 por defecto)
const DB_PORT = process.env.DB_PORT || 3306;

const sequelize = new Sequelize(
  process.env.DB_NAME,       // nombre de la BD
  process.env.DB_USER,       // usuario
  process.env.DB_PASSWORD,   // contraseña
  {
    host: process.env.DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false            // desactiva logs SQL en producción
  }
);

module.exports = sequelize;
