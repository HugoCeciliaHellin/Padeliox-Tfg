require('dotenv').config();
const { Sequelize } = require('sequelize');

const DB_PORT = process.env.DB_PORT || 3306;

const sequelize = new Sequelize(
  process.env.DB_NAME,       
  process.env.DB_USER,       
  process.env.DB_PASSWORD,   
  {
    host: process.env.DB_HOST,
    port: parseInt(DB_PORT, 10),
    dialect: 'mysql',
    logging: false,           
    timezone: '+02:00',          
    dialectOptions: {
      charset: 'utf8mb4',
      dateStrings: true,          
      typeCast: true
    }  
  }
);

module.exports = sequelize;
