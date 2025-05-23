// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('organizer', 'player'),
    allowNull: false
  },
  refreshToken: {                   // <–– nuevo
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = User;