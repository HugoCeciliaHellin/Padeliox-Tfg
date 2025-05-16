// controllers/courtController.js
const { Op } = require('sequelize');
const { toLocalISO } = require('../utils/date');
const reservationService = require('../services/reservationService');
const { Court } = require('../models');



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

exports.getAvailability = async (req, res) => {
  const rows = await reservationService.getAvailability(
    req.params.id,
    req.query.date
  );
  return res.json(
    rows.map(r => ({
      start: toLocalISO(r.startTime),
      end:   toLocalISO(r.endTime)
    }))
  );
};