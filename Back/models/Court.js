const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Court = sequelize.define('Court', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clubName: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  surface: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  hasLights: { type: DataTypes.BOOLEAN, defaultValue: false },
  hasLockerRoom: { type: DataTypes.BOOLEAN, defaultValue: false },
  imageUrl: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'courts',
  timestamps: false
});

// Asociación
Court.associate = models => {
  Court.hasMany(models.Reservation, { foreignKey: 'courtId', as: 'reservations' });
};

module.exports = Court;
