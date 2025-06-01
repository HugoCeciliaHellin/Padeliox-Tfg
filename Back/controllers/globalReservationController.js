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

    const parseDate = d =>
      !d ? ''
      : typeof d === 'string'
        ? d.replace('T', ' ').slice(0, 16)
        : d instanceof Date
          ? d.toISOString().replace('T', ' ').slice(0, 16)
          : '';

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
      const parser = new Parser();
      const csvEmpty = parser.parse([]);
      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="reservas_padelliox.csv"'
      });
      return res.send(csvEmpty);
    }

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="reservas_padelliox.csv"'
    });
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
