// controllers/globalReservationController.js
const { Reservation, User, Court } = require('../models');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');

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
exports.exportCSV = async (req, res, next) => {
  try {
    const now = new Date();
    const reservas = await Reservation.findAll({
      where: { endTime: { [Op.gt]: now } },
      include: [
        { model: User, attributes: ['username', 'email'] },
        { model: Court, attributes: ['clubName', 'city', 'surface'] }
      ],
      order: [['startTime', 'ASC']]
    });

    // Utilidad segura para formatear fechas
    const parseDate = d =>
      !d ? ''
      : typeof d === 'string'
        ? d.replace('T', ' ').slice(0, 16)
        : d instanceof Date
          ? d.toISOString().replace('T', ' ').slice(0, 16)
          : '';

    // Formatear filas para CSV
    const rows = reservas.map(r => ({
      Usuario:    r.User?.username || '',
      Email:      r.User?.email || '',
      Club:       r.Court?.clubName || '',
      Ciudad:     r.Court?.city || '',
      Pista:      r.Court?.surface || '',
      Fecha:      parseDate(r.startTime),
      Hora_Fin:   parseDate(r.endTime),
      Refunded:   r.refunded ? 'Sí' : 'No',
      PaymentId:  r.paymentIntentId || ''
    }));

    if (!rows.length) {
      return res.status(400).json({ message: 'No hay reservas futuras para exportar.' });
    }

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.header('Content-Type', 'text/csv');
    res.attachment('reservas_padelliox.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
