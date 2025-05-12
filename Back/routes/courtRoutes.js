// routes/courtRoutes.js
const express = require('express');
const router = express.Router();
const {
  listCourts,
  getCourt,
} = require('../controllers/courtController');

router.get('/', listCourts);
router.get('/:id', getCourt);

module.exports = router;
