// models/Court.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Court = sequelize.define('Court', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clubName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  surface: {
    type: DataTypes.ENUM('césped','hormigón','moqueta','césped sintético'),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(6,2),
    allowNull: false
  },
  hasLights: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  hasLockerRoom: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'courts',
  timestamps: false
});

module.exports = Court;
