// controllers/courtController.js
const  Court  = require('../models/Court');
const { Op } = require('sequelize');

exports.listCourts = async (req, res) => {
  const {
    search,        // texto libre (clubName o city)
    maxPrice,
    surface,
    hasLights,
    hasLockerRoom
  } = req.query;

  // Construye filtros de forma dinámica
  const where = {};
  if (search) {
    where[Op.or] = [
      { clubName: { [Op.like]: `%${search}%` } },
      { city:     { [Op.like]: `%${search}%` } }
    ];
  }
  if (maxPrice)      where.price = { [Op.lte]: maxPrice };
  if (surface)       where.surface = surface;
  if (hasLights)     where.hasLights = hasLights === 'true';
  if (hasLockerRoom) where.hasLockerRoom = hasLockerRoom === 'true';

  const courts = await Court.findAll({ where });
  res.json(courts);
};

exports.getCourt = async (req, res) => {
  const court = await Court.findByPk(req.params.id);
  if (!court) return res.status(404).json({ message: 'Pista no encontrada' });
  res.json(court);
};
