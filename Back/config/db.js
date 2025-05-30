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
    port: parseInt(DB_PORT, 10),
    dialect: 'mysql',
    logging: false,            // desactiva logs SQL en producción
    timezone: '+02:00',           // <<< <- almacena/lee en UTC+2
    dialectOptions: {
      dateStrings: true,          // recibe DATETIME como strings
      typeCast: true
    }  
  }
);

module.exports = sequelize;
