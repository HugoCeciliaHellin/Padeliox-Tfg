const sequelize     = require('../config/db');
const User          = require('./User');
const Court         = require('./Court');
const Reservation   = require('./Reservation');

// Asociaciones
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

Court.hasMany(Reservation, { foreignKey: 'courtId' });
Reservation.belongsTo(Court, { foreignKey: 'courtId' });



module.exports = {
  sequelize,
  User,
  Court,
  Reservation
};
