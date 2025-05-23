// File: controllers/globalReservationController.js
const { Reservation, User, Court } = require('../models');
const { Op } = require('sequelize');

// Lista TODAS las reservas próximas (solo organizers pueden acceder)
exports.listAll = async (req, res, next) => {
  try {
    const now = new Date();
    const reservas = await Reservation.findAll({
      where: { endTime: { [Op.gt]: now } },
      include: [
        { model: User, attributes: ['id', 'username', 'email', 'role'] },
        { model: Court, attributes: ['id', 'clubName', 'city', 'surface'] }
      ],
      order: [['startTime', 'ASC']]
    });
    res.json(reservas);
  } catch (err) {
    next(err);
  }
};
