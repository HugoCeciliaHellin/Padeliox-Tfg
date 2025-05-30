// models/Court.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const VALID_SURFACES = ['césped','hormigón','moqueta','césped sintético'];

const Court = sequelize.define('Court', {
  clubName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true }},
  city: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true }},
  surface: { 
    type: DataTypes.ENUM(...VALID_SURFACES), 
    allowNull: false, 
    validate: { isIn: [VALID_SURFACES] }
  },
  price: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 1 }},
  hasLights: { type: DataTypes.BOOLEAN, defaultValue: false },
  hasLockerRoom: { type: DataTypes.BOOLEAN, defaultValue: false },
  imageUrl: { type: DataTypes.STRING }
}, {
  timestamps: false,
  tableName: 'courts'
});

module.exports = Court;